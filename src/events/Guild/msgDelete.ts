import { ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { createEvent } from "../../base/event";
import { db } from "../../database";

export default createEvent({
    name: "messageDelete",
    async run(client, message) {
        const channel = message.guild?.channels.cache.get(`${db.get("Data.logs.messages")}`)

        if (!message.guild) return;
        if (!message.author) return;
        if (message.author.bot) return;
        if (!channel) return;
        if (!channel.isTextBased()) return;

        const section = new SectionBuilder({
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `## Nova mensagem apagada!\nUm usuário acabou de deletar uma mensagem no servidor. Confira abaixo as informações da mensagem.`
                }
            ],
            accessory: {
                type: ComponentType.Thumbnail,
                media: { url: message.author.displayAvatarURL() }
            }
        })

        const container = new ContainerBuilder()
            .addSectionComponents(section)
            .addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(new TextDisplayBuilder({
                content: `**Informações da mensagem**\n` +
                    `> **Autor:** ${message.author}\n` +
                    `> **Usuário:** ${message.author.username}\n` +
                    `> **ID:** \`${message.author.id}\`\n` +
                    `> **Canal:** ${message.channel}\n` +
                    `> **ID da mensagem:** \`${message.id}\`\n\n` +
                    `**Conteúdo**\n` +
                    `> ${message.content || "Mensagem sem conteúdo textual."}\n\n` +
                    `**Data do envio:** <t:${Math.floor(message.createdTimestamp / 1000)}:F>`
            }))

        channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] })
    }
})