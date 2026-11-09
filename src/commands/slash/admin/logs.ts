import { createCommand } from "../../../base/slashcommand";
import { NLog } from "../../../functions/Admin/NLog";

export default createCommand({
    name: "logs",
    description: "[CONFIG] Logs",
    async run(client, interaction) {
        if (!interaction.memberPermissions?.has("ManageChannels")) {
            await interaction.reply({ flags: ["Ephemeral"], content: "`❌` | Você não tem permissão para isso." });
            return;
        }

        const nty = await NLog(client, interaction);
        await interaction.reply(nty);
    }
});