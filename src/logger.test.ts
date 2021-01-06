import { Logger } from './logger';

describe('logger.ts', () => {
  const logMessage = 'Hello World';

  const logInfoMock = jest.spyOn(global.console, 'info');
  const logWarnMock = jest.spyOn(global.console, 'warn');
  const logErrorMock = jest.spyOn(global.console, 'error');
  const logPrintMock = jest.spyOn(global.console, 'log');

  beforeEach(() => {
    logInfoMock.mockReset();
    logWarnMock.mockReset();
    logErrorMock.mockReset();
    logPrintMock.mockReset();
  });

  describe('info', () => {
    it('should log a message', () => {
      const logger = new Logger(true);
      logger.info(logMessage);
      expect(logInfoMock).toHaveBeenCalledWith(logMessage);
    });

    it('should not log a message when disabled', () => {
      const logger = new Logger(false);
      logger.info(logMessage);
      expect(logInfoMock).not.toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should log a message', () => {
      const logger = new Logger(true);
      logger.warn(logMessage);
      expect(logWarnMock).toHaveBeenCalledWith(logMessage);
    });

    it('should not log a message when disabled', () => {
      const logger = new Logger(false);
      logger.warn(logMessage);
      expect(logWarnMock).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log a message', () => {
      const logger = new Logger(true);
      logger.error(logMessage);
      expect(logErrorMock).toHaveBeenCalledWith(logMessage);
    });

    it('should not log a message when disabled', () => {
      const logger = new Logger(false);
      logger.error(logMessage);
      expect(logErrorMock).not.toHaveBeenCalled();
    });
  });

  describe('print', () => {
    it('should log a message', () => {
      const logger = new Logger(true);
      logger.print(logMessage);
      expect(logPrintMock).toHaveBeenCalledWith(logMessage);
    });

    it('should still log a message when disabled', () => {
      const logger = new Logger(false);
      logger.print(logMessage);
      expect(logPrintMock).toHaveBeenCalledWith(logMessage);
    });
  });
});
