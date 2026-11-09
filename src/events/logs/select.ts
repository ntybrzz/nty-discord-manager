import { createEvent } from "../../base/event";
import { db } from "../../database";

export default createEvent({
    name: "interactionCreate",
    async run(client, interaction) {
        if (interaction.isChannelSelectMenu() && interaction.customId === "select.channel.entry") {
            const options = interaction.values[0];
            db.set("Data.logs.entry", options);
            await interaction.reply({ flags: ["Ephemeral"], content: "`⚙️` | Canal configurado com sucesso." })
        }

        if (interaction.isChannelSelectMenu() && interaction.customId === "select.channel.exit") {
            const options = interaction.values[0];
            db.set("Data.logs.exit", options);
            await interaction.reply({ flags: ["Ephemeral"], content: "`⚙️` | Canal configurado com sucesso." })
        }

        if (interaction.isChannelSelectMenu() && interaction.customId === "select.channel.messages") {
            const options = interaction.values[0];
            db.set("Data.logs.messages", options);
            await interaction.reply({ flags: ["Ephemeral"], content: "`⚙️` | Canal configurado com sucesso." })
        }

        if (interaction.isChannelSelectMenu() && interaction.customId === "select.channel.channel") {
            const options = interaction.values[0];
            db.set("Data.logs.channel", options);
            await interaction.reply({ flags: ["Ephemeral"], content: "`⚙️` | Canal configurado com sucesso." })
        }

        if (interaction.isChannelSelectMenu() && interaction.customId === "select.channel.roles") {
            const options = interaction.values[0];
            db.set("Data.logs.roles", options);
            await interaction.reply({ flags: ["Ephemeral"], content: "`⚙️` | Canal configurado com sucesso." })
        }
    }
})