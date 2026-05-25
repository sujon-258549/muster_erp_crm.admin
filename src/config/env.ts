export const env = {
  API_URL: import.meta.env.VITE_API_URL ?? "http://localhost:4500/api/v1",
  APP_NAME: import.meta.env.VITE_APP_NAME ?? "Muster ERP CRM",
  APP_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const
