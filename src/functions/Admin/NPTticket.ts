import { ActionRowBuilder, ChatInputCommandInteraction, MessageFlags, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { NtyClient } from "../../handlers/client";

export async function NPTicket(client: NtyClient, interaction: ChatInputCommandInteraction | StringSelectMenuInteraction) {
    const action = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder({
                customId: "Select.Ticket.System",
                placeholder: "Selecione uma categoria de ticket",
                maxValues: 1,
                options: [
                    {
                        label: "Dúvidas",
                        value: "ticket.system.duvidas"
                    },
                    {
                        label: "Suporte",
                        value: "ticket.system.suporte"
                    },
                    {
                        label: "Parcerias",
                        value: "ticket.system.parcerias"
                    }
                ]
            })
        )
    return {
        flags: MessageFlags.IsComponentsV2, content: `## ${client.appEmojis.get("staff")} Central de Atendimento\nEstamos à disposição para atender às suas solicitações e oferecer o suporte necessário.`, components: [action]
    };
}
