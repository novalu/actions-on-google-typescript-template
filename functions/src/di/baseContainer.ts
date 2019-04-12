import {Container} from "inversify";
import { TYPES } from "./types";
import {SlackUtils} from "../utils/slack/SlackUtils";
import {FirebaseUtils} from "../utils/FirebaseUtils";
import {Logger} from "../utils/log/Logger";
import {SignaleLogger} from "../utils/log/impl/SignaleLogger";
import {NetworkLogger} from "../utils/network/NetworkLogger";
import {Request} from "../utils/network/Request";
import {SillyNameManager} from "../managers/SillyNameManager";
import {SillyNameFulfilment} from "../fulfillments/impl/SillyNameFulfilment";
import {WordsStorage} from "../storages/test/WordsStorage";
import {WordsLocalStorage} from "../storages/test/impl/WordsLocalStorage";

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

baseContainer.bind<SlackUtils>(TYPES.SlackUtils)
    .to(SlackUtils)
    .inSingletonScope();
baseContainer.bind<FirebaseUtils>(TYPES.FirebaseUtils)
    .to(FirebaseUtils)
    .inSingletonScope();
baseContainer.bind<Logger>(TYPES.Logger)
    .to(SignaleLogger)
    .inSingletonScope();
baseContainer.bind<NetworkLogger>(TYPES.NetworkLogger)
    .to(NetworkLogger)
    .inSingletonScope();
baseContainer.bind<Request>(TYPES.Request)
    .to(Request)
    .inSingletonScope();

export { baseContainer };