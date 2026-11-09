import { ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { createEvent } from "../../base/event";
import { db } from "../../database";

export default createEvent({
    name: "roleCreate",
    async run(client, role) {
        const channel = role.guild.channels.cache.get(`${db.get("Data.logs.roles")}`);

        if (!channel || !channel.isTextBased() || !channel.isSendable()) return;

        const section = new SectionBuilder({
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `## Novo cargo criado!\nUm novo cargo foi adicionado ao servidor.\nConfira suas informações abaixo.`
                }
            ],
            accessory: {
                type: ComponentType.Thumbnail,
                media: {
                    url: `${client.user?.displayAvatarURL()}`
                }
            }
        });

        const container = new ContainerBuilder()
            .addSectionComponents(section)
            .addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(
                new TextDisplayBuilder({
                    content:
                        `**Informações do cargo**\n` +
                        `> **Nome:** ${role.name}\n` +
                        `> **ID:** \`${role.id}\`\n` +
                        `> **Cor:** \`${role.hexColor}\`\n` +
                        `> **Posição:** ${role.position}\n` +
                        `> **Menção:** ${role}\n\n` +
                        `**Permissões**\n` +
                        `> ${role.permissions.toArray().join(", ") || "Nenhuma"}`
                })
            );

        await channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
});