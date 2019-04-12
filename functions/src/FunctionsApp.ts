import {AppHandler, Dialogflow, dialogflow, DialogflowApp} from 'actions-on-google';
import * as functions from 'firebase-functions';
import {inject, injectable} from "inversify";
import { TYPES } from "./di/types";
import * as lodash from 'lodash';
import {fulfillmentTypes} from "./config/fulfillments";
import {container} from "./di/container";
import {Fulfillment} from "./fulfillments/Fulfillment";

@injectable()
class FunctionsApp {

    public getTestFunction(): any {
        return functions.https.onRequest((req, res) => {
            res.send("Hello world from Cloud functions");
        });
    }

    public getDialogflowFunction(): any {
        const dialogflowApp = dialogflow({debug: true});
        for (const type of fulfillmentTypes) {
            const fulfillment = container.get<Fulfillment>(type);
            fulfillment.initialize(dialogflowApp);
        }
        return functions.https.onRequest(dialogflowApp);
    }

}

export { FunctionsApp }