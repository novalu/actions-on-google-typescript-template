import {Logger} from "../Logger";
import {injectable} from "inversify";

@injectable()
class ConsoleLogger implements Logger {

    debug(body: any, extra?: any) {
        console.log(body);
        if (extra) {
            console.log(extra);
        }
    }

    error(body: any, extra?: any) {
        console.error(body);
        if (extra) {
            console.error(extra);
        }
    }

    fatal(body: any, extra?: any) {
        console.error(body);
        if (extra) {
            console.error(extra);
        }
    }

    info(body: any, extra?: any) {
        console.log(body);
        if (extra) {
            console.log(extra);
        }
    }

    trace(body: any, extra?: any) {
        console.log(body);
        if (extra) {
            console.log(extra);
        }
    }

    warn(body: any, extra?: any) {
        console.error(body);
        if (extra) {
            console.error(extra);
        }
    }

}

export { ConsoleLogger }