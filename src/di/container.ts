import { TYPES } from "./types";
import { Container } from "inversify";
import {TestApp} from "../TestApp";
import {baseContainer} from "../../functions/src/di/baseContainer";

const container = new Container();

container.parent = baseContainer;

/**********************************************************************************************/
/* APP                                                                                        */
/**********************************************************************************************/

container
    .bind<TestApp>(TYPES.TestApp)
    .to(TestApp)
    .inSingletonScope();

export { container };