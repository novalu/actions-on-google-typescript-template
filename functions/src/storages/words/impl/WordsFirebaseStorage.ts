import * as firebaseAdmin from "firebase-admin";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../di/types";
import {FirebaseHelper} from "../../../helpers/FirebaseUtils";
import {WordsStorage} from "../WordsStorage";
import {Word} from "../../../model/Word";

@injectable()
class WordsFirebaseStorage implements WordsStorage {

    private db: firebaseAdmin.database.Database;

    constructor(
        @inject(TYPES.FirebaseHelper) private firebaseUtils: FirebaseHelper
    ) {
        this.db = firebaseUtils.db;
    }

    getWords(): Promise<Word[]> {
        return undefined;
    }

}

export { WordsFirebaseStorage }