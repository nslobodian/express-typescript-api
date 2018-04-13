export type Config = {
  port: number,
  sentry: {
    enabled: boolean,
    dsn: string,
  }
}

export const config: Config = {
  port: parseInt(process.env.API_PORT || '', 10) || 4000,
  sentry: {
    enabled: false,
    dsn: '',
  },
}
