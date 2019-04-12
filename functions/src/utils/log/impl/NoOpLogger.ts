import { Logger } from "../Logger";

class NoOpLogger implements Logger {
  debug(body: any, extra: any = undefined) {
    // no-op
  }

  error(body: any, extra: any = undefined) {
    // no-op
  }

  info(body: any, extra: any = undefined) {
    // no-op
  }

  trace(body: any, extra: any = undefined) {
    // no-op
  }

  warn(body: any, extra: any = undefined) {
    // no-op
  }

  fatal(body: any, extra: any = undefined) {
    // no-op
  }
}

export { NoOpLogger };
