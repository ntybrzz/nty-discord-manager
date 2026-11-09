import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ContainerBuilder, EmbedBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { createEvent } from "../../base/event";
import { db } from "../../database";

const COOLDOWN = 5 * 60 * 1000;
const cooldowns = new Map<string, number>();
const closingTickets = new Set<string>();

export default createEvent({
    name: "interactionCreate",
    async run(client, interaction) {
        if (!interaction.isButton() || !interaction.guild || !interaction.channel || !("name" in interaction.channel) || !interaction.channel.name) return;
        const customId = interaction.customId;

        if (customId === "button.noty.user") {
            const userId = interaction.channel.name.match(/\d{17,20}/)?.[0];
            if (!userId) {
                await interaction.reply({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Não foi possível identificar o dono deste ticket.` });
                return;
            }

            if (interaction.user.id === userId) {
                await interaction.reply({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Você não pode notificar a si mesmo.` });
                return;
            }

            const staffRole = db.get("Data.Ticket.roles");
            const member = interaction.member;
            const isStaff = interaction.memberPermissions?.has("Administrator") || (staffRole && member && "roles" in member && (member.roles as any).cache?.has(staffRole));

            if (!isStaff) {
                await interaction.reply({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Você não tem permissão para notificar o usuário.` });
                return;
            }

            const lastNotify = cooldowns.get(interaction.channelId);
            if (lastNotify && Date.now() < lastNotify) {
                const expiresAt = Math.floor(lastNotify / 1000);
                await interaction.reply({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Este usuário já foi notificado recentemente. Você poderá notificá-lo novamente <t:${expiresAt}:R>.` });
                return;
            }

            const targetUser = await client.users.fetch(userId).catch(() => null);
            if (!targetUser) {
                await interaction.reply({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Usuário do ticket não foi encontrado.` });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor("#2b2d31")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() ?? undefined })
                .setTitle(`${client.appEmojis.get("bell") ?? "🔔"} Notificação de Atendimento`)
                .setDescription(`Olá **${targetUser.username}**, você recebeu uma nova notificação sobre o seu ticket no servidor **${interaction.guild.name}**.\n\nA nossa equipe está aguardando sua resposta ou enviou uma nova mensagem no canal de atendimento.`)
                .addFields({ name: "Canal", value: `${interaction.channel}`, inline: true })
                .addFields({ name: "Atendente", value: `${interaction.user}`, inline: true })
                .setThumbnail(interaction.guild.iconURL() ?? targetUser.displayAvatarURL())
                .setTimestamp();

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder({
                    style: ButtonStyle.Link,
                    label: "Acessar Ticket",
                    url: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`,
                    emoji: `${client.appEmojis.get("ticket") ?? "🎟️"}`
                })
            );

            try {
                await targetUser.send({ embeds: [embed], components: [row] });
                cooldowns.set(interaction.channelId, Date.now() + COOLDOWN);

                await interaction.reply({ content: `${client.appEmojis.get("check")} | ${targetUser}, você foi notificado na sua DM por ${interaction.user}!` });
            } catch {
                await interaction.reply({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Não foi possível enviar mensagem na DM de ${targetUser}. O usuário pode estar com as mensagens diretas desativadas.` });
            }
        }

        if (customId == "button.close.ticket") {
            const staffRole = db.get("Data.Ticket.roles");
            const member = interaction.member;
            const isStaff = interaction.memberPermissions?.has("Administrator") || interaction.memberPermissions?.has("BanMembers") || (staffRole && member && "roles" in member && (member.roles as any).cache?.has(staffRole));

            if (!isStaff) {
                await interaction.reply({ flags: ["Ephemeral"], content: "`❌` | Você não tem permissão para isso." });
                return;
            }

            if (closingTickets.has(interaction.channelId)) {
                await interaction.reply({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Este ticket já está sendo finalizado.` });
                return;
            }
            closingTickets.add(interaction.channelId);

            await interaction.reply({
                content: `${client.appEmojis.get("warn")} | Ticket sendo finalizado por ${interaction.user} em 5 segundos.`
            });

            const channel = interaction.channel;
            if (!channel?.isTextBased() || !("name" in channel) || !channel.name) return;

            const userId = channel.name.match(/\d{17,20}/)?.[0];
            const targetUser = userId ? await client.users.fetch(userId).catch(() => null) : null;
            const avatarUrl = targetUser?.displayAvatarURL() || interaction.guild.iconURL() || client.user?.displayAvatarURL() || "";

            const logChannelId = db.get("Data.Ticket.logs");
            if (logChannelId) {
                const logChannel = interaction.guild.channels.cache.get(`${logChannelId}`) ??
                    await interaction.guild.channels.fetch(`${logChannelId}`).catch(() => null);

                if (logChannel?.isTextBased()) {
                    const section = new SectionBuilder({
                        components: [
                            {
                                type: ComponentType.TextDisplay,
                                content: `## ${client.appEmojis.get("ticket") || "🎟️"} Ticket Finalizado\nO atendimento foi encerrado. Confira abaixo as informações referentes ao encerramento.`
                            }
                        ],
                        accessory: {
                            type: ComponentType.Thumbnail,
                            media: { url: avatarUrl }
                        }
                    });

                    const container = new ContainerBuilder()
                        .addSectionComponents(section)
                        .addSeparatorComponents(new SeparatorBuilder())
                        .addTextDisplayComponents(new TextDisplayBuilder({
                            content: `**Informações do Atendimento**\n` +
                                `> **Ticket:** \`${channel.name}\`\n` +
                                `> **Dono:** ${targetUser ? `${targetUser} (\`${targetUser.id}\`)` : `\`${userId || "Desconhecido"}\``}\n` +
                                `> **Fechado por:** ${interaction.user} (\`${interaction.user.id}\`)\n` +
                                `> **Horário de fechamento:** <t:${Math.floor(Date.now() / 1000)}:F>`
                        }));

                    try {
                        await logChannel.send({
                            flags: MessageFlags.IsComponentsV2,
                            components: [container]
                        });
                    } catch {
                        const embed = new EmbedBuilder()
                            .setColor(0x66A1FF)
                            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() ?? undefined })
                            .setTitle(`${client.appEmojis.get("ticket") || "🎟️"} Ticket Finalizado`)
                            .setDescription(
                                `**Informações do Atendimento**\n` +
                                `> **Ticket:** \`${channel.name}\`\n` +
                                `> **Dono:** ${targetUser ? `${targetUser} (\`${targetUser.id}\`)` : `\`${userId || "Desconhecido"}\``}\n` +
                                `> **Fechado por:** ${interaction.user} (\`${interaction.user.id}\`)\n` +
                                `> **Horário de fechamento:** <t:${Math.floor(Date.now() / 1000)}:F>`
                            )
                            .setThumbnail(avatarUrl)
                            .setTimestamp();

                        await logChannel.send({ embeds: [embed] });
                    }
                }
            }

            setTimeout(() => {
                channel.delete().catch(() => null);
            }, 5000);
        }
    }
});
