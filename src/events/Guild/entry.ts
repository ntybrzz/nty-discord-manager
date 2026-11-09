import { ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { createEvent } from "../../base/event";
import { db } from "../../database";

export default createEvent({
    name: "guildMemberAdd",
    async run(client, member) {
        const channel = member.guild.channels.cache.get(`${db.get("Data.logs.entry")}`);

        if (!channel) return;
        if (!channel.isTextBased()) return;

        const section = new SectionBuilder({
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `## Novo membro!\nConsulte abaixo as informações detalhadas do usuário, incluindo seus dados de identificação, atividade na comunidade, datas importantes e demais informações relevantes.`
                },
            ],
            accessory: {
                type: ComponentType.Thumbnail,
                media: { url: `${member.user?.displayAvatarURL()}` }
            }
        })

        const container = new ContainerBuilder()
            .addSectionComponents(section)
            .addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(
                        `**Informações do usuário**\n` +
                        `> **Usuário:** ${member.user}\n` +
                        `> **BOT:** ${member.user.bot ? "**Sim**" : "**Não**"}\n` +
                        `> **Nome:** ${member.user.username}\n` +
                        `> **ID:** \`${member.id}\`\n\n` +
                        `**Informações da conta**\n` +
                        `> **Conta criada:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\n` +
                        `> **Entrou no servidor:** <t:${Math.floor((member.joinedTimestamp || 0) / 1000)}:F>`
                    )
            )

        channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] })
    }
})