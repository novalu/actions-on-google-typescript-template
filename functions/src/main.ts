import 'reflect-metadata';
import {FunctionsApp} from "./FunctionsApp";
import { container } from "./di/container";
import { TYPES } from "./di/types";

const functionsApp = container.get<FunctionsApp>(TYPES.FunctionsApp);

exports.test = functionsApp.getTestFunction();

exports.dialogflowDevelopment = functionsApp.getDialogflowFunction();
exports.dialogflowProduction = functionsApp.getDialogflowFunction();
