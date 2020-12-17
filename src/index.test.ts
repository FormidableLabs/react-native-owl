import { greetings } from '.';

test('greetings', () => {
  const result = greetings();
  expect(result).toBe('Hello World');
});
