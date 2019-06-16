import * as url from "url";
import * as util from "util";
import chalk from "chalk";
import moment from "moment";
import { inject, injectable } from "inversify";
import {TYPES} from "../../di/types";
import {TimeUtils} from "../TimeUtils";
import {Logger} from "../log/Logger";

const querystring = require("querystring");

/**
 * Network logger has been inspired by https://github.com/yamadapc/superagent-logger
 */

@injectable()
class NetworkLogger {
  constructor(@inject(TYPES.Logger) private logger: Logger) {}

  private colorForStatus(status: number): string {
    if (status < 300) {
      return "green";
    } else if (status < 400) {
      return "yellow";
    } else {
      return "red";
    }
  }

  private colorForSpeed(ms): string {
    if (ms < 200) {
      return "green";
    } else if (ms < 1000) {
      return "gray";
    } else if (ms < 5000) {
      return "yellow";
    } else {
      return "red";
    }
  }

  private rightPad(text: string, length: number): string {
    let result = text;
    const l = text.length;
    if (l < length) {
      for (let i = 0, n = length - l; i < n; i++) {
        result += " ";
      }
    }
    return result;
  }

  public logSuperagentRequest(req, timestamp: moment.Moment = req.timestamp) {
    const uri = url.parse(req.url);
    const fProtocol = this.rightPad(
      uri.protocol.toUpperCase().replace(/[^\w]/g, ""),
      5
    );

    const method = req.method;
    const fMethod = this.rightPad(method.toUpperCase(), "delete".length);

    const fUrl = uri.href + (req.qs ? "" : "?" + querystring.encode(req.qs));

    const text = chalk.gray(
      fProtocol +
        ` ${fMethod}` +
        `[${timestamp.format()}]` +
        "  -  " +
        fUrl +
        " (pending)"
    );

    this.logger.debug(text);
  }

  public logSuperagentResponse(
    req,
    res,
    reqTimestamp: moment.Moment = req.timestamp
  ) {
    const uri = url.parse(req.url);
    const fProtocol = this.rightPad(
      uri.protocol.toUpperCase().replace(/[^\w]/g, ""),
      5
    );

    const method = req.method;
    const fMethod = this.rightPad(method.toUpperCase(), "delete".length);

    const status = res.status;
    const cStatus = chalk[this.colorForStatus(status)](status);

    const fUrl = uri.href + (req.qs ? "" : "?" + querystring.encode(req.qs));

    const end = TimeUtils.momentTz();
    const elapsed = end.diff(reqTimestamp, "ms");
    const cSpeed = chalk[this.colorForSpeed(elapsed)](elapsed + "ms");

    const text =
      chalk.magenta(fProtocol) +
      ` ${chalk.cyan(fMethod)}` +
      chalk.gray(`[${end.format()}]`) +
      ` ${cStatus} ` +
      chalk.gray(fUrl) +
      ` ${chalk.gray("(")}${cSpeed}${chalk.gray(")")}`;

    if (status < 300) {
      //this.logger.debug(text);
    } else if (status < 400) {
      this.logger.warn(text);
    } else {
      this.logger.error(text);
    }
  }

  public getSuperagentPlugin(): (any) => void {
    return req => {
      const reqTimestamp = TimeUtils.momentTz();
      //this.logSuperagentRequest(req, reqTimestamp);
      req.on("response", res => {
        this.logSuperagentResponse(req, res, reqTimestamp);
      });
    };
  }
}

export { NetworkLogger };
