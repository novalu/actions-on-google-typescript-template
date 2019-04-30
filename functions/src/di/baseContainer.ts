import {Container} from "inversify";
import { TYPES } from "./types";
import {SlackHelper} from "../helpers/SlackHelper";
import {FirebaseHelper} from "../helpers/FirebaseHelper";
import {Logger} from "../utils/log/Logger";
import {SignaleLogger} from "../utils/log/impl/SignaleLogger";
import {NetworkLogger} from "../utils/network/NetworkLogger";
import {NetworkRequest} from "../utils/network/NetworkRequest";
import {FruitsStorage} from "../storages/fruits/FruitsStorage";
import {FruitsLocalStorage} from "../storages/fruits/impl/FruitsLocalStorage";
import {ConsoleLogger} from "../utils/log/impl/ConsoleLogger";
import {FruitsFirebaseStorage} from "../storages/fruits/impl/FruitsFirebaseStorage";
import {SillyNameManager} from "../managers/SillyNameManager";
import {SillyNameFulfilment} from "../fulfillments/impl/SillyNameFulfilment";

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

baseContainer.bind<FruitsStorage>(TYPES.FruitsStorage)
    .to(FruitsLocalStorage)
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
baseContainer.bind<NetworkRequest>(TYPES.NetworkRequest)
    .to(NetworkRequest)
    .inSingletonScope();

export { baseContainer };