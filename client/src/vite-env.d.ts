/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ARBITRAGE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
