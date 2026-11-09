import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { NtyClient } from "../../handlers/client";

export async function NLog(
    client: NtyClient,
    interaction: ChatInputCommandInteraction | ButtonInteraction
) {
    const section = new SectionBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## Painel de Configuração de Logs
Gerencie os registros de atividades do servidor em um só lugar. Configure os canais responsáveis por receber notificações e acompanhe os principais acontecimentos da comunidade.

**O que você pode configurar?**

- **Logs de entrada:** registros de membros que entram no servidor.
- **Logs de saída:** registros de membros que deixam o servidor.
- **Logs de mensagens:** mensagens editadas ou excluídas.
- **Logs de canais:** criação, exclusão e modificações nos canais.
- **Logs de cargos:** criação, exclusão e alterações de cargos.

Selecione as opções desejadas e defina os canais correspondentes para manter o servidor organizado e facilitar o acompanhamento de suas atividades.`))
        .setThumbnailAccessory(new ThumbnailBuilder({ media: { url: interaction.client.user?.displayAvatarURL() ?? "" } }));

    const container = new ContainerBuilder()
        .addSectionComponents(section)
        .addSeparatorComponents(new SeparatorBuilder())
        .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder({ style: 2, customId: "button.log.entry", label: "Log Entrada" }),
            new ButtonBuilder({ style: 2, customId: "button.log.exit", label: "Log Saída" }),
            new ButtonBuilder({ style: 2, customId: "button.log.messages", label: "Log Mensagens" }),
            new ButtonBuilder({ style: 2, customId: "button.log.channel", label: "Log Canais" }),
            new ButtonBuilder({ style: 2, customId: "button.log.roles", label: "Log Cargos" })
        ))
        .setAccentColor(0x66A1FF);

    return { flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] };
}