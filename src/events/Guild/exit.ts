import { ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, TextDisplayBuilder } from "discord.js";
import { createEvent } from "../../base/event";
import { db } from "../../database";

export default createEvent({
    name: "guildMemberRemove",
    async run(client, member) {
        const channel = member.guild.channels.cache.get(`${db.get("Data.logs.exit")}`)

        if (!channel) return;
        if (!channel.isTextBased()) return;

        const section = new SectionBuilder({
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `## Membro saiu!\nUm membro acabou de deixar o servidor. Confira abaixo as informações referentes à sua saída.`
                }
            ],
            accessory: {
                type: ComponentType.Thumbnail,
                media: { url: `${member.user.displayAvatarURL()}` }
            }
        })


        const container = new ContainerBuilder()
            .addSectionComponents(section)
            .addTextDisplayComponents(new TextDisplayBuilder({
                content: `**Informações do usuário**\n` +
                    `> **Usuário:** ${member.user}\n` +
                    `> **Nome:** ${member.user.username}\n` +
                    `> **BOT:** ${member.user.bot ? "**Sim" : "Não**"}\n` +
                    `> **Apelido:** ${member.nickname || "**Não tem apelido**"}\n` +
                    `> **ID:** \`${member.id}\`\n\n` +
                    `**Informações da conta**\n` +
                    `> **Conta criada:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\n` +
                    `> **Saiu do servidor:** <t:${Math.floor(Date.now() / 1000)}:F>\n` +
                    `> **Tempo de permanência:** <t:${Math.floor((member.joinedTimestamp || 0) / 1000)}:R>`
            }))

        await channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] })
    }
})