import { inject, injectable } from "inversify";
import * as superagent from "superagent";
import { NetworkLogger } from "./NetworkLogger";
import {TYPES} from "../../di/types";

@injectable()
class Request {
  constructor(
    @inject(TYPES.NetworkLogger) private networkLogger: NetworkLogger
  ) {}

  instance() {
    return (superagent.agent() as any).use(
      this.networkLogger.getSuperagentPlugin()
    );
  }

  get(url: string): any {
    return this.instance().get(url);
  }

  getJson(url: string): any {
    return this.instance()
      .get(url)
      .set("Accept", "application/json");
  }

  post(url: String): any {
    return this.instance().post(url)
  }
}

export { Request };
