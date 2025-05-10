// Asynchronously retrieves an environment variable by key
export async function getEnvVar(key: string): Promise<string> {
  // Determine if the code is running in Jest or Node.js
  const isTest = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;
  const isNode = typeof process !== 'undefined' && process.versions?.node;

  // If in a Node.js or test environment, read from process.env
  if (isTest || isNode) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

// If running in Vite, use viteEnv helper  
const { viteEnv } = await import ('./viteEnv');

  return viteEnv(key);
}
