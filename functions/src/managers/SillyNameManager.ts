import {inject, injectable} from "inversify";
import {TYPES} from "../di/types";
import {Logger} from "../utils/log/Logger";
import {FruitsStorage} from "../storages/fruits/FruitsStorage";
import {Fruit} from "../model/Fruit";
import * as lodash from 'lodash';

@injectable()
class SillyNameManager {

    constructor(
        @inject(TYPES.FruitsStorage) private fruitsStorage: FruitsStorage,
        @inject(TYPES.Logger) private logger: Logger
    ) {}

    async getRandomFruit(): Promise<Fruit> {
        const fruits = await this.fruitsStorage.getFruits();
        const randomIndex = lodash.random(fruits.length - 1);
        return fruits[randomIndex];
    }

    async getSillyName(color: string, number: string): Promise<string> {
        const randomFruit = await this.getRandomFruit();
        return `${color} ${randomFruit} ${number}`;
    }

}

export { SillyNameManager }