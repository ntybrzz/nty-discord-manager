import { createCommand } from "../../../base/slashcommand";
import { NConfig } from "../../../functions/Admin/NConfig";

export default createCommand({
    name: "panel",
    description: "Monitore o painel de logs",
    async run(client, interaction) {
        if (!interaction.memberPermissions?.has("Administrator")) {
            interaction.reply({ flags: ["Ephemeral"], content: "`❌` | Sem permissão." })
            return;
        }
        const nty = await NConfig(interaction);
        await interaction.reply(nty)
    },
})