/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PB_URL: string;
  readonly VITE_DISCORD_WEBHOOK_URL: string;
  readonly VITE_DISCORD_CHANNEL_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
