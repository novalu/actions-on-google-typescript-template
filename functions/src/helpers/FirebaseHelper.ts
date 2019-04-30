import {inject, injectable} from "inversify";
import * as firebaseAdmin from 'firebase-admin';

@injectable()
class FirebaseHelper {

    private readonly DATABASE_URL = "";

    public db: firebaseAdmin.database.Database;

    constructor(

    ) {
        const config = {
            databaseURL: this.DATABASE_URL,
            credential: firebaseAdmin.credential.cert(require("../config/service-account.json")),
        };
        firebaseAdmin.initializeApp(config);
        this.db = firebaseAdmin.database();
    }

}

export { FirebaseHelper }