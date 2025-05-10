// Retrieves a Vite environment variable by key at runtime
export const viteEnv = (key: string): string => {
  // Access the value from Vite's environment object
  const value = import.meta.env[key];

  // Throw an error if the variable isn't defined
  if (!value) {
    throw new Error(`Missing Vite env var: ${key}`);
  }
  return value;
};
  