/**
 * Waits for the specified amount of time (in milliseconds) before resolving.
 * @param ms: The number of miliseconds the function should wait for.
 */
export const waitFor = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
