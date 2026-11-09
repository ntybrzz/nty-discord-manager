import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ChatInputCommandInteraction, ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { NtyClient } from "../../handlers/client";

export async function NTicket(client: NtyClient, interaction: ChatInputCommandInteraction | ButtonInteraction) {
    const section = new SectionBuilder({
        components: [
            {
                content: `## Configurações do Sistema de Tickets
- Gerencie e personalize o sistema de atendimento do servidor. Configure os parâmetros necessários para organizar a abertura, o gerenciamento e o encerramento dos tickets.
- Categoria: defina em qual categoria os tickets serão criados.
- Cargos autorizados: selecione os cargos que terão permissão para visualizar e atender os tickets.
- Canal de logs: escolha onde serão enviados os registros de encerramento dos tickets.`,
                type: ComponentType.TextDisplay
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
        .addTextDisplayComponents(new TextDisplayBuilder({
            content: `## Orientações sobre permissões
Certifique-se de que o bot possua as permissões necessárias para executar as configurações:

- Gerenciar canais: para criar e organizar os tickets.
- Ver canais: para acessar os canais de atendimento.
- Enviar mensagens: para interagir com os usuários.
- Gerenciar permissões: para controlar o acesso aos tickets.

**Selecione uma das opções abaixo para configurar o sistema de tickets.**`}))
        .addSeparatorComponents(new SeparatorBuilder())
        .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder({ style: 2, customId: "button.ticket.category", label: "Categoria" }),
            new ButtonBuilder({ style: 3, customId: "button.ticket.roles", label: "Cargos" }),
            new ButtonBuilder({ style: 1, customId: "button.ticket.logs", label: "Logs" }),
        ))
        .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder({ style: 2, customId: "home.config", emoji: client.appEmojis?.get("back") })
        ))

    return { flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral, components: [container] }
}