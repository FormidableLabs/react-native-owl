import { createLogger } from './logger';

describe('logger.ts', () => {
  const logMessage = 'Hello World';

  beforeAll(() => {
    jest.spyOn(global.console, 'info');
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });

  beforeEach(() => {
    (console.info as any).mockReset();
    (console.warn as any).mockReset();
    (console.error as any).mockReset();
  });

  it('should log a message - info', () => {
    const logger = createLogger(true);
    logger.info(logMessage);
    expect(console.info).toHaveBeenCalledWith(logMessage);
  });

  it('should not log a message when disabled - info', () => {
    const logger = createLogger(false);
    logger.info(logMessage);
    expect(console.info).not.toHaveBeenCalled();
  });

  it('should log a message - warn', () => {
    const logger = createLogger(true);
    logger.warn(logMessage);
    expect(console.warn).toHaveBeenCalledWith(logMessage);
  });

  it('should not log a message when disabled - warn', () => {
    const logger = createLogger(false);
    logger.warn(logMessage);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should log a message - error', () => {
    const logger = createLogger(true);
    logger.error(logMessage);
    expect(console.error).toHaveBeenCalledWith(logMessage);
  });

  it('should not log a message when disabled - error', () => {
    const logger = createLogger(false);
    logger.error(logMessage);
    expect(console.error).not.toHaveBeenCalled();
  });
});
