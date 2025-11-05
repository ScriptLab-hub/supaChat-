/// <reference types="vite/client" />

/**
 * Defines the shape of the environment variables that Vite exposes to the client.
 * This provides type safety and autocompletion for `import.meta.env`.
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}