import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ChatInputCommandInteraction, ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder } from "discord.js";

export async function NConfig(interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const section = new SectionBuilder({
        components: [
            {
                type: ComponentType.TextDisplay,
                content: `## Configurações do Bot
Gerencie e personalize o funcionamento do bot em seu servidor.

- Configure os sistemas disponíveis.
- Gerencie permissões e cargos autorizados.
- Defina os canais de logs e registros.
- Ajuste as funcionalidades conforme as necessidades do servidor.

**Selecione uma das opções abaixo para começar.**`
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
        .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder({ style: 2, customId: "button.ticket", label: "Ticket" }),
            new ButtonBuilder({ style: 2, customId: "button.channelsLogs", label: "Logs" })
        ))

    return { flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] }
}