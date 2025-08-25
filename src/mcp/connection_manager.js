// MCPConnectionManager：管理多个 MCP 服务器连接
const MCPClient = require('./client');

class MCPConnectionManager {
  constructor(configs) {
    this.clients = {};
    this.configs = configs; // { serverName: { command, args, ... } }
  }

  getClient(serverName) {
    if (!this.clients[serverName]) {
      this.clients[serverName] = new MCPClient(this.configs[serverName]);
    }
    return this.clients[serverName];
  }

  async callTool(serverName, tool, params) {
    const client = this.getClient(serverName);
    return client.sendRequest('tools/call', { tool, params });
  }

  async listTools(serverName) {
    const client = this.getClient(serverName);
    return client.sendRequest('tools/list', {});
  }

  async newConversation(serverName, params) {
    const client = this.getClient(serverName);
    return client.sendRequest('newConversation', params);
  }
}

module.exports = MCPConnectionManager;
