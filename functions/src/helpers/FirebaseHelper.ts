import {inject, injectable} from "inversify";
import * as firebaseAdmin from 'firebase-admin';
import * as path from "path";
import * as fs from "fs";

@injectable()
class FirebaseHelper {

    private readonly DATABASE_URL = "";

    public db: firebaseAdmin.database.Database;

    constructor(

    ) {
        const serviceAccountPath = path.join(__filename, "../../../service-account.json");
        const serviceAccountFile = fs.readFileSync(serviceAccountPath, "utf-8");
        const serviceAccountJson = JSON.parse(serviceAccountFile);
        const config = {
            databaseURL: this.DATABASE_URL,
            credential: firebaseAdmin.credential.cert(serviceAccountJson),
        };
        firebaseAdmin.initializeApp(config);
        this.db = firebaseAdmin.database();
    }

}

export { FirebaseHelper }