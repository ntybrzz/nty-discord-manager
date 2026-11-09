import { Events } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import { pathToFileURL } from "url";
import { SlashCommand } from "../base/slashcommand";
import { Event } from "../base/event";
import { NtyClient } from "../handlers/client"

const ROOT = join(__dirname, "..");

export class Loader {
    constructor(private readonly client: NtyClient) { }

    async load() {
        await this.loadSlashCommands();
        await this.loadEvents();
        return this;
    }

    private async loadSlashCommands() {
        await this.each<SlashCommand>("commands/slash", (command) => {
            if (!command.data || !command.run) return false;
            this.client.slashCommands.set(command.data.name, command);
            return;
        });

        this.client.once(Events.ClientReady, async (client) => {
            for (const guild of client.guilds.cache.values()) {
                await guild.commands.set(this.client.slashCommands.map((c) => c.data));
            }
        });

        this.client.once(Events.GuildCreate, async (guild) => {
            await guild.commands.set(this.client.slashCommands.map((c) => c.data));
        });
    }

    private async loadEvents() {
        await this.each<Event>("events", (event) => {
            if (!event.name || !event.run) return false;
            const listener = (...args: any[]) => event.run(this.client, ...args);
            if (event.once) this.client.once(event.name, listener);
            else this.client.on(event.name, listener);
            return;
        });
    }

    private async each<T>(folder: string, handler: (item: T) => void | false) {
        for (const file of await this.findFiles(join(ROOT, folder))) {
            const mod = await import(pathToFileURL(file).href);
            const item: T | undefined = mod.default ?? mod;

            if (!item || handler(item) === false) {
                console.warn(`[\x1b[91m${folder}\x1b[0m] \x1b[91m${file}\x1b[0m ignored: invalid format.\x1b[0m`);
            }
        }
    }

    private async findFiles(root: string) {
        const files: string[] = [];
        let level = [root];

        while (level.length) {
            const next: string[] = [];

            for (const dir of level) {
                const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);

                for (const entry of entries) {
                    const path = join(dir, entry.name);

                    if (entry.isDirectory()) next.push(path);
                    else if (/(?<!\.d)\.(ts|js)$/.test(entry.name)) files.push(path);
                }
            }

            level = next;
        }

        return files;
    }
}