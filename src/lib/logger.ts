import { env } from "$env/dynamic/private";
import pino from "pino";

export const logger = pino({
  level: env.LOG_LEVEL ?? "warn",
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});
