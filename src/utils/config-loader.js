/**
 * Config Loader for agent-core
 * - Supports Codex-style TOML config (~/.agent-core/config.toml) with [mcp_servers]
 * - Also supports JSON (~/.agent-core/config.json) to keep backward compatibility
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join, extname } from 'path';
import os from 'os';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let tomlParser = null;
try {
  // Load lazily to avoid throwing if unused
  tomlParser = require('toml');
} catch {
  // optional: toml parser missing; we'll handle gracefully
}

const DEFAULT_HOME = join(os.homedir(), '.agent-core');
const DEFAULT_TOML = join(DEFAULT_HOME, 'config.toml');
const DEFAULT_JSON = join(DEFAULT_HOME, 'config.json');

export function resolveConfigPath(customPath) {
  if (customPath && existsSync(customPath)) return customPath;
  if (existsSync(DEFAULT_TOML)) return DEFAULT_TOML;
  if (existsSync(DEFAULT_JSON)) return DEFAULT_JSON;
  return null;
}

export function loadConfig(customPath) {
  const path = resolveConfigPath(customPath);
  if (!path) return { config: {}, path: null, format: null };

  const raw = readFileSync(path, 'utf-8');
  const ext = extname(path).toLowerCase();

  try {
    if (ext === '.toml') {
      if (!tomlParser) throw new Error("Missing 'toml' dependency. Please install it.");
      const parsed = tomlParser.parse(raw);
      return { config: parsed || {}, path, format: 'toml' };
    }
    if (ext === '.json') {
      const parsed = JSON.parse(raw);
      return { config: parsed || {}, path, format: 'json' };
    }
    // Fallback: try TOML then JSON
    if (tomlParser) {
      try { return { config: tomlParser.parse(raw) || {}, path, format: 'toml' }; } catch {}
    }
    return { config: JSON.parse(raw) || {}, path, format: 'json' };
  } catch (e) {
    throw new Error(`Failed to parse config at ${path}: ${e.message}`);
  }
}

/**
 * Map Codex-style [mcp_servers] TOML to agent-core MCP servers array
 */
export function extractMcpServers(cfg) {
  const servers = [];
  // 1) Codex-style: [mcp_servers.<name>]
  if (cfg && cfg.mcp_servers && typeof cfg.mcp_servers === 'object') {
    for (const [name, entry] of Object.entries(cfg.mcp_servers)) {
      if (!entry) continue;
      if (entry.enabled === false) continue; // allow disabling
      servers.push({
        name,
        transport: entry.transport || 'stdio',
        command: entry.command,
        args: entry.args || [],
        env: entry.env || {},
        url: entry.url,
        maxRetries: entry.maxRetries ?? 3,
        retryDelay: entry.retryDelay ?? 5000,
        autoReconnect: entry.autoReconnect ?? true,
        capabilities: entry.capabilities
      });
    }
  }

  // 2) agent-core native shape: { mcp: { servers: [...] } }
  if (cfg && cfg.mcp && Array.isArray(cfg.mcp.servers)) {
    for (const entry of cfg.mcp.servers) {
      if (!entry || entry.enabled === false) continue;
      servers.push(entry);
    }
  }

  // 3) Cursor/Claude-style: { mcpServers: { <name>: { command, args, env } } }
  if (cfg && cfg.mcpServers && typeof cfg.mcpServers === 'object') {
    for (const [name, entry] of Object.entries(cfg.mcpServers)) {
      if (!entry) continue;
      servers.push({
        name,
        transport: 'stdio',
        command: entry.command,
        args: entry.args || [],
        env: entry.env || {}
      });
    }
  }

  return dedupeServers(servers);
}

function dedupeServers(list) {
  const seen = new Set();
  const out = [];
  for (const s of list) {
    const key = s.name || `${s.command}:${(s.args || []).join(' ')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

export function ensureDefaultConfigTemplate() {
  if (!existsSync(DEFAULT_HOME)) mkdirSync(DEFAULT_HOME, { recursive: true });
  if (!existsSync(DEFAULT_TOML)) {
    const template = `# agent-core configuration (Codex-style TOML)
# See docs/mcp_config.md for details.

[mcp_servers.chrome-devtools]
command = "npx"
args = ["chrome-devtools-mcp@latest"]
# Example of passing flags:
# args = ["chrome-devtools-mcp@latest", "--headless=true", "--isolated=true"]
# env = { "EXAMPLE_KEY" = "" }

# You can add more servers under [mcp_servers.<name>]
`;
    writeFileSync(DEFAULT_TOML, template, 'utf-8');
  }
  return DEFAULT_TOML;
}

export function writeConfigFile(path, content) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, content, 'utf-8');
}

export const DEFAULT_PATHS = { DEFAULT_HOME, DEFAULT_TOML, DEFAULT_JSON };
