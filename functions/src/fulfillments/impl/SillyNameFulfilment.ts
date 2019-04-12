import {inject, injectable} from "inversify";
import {TYPES} from "../../di/types";
import {Logger} from "../../utils/log/Logger";
import {Fulfillment} from "../Fulfillment";
import {SillyNameManager} from "../../managers/SillyNameManager";

@injectable()
class SillyNameFulfilment implements Fulfillment {

    constructor(
        @inject(TYPES.SillyNameManager) private sillyNameManager: SillyNameManager,
        @inject(TYPES.Logger) private logger: Logger
    ) {}

    public initialize(dialogflowApp: any) {
        this.buildMakeNameFulfilment(dialogflowApp);
        // add here another builder method calls
    }

    private buildMakeNameFulfilment(dialogflowApp: any) {
        dialogflowApp.intent("make_name", async (conv, { color, number }) => {
            try {
                const sillyName = await this.sillyNameManager.getSillyName(color, number);
                conv.ask(`Alright, your silly name is ${sillyName}. I hope you like it! See you next time!`);
            } catch (err) {
                this.logger.error(err);
            }
        });
    }

}

export { SillyNameFulfilment }