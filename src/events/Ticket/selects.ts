import { ActionRowBuilder, ButtonBuilder, ChannelType, ComponentType, ContainerBuilder, SectionBuilder, SeparatorBuilder, TextDisplayBuilder } from "discord.js";
import { createEvent } from "../../base/event";
import { db } from "../../database";
import { NPTicket } from "../../functions/Admin/NPTticket";

export default createEvent({
    name: "interactionCreate",
    async run(client, interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === "Select.Ticket.System") {
            const options = interaction.values[0];

            if (options === "ticket.system.duvidas") {
                const nty = await NPTicket(client, interaction);
                await interaction.update({ components: nty.components });

                if (!db.get("Data.Ticket.category")) {
                    await interaction.followUp({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Categoria de ticket não configurada.` });
                    return;
                }

                if (!interaction.guild) return;

                const existingTicket = interaction.guild.channels.cache.find(c => c.parentId === db.get("Data.Ticket.category") && c.name.includes(interaction.user.id));

                if (existingTicket) {
                    await interaction.followUp({
                        flags: ["Ephemeral"],
                        content: `${client.appEmojis.get("warn")} | Você já possui um ticket aberto: ${existingTicket}`
                    });
                    return;
                }

                const channel = await interaction.guild.channels.create({
                    name: `🎟️-Dúvidas-${interaction.user.id}`,
                    type: ChannelType.GuildText,
                    parent: `${db.get("Data.Ticket.category")}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"]
                        },
                        {
                            id: interaction.user.id,
                            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                        }
                    ]
                });
                if (!channel?.isTextBased()) return;

                const section = new SectionBuilder({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `## ${client.appEmojis.get("ticket")} Atendimento — Dúvidas\nEste canal foi criado para esclarecer dúvidas e fornecer informações sobre nossos serviços e funcionamento.`
                        }
                    ],
                    accessory: {
                        type: ComponentType.Thumbnail,
                        media: { url: `${interaction.guild?.iconURL()}` }
                    }
                })

                const container = new ContainerBuilder()
                    .addSectionComponents(section)
                    .addTextDisplayComponents(new TextDisplayBuilder({
                        content: `Descreva sua dúvida com clareza e forneça o máximo de contexto possível para que nossa equipe possa compreender sua solicitação e oferecer uma resposta adequada.
\nOrientações:
${client.appEmojis.get("arrow_right")} **Seja objetivo ao descrever sua dúvida.
${client.appEmojis.get("arrow_right")} Envie imagens ou informações adicionais, caso sejam necessárias.
${client.appEmojis.get("arrow_right")} Aguarde o retorno de um membro da equipe.
${client.appEmojis.get("arrow_right")} Evite enviar mensagens repetidas enquanto aguarda atendimento.**

${client.appEmojis.get("info")} Nossa equipe estará à disposição para auxiliá-lo.`
                    }))
                    .addSeparatorComponents(new SeparatorBuilder())
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.noty.user", label: "Notificar usuário", emoji: `${client.appEmojis.get("bell")}` }),
                        new ButtonBuilder({ style: 4, label: "Excluir ticket", customId: "button.close.ticket", emoji: `${client.appEmojis.get("cross")}` })
                    ))
                await channel.send({ flags: ["IsComponentsV2"], components: [container] });
                await interaction.followUp({ flags: ["Ephemeral"], content: `${client.appEmojis.get("info")} | Ticket criado com sucesso: ${channel}` });
            }

            if (options == "ticket.system.suporte") {
                const nty = await NPTicket(client, interaction);
                await interaction.update({ components: nty.components });

                if (!db.get("Data.Ticket.category")) {
                    await interaction.followUp({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Categoria de ticket não configurada.` });
                    return;
                }

                if (!interaction.guild) return;

                const existingTicket = interaction.guild.channels.cache.find(c => c.parentId === db.get("Data.Ticket.category") && c.name.includes(interaction.user.id));

                if (existingTicket) {
                    await interaction.followUp({
                        flags: ["Ephemeral"],
                        content: `${client.appEmojis.get("warn")} | Você já possui um ticket aberto: ${existingTicket}`
                    });
                    return;
                }

                const channel = await interaction.guild.channels.create({
                    name: `🎟️-Suporte-${interaction.user.id}`,
                    type: ChannelType.GuildText,
                    parent: `${db.get("Data.Ticket.category")}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"]
                        },
                        {
                            id: interaction.user.id,
                            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                        }
                    ]
                });
                if (!channel?.isTextBased()) return;

                const section = new SectionBuilder({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `## ${client.appEmojis.get("ticket")} Atendimento — Suporte\nEste canal é destinado ao atendimento de problemas técnicos, dificuldades de utilização e solicitações de assistência relacionadas aos nossos serviços.`
                        }
                    ],
                    accessory: {
                        type: ComponentType.Thumbnail,
                        media: { url: `${interaction.guild?.iconURL()}` }
                    }
                })

                const container = new ContainerBuilder()
                    .addSectionComponents(section)
                    .addTextDisplayComponents(new TextDisplayBuilder({
                        content: `Descreva o problema encontrado com o máximo de detalhes possível, para que nossa equipe possa analisar a situação e fornecer a assistência adequada.
Orientações:
${client.appEmojis.get("arrow_right")} Explique o problema de forma clara e objetiva.
${client.appEmojis.get("arrow_right")} Informe quando e como o problema ocorreu.
${client.appEmojis.get("arrow_right")} Anexe capturas de tela ou registros de erro, caso disponíveis.
${client.appEmojis.get("arrow_right")} Aguarde a análise e o retorno da equipe.
${client.appEmojis.get("arrow_right")} Evite enviar mensagens repetidas enquanto aguarda atendimento.

Nossa equipe analisará sua solicitação e trabalhará para encontrar a melhor solução possível.`}))
                    .addSeparatorComponents(new SeparatorBuilder())
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.noty.user", label: "Notificar usuário", emoji: `${client.appEmojis.get("bell")}` }),
                        new ButtonBuilder({ style: 4, label: "Excluir ticket", customId: "button.close.ticket", emoji: `${client.appEmojis.get("cross")}` })
                    ))

                await channel.send({ flags: ["IsComponentsV2"], components: [container] });
                await interaction.followUp({ flags: ["Ephemeral"], content: `${client.appEmojis.get("info")} | Ticket criado com sucesso: ${channel}` });
            }

            if (options == "ticket.system.parcerias") {
                const nty = await NPTicket(client, interaction);
                await interaction.update({ components: nty.components });

                if (!db.get("Data.Ticket.category")) {
                    await interaction.followUp({ flags: ["Ephemeral"], content: `${client.appEmojis.get("warn")} | Categoria de ticket não configurada.` });
                    return;
                }

                if (!interaction.guild) return;

                const existingTicket = interaction.guild.channels.cache.find(c => c.parentId === db.get("Data.Ticket.category") && c.name.includes(interaction.user.id));

                if (existingTicket) {
                    await interaction.followUp({
                        flags: ["Ephemeral"],
                        content: `${client.appEmojis.get("warn")} | Você já possui um ticket aberto: ${existingTicket}`
                    });
                    return;
                }

                const channel = await interaction.guild.channels.create({
                    name: `🎟️-Parcerias-${interaction.user.id}`,
                    type: ChannelType.GuildText,
                    parent: `${db.get("Data.Ticket.category")}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"]
                        },
                        {
                            id: interaction.user.id,
                            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                        }
                    ]
                });
                if (!channel?.isTextBased()) return;

                const section = new SectionBuilder({
                    components: [
                        {
                            type: ComponentType.TextDisplay,
                            content: `## ${client.appEmojis.get("ticket")} Atendimento — Parcerias\nEste canal é destinado à apresentação de propostas de parceria e oportunidades de colaboração com nossa comunidade.`
                        }
                    ],
                    accessory: {
                        type: ComponentType.Thumbnail,
                        media: { url: `${interaction.guild?.iconURL()}` }
                    }
                })

                const container = new ContainerBuilder()
                    .addSectionComponents(section)
                    .addTextDisplayComponents(new TextDisplayBuilder({
                        content: `Apresente sua proposta com o máximo de informações possíveis, para que nossa equipe possa avaliar a oportunidade de colaboração.
Orientações:
${client.appEmojis.get("arrow_right")} Apresente sua comunidade, projeto ou organização.
${client.appEmojis.get("arrow_right")} Descreva os objetivos da parceria.
${client.appEmojis.get("arrow_right")} Informe os benefícios oferecidos para ambas as partes.
${client.appEmojis.get("arrow_right")} Disponibilize links ou materiais relevantes para análise.
${client.appEmojis.get("arrow_right")} Aguarde o retorno da equipe responsável.

Todas as propostas serão avaliadas individualmente, considerando sua relevância, viabilidade e benefícios para ambas as partes.`}))
                    .addSeparatorComponents(new SeparatorBuilder())
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.noty.user", label: "Notificar usuário", emoji: `${client.appEmojis.get("bell")}` }),
                        new ButtonBuilder({ style: 4, label: "Excluir ticket", customId: "button.close.ticket", emoji: `${client.appEmojis.get("cross")}` })
                    ))

                await channel.send({ flags: ["IsComponentsV2"], components: [container] });
                await interaction.followUp({ flags: ["Ephemeral"], content: `${client.appEmojis.get("info")} | Ticket criado com sucesso: ${channel}` });
            }
        }
    }
});