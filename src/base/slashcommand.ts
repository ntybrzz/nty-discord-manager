import {
    ApplicationCommandType,
    type ApplicationCommandData,
    type ApplicationCommandOptionData,
    type AutocompleteInteraction,
    type ChatInputCommandInteraction,
    type CommandInteraction,
    type MessageContextMenuCommandInteraction,
    type PermissionResolvable,
    type UserContextMenuCommandInteraction,
} from "discord.js";
import { NtyClient } from "../handlers/client";

export interface SlashCommand {
    data: ApplicationCommandData;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void;
    run: (client: NtyClient, interaction: CommandInteraction) => Promise<void> | void;
}

export type CommandType = ApplicationCommandType | `${ApplicationCommandType}`;

type ContextType =
    | ApplicationCommandType.User
    | `${ApplicationCommandType.User}`
    | ApplicationCommandType.Message
    | `${ApplicationCommandType.Message}`;

export type InteractionOf<T extends CommandType> = T extends
    | ApplicationCommandType.User
    | `${ApplicationCommandType.User}`
    ? UserContextMenuCommandInteraction
    : T extends ApplicationCommandType.Message | `${ApplicationCommandType.Message}`
    ? MessageContextMenuCommandInteraction
    : ChatInputCommandInteraction;

interface BaseDefinition<T extends CommandType> {
    name: string;
    type?: T;
    defaultMemberPermissions?: PermissionResolvable;
    nsfw?: boolean;
    run: (client: NtyClient, interaction: InteractionOf<T>) => Promise<void> | void;
}

type ChatInputOnly<T extends CommandType> = T extends ContextType
    ? { description?: never; options?: never; autocomplete?: never }
    : {
        description: string;
        options?: ApplicationCommandOptionData[];
        autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void;
    };

export type SlashCommandDefinition<T extends CommandType> = BaseDefinition<T> & ChatInputOnly<T>;

export function createCommand<T extends CommandType = ApplicationCommandType.ChatInput>(
    def: SlashCommandDefinition<T>,
): SlashCommand {
    const type = Number(def.type ?? ApplicationCommandType.ChatInput) as ApplicationCommandType;

    const common = {
        name: def.name,
        defaultMemberPermissions: def.defaultMemberPermissions,
        nsfw: def.nsfw,
    };

    const data = (
        type === ApplicationCommandType.ChatInput
            ? { ...common, type, description: def.description, options: def.options ?? [] }
            : { ...common, type }
    ) as ApplicationCommandData;

    return {
        data,
        autocomplete: def.autocomplete,
        run: def.run as unknown as SlashCommand["run"],
    };
}