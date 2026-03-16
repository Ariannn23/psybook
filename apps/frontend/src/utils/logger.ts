type LogLevel = "debug" | "info" | "warn" | "error";

const isProd = import.meta.env.PROD;

function shouldLog(level: LogLevel): boolean {
  if (!isProd) return true;
  return level === "warn" || level === "error";
}

export const logger = {
  debug: (message: unknown, ...optionalParams: unknown[]) => {
    if (!shouldLog("debug")) return;
    console.debug(message, ...optionalParams);
  },
  info: (message: unknown, ...optionalParams: unknown[]) => {
    if (!shouldLog("info")) return;
    console.info(message, ...optionalParams);
  },
  warn: (message: unknown, ...optionalParams: unknown[]) => {
    if (!shouldLog("warn")) return;
    console.warn(message, ...optionalParams);
  },
  error: (message: unknown, ...optionalParams: unknown[]) => {
    if (!shouldLog("error")) return;
    console.error(message, ...optionalParams);
  },
};

