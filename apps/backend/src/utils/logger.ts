type LogLevel = "debug" | "info" | "warn" | "error";

const isProd = process.env.NODE_ENV === "production";

function shouldLog(level: LogLevel): boolean {
  if (!isProd) return true;
  return level === "warn" || level === "error";
}

function safeMessage(message: unknown): string {
  if (message instanceof Error) return message.message;
  if (typeof message === "string") return message;
  try {
    return JSON.stringify(message);
  } catch {
    return String(message);
  }
}

export const logger = {
  debug: (message: unknown, meta?: unknown) => {
    if (!shouldLog("debug")) return;
    if (meta === undefined) console.debug(safeMessage(message));
    else console.debug(safeMessage(message), meta);
  },
  info: (message: unknown, meta?: unknown) => {
    if (!shouldLog("info")) return;
    if (meta === undefined) console.info(safeMessage(message));
    else console.info(safeMessage(message), meta);
  },
  warn: (message: unknown, meta?: unknown) => {
    if (!shouldLog("warn")) return;
    if (meta === undefined) console.warn(safeMessage(message));
    else console.warn(safeMessage(message), meta);
  },
  error: (message: unknown, meta?: unknown) => {
    if (!shouldLog("error")) return;
    if (meta === undefined) console.error(safeMessage(message));
    else console.error(safeMessage(message), meta);
  },
};

