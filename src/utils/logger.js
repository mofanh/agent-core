// Logger 日志类
class Logger {
  constructor(level = 'info') {
    this.level = level;
  }
  info(...args) {
    if (['info', 'debug'].includes(this.level)) {
      console.info('[INFO]', ...args);
    }
  }
  warn(...args) {
    if (['warn', 'info', 'debug'].includes(this.level)) {
      console.warn('[WARN]', ...args);
    }
  }
  error(...args) {
    console.error('[ERROR]', ...args);
  }
  debug(...args) {
    if (this.level === 'debug') {
      console.debug('[DEBUG]', ...args);
    }
  }
}

export default Logger;
