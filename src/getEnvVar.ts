// src/getEnvVar.ts
export async function getEnvVar(key: string): Promise<string> {
  const isTest = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;
  const isNode = typeof process !== 'undefined' && process.versions?.node;

  if (isTest || isNode) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

 // eslint-disable-next-line @typescript-eslint/no-require-imports
const { viteEnv } = await import ('./viteEnv');

  return viteEnv(key);
}

// export function getEnvVar(key: string): string {
//   // Check if the environment is Node.js or testing (e.g., Jest)
//   const isTest = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;
//   const isNode = typeof process !== 'undefined' && process.versions?.node;

//   if (isTest || isNode) {
//     // In Node.js or testing environment, use process.env
//     const value = process.env[key];
//     if (!value) {
//       throw new Error(`Missing required environment variable: ${key}`);
//     }
//     return value;
//   }

//   // In the browser (Vite), use import.meta.env for environment variables
//   const viteEnvValue = import.meta.env[key];
//   if (!viteEnvValue) {
//     throw new Error(`Missing required environment variable: ${key}`);
//   }

//   return viteEnvValue;
// }
