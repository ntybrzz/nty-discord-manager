import { createCommand } from "../../../base/slashcommand";
import { NPTicket } from "../../../functions/Admin/NPTticket";

export default createCommand({
    name: "ticket",
    description: "Envie o painel de ticket",
    async run(client, interaction) {
        if (!interaction.memberPermissions?.has("Administrator")) {
            await interaction.reply({ flags: ["Ephemeral"], content: "`❌` | Sem permissão." });
            return;
        }

        const nty = await NPTicket(client, interaction);
        await interaction.reply({ content: `## ${client.appEmojis.get("staff")} Central de Atendimento
Estamos à disposição para atender às suas solicitações e oferecer o suporte necessário.`, components: nty.components});
    }
});
