import { TYPES } from "./types";
import { Container } from "inversify";
import {FunctionsApp} from "../FunctionsApp";
import {baseContainer} from "./baseContainer";

const container = new Container();

container.parent = baseContainer;

/**********************************************************************************************/
/* APP                                                                                        */
/**********************************************************************************************/

container
    .bind<FunctionsApp>(TYPES.FunctionsApp)
    .to(FunctionsApp)
    .inSingletonScope();

export { container };