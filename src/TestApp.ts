import {inject, injectable} from "inversify";
import { TYPES } from "../functions/src/di/types";
import {Logger} from "../functions/src/utils/log/Logger";
import {FruitsStorage} from "../functions/src/storages/fruits/FruitsStorage";

@injectable()
class TestApp {

    constructor(
        @inject(TYPES.FruitsStorage) private fruitsStorage: FruitsStorage,
        @inject(TYPES.Logger) private logger: Logger
    ) {}

    public async start() {
        const fruits = await this.fruitsStorage.getFruits();
        this.logger.debug(fruits);
        process.exit(0);
    }

}

export { TestApp }