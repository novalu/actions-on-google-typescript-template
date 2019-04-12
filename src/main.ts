import 'reflect-metadata';
import {TestApp} from "./TestApp";
import { container } from "./di/container";
import { TYPES } from "./di/types";

(async () => {
    const app = container.get<TestApp>(TYPES.TestApp);
    await app.start()
})();