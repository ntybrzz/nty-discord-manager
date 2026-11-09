import { ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";

import { createEvent } from "../../base/event";
import { db } from "../../database";

const cooldown = new Map<string, number>();

export default createEvent({
    name: "roleUpdate",

    async run(client, oldRole, newRole) {
        const channelId = db.get("Data.logs.roles");

        if (typeof channelId !== "string") return;

        const channel = newRole.guild.channels.cache.get(channelId);

        if (!channel || !channel.isTextBased() || !channel.isSendable()) return;

        const changes: string[] = [];

        if (oldRole.name !== newRole.name) {
            changes.push(`> **Nome:** ${oldRole.name} → ${newRole.name}`);
        }

        if (oldRole.hexColor !== newRole.hexColor) {
            changes.push(`> **Cor:** ${oldRole.hexColor} → ${newRole.hexColor}`);
        }

        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            changes.push(`> **Permissões:** Foram modificadas.`);
        }

        if (oldRole.position !== newRole.position) {
            changes.push(`> **Posição:** ${oldRole.position} → ${newRole.position}`);
        }

        if (changes.length === 0) return;

        const now = Date.now();
        const lastUpdate = cooldown.get(newRole.id);

        if (lastUpdate && now - lastUpdate < 2000) return;

        cooldown.set(newRole.id, now);

        const section = new SectionBuilder({
            components: [
                {
                    type: ComponentType.TextDisplay,
                    content: `## Cargo atualizado!\nUm cargo do servidor teve\nsuas configurações modificadas.`
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
                        `> **Cargo:** ${newRole}\n` +
                        `> **ID:** \`${newRole.id}\`\n\n` +
                        `**Alterações realizadas**\n` +
                        changes.join("\n")
                })
            );

        await channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
});