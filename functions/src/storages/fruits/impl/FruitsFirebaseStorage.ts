import * as firebaseAdmin from "firebase-admin";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../di/types";
import {FirebaseHelper} from "../../../helpers/FirebaseHelper";
import {FruitsStorage} from "../FruitsStorage";
import {Fruit} from "../../../model/Fruit";
import {Logger} from "../../../utils/log/Logger";
import * as lodash from 'lodash';

@injectable()
class FruitsFirebaseStorage implements FruitsStorage {

    private db: firebaseAdmin.database.Database;

    constructor(
        @inject(TYPES.FirebaseHelper) private firebaseHelper: FirebaseHelper,
        @inject(TYPES.Logger) private logger: Logger
    ) {
        this.db = firebaseHelper.db;
    }

    async getFruits(): Promise<Fruit[]> {
        const rawFruits = (await this.db.ref("/fruits").once("value")).val();
        const fruits = lodash.map(rawFruits, (rawFruit) => {
            return new Fruit(rawFruit)
        });
        return [];
    }

}

export { FruitsFirebaseStorage }