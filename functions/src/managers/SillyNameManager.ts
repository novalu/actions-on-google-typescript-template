import {inject, injectable} from "inversify";

@injectable()
class SillyNameManager {

    async getSillyName(color: string, number: string): Promise<string> {
        return `${color} ${number}`;
    }

}

export { SillyNameManager }