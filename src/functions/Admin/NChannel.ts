import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ChatInputCommandInteraction, ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { db } from "../../database";
import { NtyClient } from "../../handlers/client";

export async function NChannel(client: NtyClient, interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const section = new SectionBuilder({
        components: [
            {
                type: ComponentType.TextDisplay,
                content: "## Painel de Canais de Registro\n- Configure os canais onde cada tipo de ação ou registro do servidor será enviado."
            }
        ],
        accessory: {
            type: ComponentType.Thumbnail,
            media: { url: `${interaction.client.user.avatarURL()}` }
        }
    })

    const container = new ContainerBuilder()
        .addSectionComponents(section)
        .addSeparatorComponents(new SeparatorBuilder())
        .addTextDisplayComponents(new TextDisplayBuilder({ content: `### Auditoria do Servidor\n- **Logs de Cargos (Criação, Edição, Membros, Exclusão):** <#${db.get("Data.logs.roles")}>\n- **Logs de Mensagens (Apagadas, Editadas, Enviadas):** <#${db.get("Data.logs.messages")}>\n- **Logs de entrada de usuário (Entrada):** <#${db.get("Data.logs.entry")}>\n- **Logs de saída de usuário (Saída):** <#${db.get("Data.logs.exit")}>` }))
        .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder({ style: 2, customId: "home.config", emoji: client.appEmojis?.get("back") })
        ))
    return { flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral, components: [container] }
}