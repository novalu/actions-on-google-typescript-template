import {Container} from "inversify";
import { TYPES } from "./types";
import {SlackHelper} from "../helpers/SlackHelper";
import {FirebaseHelper} from "../helpers/FirebaseHelper";
import {Logger} from "../utils/log/Logger";
import {SignaleLogger} from "../utils/log/impl/SignaleLogger";
import {NetworkLogger} from "../utils/network/NetworkLogger";
import {Request} from "../utils/network/Request";
import {SillyNameManager} from "../managers/SillyNameManager";
import {SillyNameFulfilment} from "../fulfillments/impl/SillyNameFulfilment";
import {WordsStorage} from "../storages/words/WordsStorage";
import {WordsLocalStorage} from "../storages/words/impl/WordsLocalStorage";
import {ConsoleLogger} from "../utils/log/impl/ConsoleLogger";

const baseContainer = new Container();

/**********************************************************************************************/
/* CONFIG                                                                                     */
/**********************************************************************************************/

/**********************************************************************************************/
/* MANAGERS                                                                                   */
/**********************************************************************************************/

baseContainer.bind<SillyNameManager>(TYPES.SillyNameManager)
    .to(SillyNameManager)
    .inSingletonScope();

/**********************************************************************************************/
/* FULFILLMENTS                                                                               */
/**********************************************************************************************/

baseContainer.bind<SillyNameFulfilment>(TYPES.SillyNameFulfillment)
    .to(SillyNameFulfilment)
    .inSingletonScope();

/**********************************************************************************************/
/* STORAGES                                                                                   */
/**********************************************************************************************/

baseContainer.bind<WordsStorage>(TYPES.WordsStorage)
    .to(WordsLocalStorage)
    .inSingletonScope();

/**********************************************************************************************/
/* UTILS                                                                                      */
/**********************************************************************************************/

baseContainer.bind<SlackHelper>(TYPES.SlackHelper)
    .to(SlackHelper)
    .inSingletonScope();
baseContainer.bind<FirebaseHelper>(TYPES.FirebaseHelper)
    .to(FirebaseHelper)
    .inSingletonScope();
baseContainer.bind<Logger>(TYPES.Logger)
    .to(process.env.NODE_ENV === "development" ? SignaleLogger : ConsoleLogger)
    .inSingletonScope();
baseContainer.bind<NetworkLogger>(TYPES.NetworkLogger)
    .to(NetworkLogger)
    .inSingletonScope();
baseContainer.bind<Request>(TYPES.Request)
    .to(Request)
    .inSingletonScope();

export { baseContainer };