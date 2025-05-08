// src/viteEnv.ts
export const viteEnv = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
      throw new Error(`Missing Vite env var: ${key}`);
    }
    return value;
  };
  