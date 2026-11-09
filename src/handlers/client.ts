import { ApplicationEmoji, Client, Collection, type ClientOptions } from "discord.js";
import type { SlashCommand } from "../base/slashcommand.js";

export class NtyClient extends Client {
    readonly slashCommands = new Collection<string, SlashCommand>();
    readonly appEmojis = new Collection<string, ApplicationEmoji>();

    constructor(options: ClientOptions) {
        super(options);
        this.setMaxListeners(0);
    }
}
