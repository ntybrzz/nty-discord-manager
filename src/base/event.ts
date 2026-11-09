import type { ClientEvents } from "discord.js";
import type { NtyClient } from "../handlers/client";

export interface Event {
    name: keyof ClientEvents;
    once: boolean;
    run: (client: NtyClient, ...args: any[]) => Promise<void> | void;
}

export interface EventDefinition<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    run: (client: NtyClient, ...args: ClientEvents[K]) => Promise<void> | void;
}

export function createEvent<K extends keyof ClientEvents>(def: EventDefinition<K>): Event {
    return {
        name: def.name,
        once: def.once ?? false,
        run: def.run as Event["run"],
    };
}