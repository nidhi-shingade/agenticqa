/**
 * Reads required configuration from the environment. Fails fast with a clear message
 * so a run never silently targets the wrong place or runs without credentials.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const testUser = {
  get username(): string {
    return requireEnv('QA_TEST_USER');
  },
  get password(): string {
    return requireEnv('QA_TEST_PASSWORD');
  },
};
