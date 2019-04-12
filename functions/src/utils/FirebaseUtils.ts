import {inject, injectable} from "inversify";
import * as firebaseAdmin from 'firebase-admin';

const serviceAccountJson = require("../../service-account.json");

@injectable()
class FirebaseUtils {

    public db: firebaseAdmin.database.Database;

    constructor(

    ) {
        const config = {
            databaseURL: "",
            credential: firebaseAdmin.credential.cert(serviceAccountJson),
        };
        firebaseAdmin.initializeApp(config);
        this.db = firebaseAdmin.database();
    }

}

export { FirebaseUtils }