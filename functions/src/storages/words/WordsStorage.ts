import {Word} from "../../model/Word";

interface WordsStorage {

    getWords(): Promise<Word[]>

}

export { WordsStorage }