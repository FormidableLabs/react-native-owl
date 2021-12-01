const { startWebSocketServer } = require('../dist/websocket');
const { Logger } = require('../dist/logger');

const debug = process.env.OWL_DEBUG === 'true';
const logger = new Logger(!!debug);

(async function () {
  try {
    await startWebSocketServer(logger);
  } catch (e) {
    logger.error(`[OWL] Websocket server failed to start: ${e}`);
    process.exit(1);
  }
})();
