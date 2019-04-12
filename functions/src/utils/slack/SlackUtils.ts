import {inject, injectable} from "inversify";
import { TYPES } from "../../di/types";
import {Request} from "../network/Request";
import {Logger} from "../log/Logger";
import {SlackHook} from "./hooks/SlackHook";

@injectable()
class SlackUtils {

    constructor(
        @inject(TYPES.Request) private request: Request,
        @inject(TYPES.Logger) private logger: Logger
    ) {}

    public async sendMessage(hook: SlackHook, text: string, attachmentText: string = undefined, attachmentImageUrl: string = undefined) {
        const data = this.constructWebhookObject(text, attachmentText, attachmentImageUrl);
        try {
            await this.request.post(hook.url)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(data));
            return true;
        } catch (err) {
            this.logger.error(err);
        }
        return false;
    }

    private constructWebhookObject(text: string, attachmentText: string = undefined, attachmentImageUrl: string = undefined): any {
        const data: any = { text: text };
        if (attachmentText !== undefined) {
            const attachment: any = { text: attachmentText };
            if (attachmentImageUrl) attachment.image_url = attachmentImageUrl;
            data.attachments = [ attachment ];
        }
        return data;
    }
}

export { SlackUtils }