const { startWebSocketServer } = require('../lib/commonjs/websocket');
const { Logger } = require('../lib/commonjs/logger');

const debug = process.env.OWL_DEBUG === 'true';
const logger = new Logger(!!debug);

(async function () {
  try {
    await startWebSocketServer(logger);
  } catch (e) {
    logger.error(`[OWL - Websocket] Websocket server failed to start: ${e}`);
    process.exit(1);
  }
})();
