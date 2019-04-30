import {injectable} from "inversify";
import {FruitsStorage} from "../FruitsStorage";
import {Fruit} from "../../../model/Fruit";

@injectable()
class FruitsLocalStorage implements FruitsStorage {

    getFruits(): Promise<Fruit[]> {
        return Promise.resolve([
            new Fruit("Apple"),
            new Fruit("Banana"),
            new Fruit("Strawberry")
        ]);
    }

}

export { FruitsLocalStorage }