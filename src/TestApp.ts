import {inject, injectable} from "inversify";
import { TYPES } from "../functions/src/di/types";
import {Logger} from "../functions/src/utils/log/Logger";
import {SillyNameManager} from "../functions/src/managers/SillyNameManager";

@injectable()
class TestApp {

    constructor(
        @inject(TYPES.SillyNameManager) private sillyNameManager: SillyNameManager,
        @inject(TYPES.Logger) private logger: Logger
    ) {}

    public async start() {
        const sillyName = await this.sillyNameManager.getSillyName("blue", "42");
        this.logger.debug(sillyName);
        process.exit(0);
    }

}

export { TestApp }