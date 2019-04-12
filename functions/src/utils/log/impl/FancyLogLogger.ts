import { Logger } from "../Logger";
import { injectable } from "inversify";

import * as log from "fancy-log";

@injectable()
class FancyLogLogger implements Logger {
  transform(body: any): string {
    if (typeof body === "string") {
      return body
    } else if (typeof body === "number") {
      return body.toString()
    } else {
      return JSON.stringify(body)
    }
  }

  trace(body: any, extra: any = undefined) {
    log(this.transform(body));
    if (extra) {
      log(this.transform(extra));
    }
  }

  debug(body: any, extra: any = undefined) {
    log(this.transform(body));
    if (extra) {
      log(this.transform(extra));
    }
  }

  info(body: any, extra: any = undefined) {
    log(this.transform(body));
    if (extra) {
      log(this.transform(extra));
    }
  }

  warn(body: any, extra: any = undefined) {
    log(this.transform(body));
    if (extra) {
      log(this.transform(extra));
    }
  }

  error(body: any, extra: any = undefined) {
    log.error(this.transform(body));
    if (extra) {
      log.error(this.transform(extra));
    }
  }

  fatal(body: any, extra: any = undefined) {
    log.error(this.transform(body));
    if (extra) {
      log.error(this.transform(extra));
    }
  }
}

export { FancyLogLogger };
