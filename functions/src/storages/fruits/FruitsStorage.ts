import {Fruit} from "../../model/Fruit";

interface FruitsStorage {

    getFruits(): Promise<Fruit[]>

}

export { FruitsStorage }