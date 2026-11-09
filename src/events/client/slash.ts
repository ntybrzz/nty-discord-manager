import { createEvent } from "../../base/event";

export default createEvent({
    name: "interactionCreate",

    async run(client, interaction) {
        if (interaction.isChatInputCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.run(client, interaction);
            } catch (error) {
                console.error(error);
            }
        }

        if (interaction.isAutocomplete()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete?.(interaction);
            } catch (error) {
                console.error(error);
            }
        }

        if (interaction.isContextMenuCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.run(client, interaction);
            } catch (error) {
                console.error(error);
            }
        }
    },
});