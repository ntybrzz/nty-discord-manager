import { MessageFlags } from "discord.js";
import { createEvent } from "../../base/event";
import { db } from "../../database";

export default createEvent({
    name: "interactionCreate",
    async run(client, interaction) {
        if (interaction.isChannelSelectMenu() && interaction.customId === "select.ticket.category") {
            const options = interaction.values[0];

            db.set("Data.Ticket.category", options)
            interaction.reply({ flags: MessageFlags.Ephemeral, content: "Categoria setada com sucesso." })
        }

        if (interaction.isRoleSelectMenu() && interaction.customId === "select.ticket.roles") {
            const options = interaction.values[0];

            db.set("Data.Ticket.roles", options)
            interaction.reply({ flags: MessageFlags.Ephemeral, content: "Cargo setado com sucesso." })
        }

        if (interaction.isChannelSelectMenu() && interaction.customId === "select.ticket.logs") {
            const options = interaction.values[0];

            db.set("Data.Ticket.logs", options);
            interaction.reply({ flags: MessageFlags.Ephemeral, content: "Canal de logs setado com sucesso." });
        }
    }
})