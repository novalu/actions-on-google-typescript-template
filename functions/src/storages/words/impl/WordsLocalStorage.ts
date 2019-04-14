import {injectable} from "inversify";
import {WordsStorage} from "../WordsStorage";
import {Word} from "../../../model/Word";

@injectable()
class WordsLocalStorage implements WordsStorage {

    getWords(): Promise<Word[]> {
        return Promise.resolve([
            new Word("Foo"),
            new Word("Bar"),
            new Word("Baz")
        ]);
    }

}

export { WordsLocalStorage }