import { ActionRowBuilder, ButtonBuilder, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder, MessageFlags, RoleSelectMenuBuilder, TextDisplayBuilder } from "discord.js";
import { createEvent } from "../../base/event";
import { NChannel } from "../../functions/Admin/NChannel";
import { NConfig } from "../../functions/Admin/NConfig";
import { NTicket } from "../../functions/Admin/NTicket";

export default createEvent({
    name: "interactionCreate",
    async run(client, interaction) {
        if (interaction.isButton()) {
            const customId = interaction.customId
            //FUNCTION TICKET
            if (customId == "button.ticket") {
                const nty = await NTicket(client, interaction);
                interaction.update(nty);
            }

            if (customId == "button.ticket.category") {
                const container = new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder({ content: "Selecione uma categoria abaixo" }))
                    .addActionRowComponents(new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder({
                            customId: "select.ticket.category",
                            placeholder: "Selecione uma categoria abaixo.",
                            channelTypes: [ChannelType.GuildCategory]
                        })
                    ))
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.home.panelTicket", emoji: client.appEmojis?.get("back") })
                    ))

                interaction.update({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] })
            }

            if (customId == "button.ticket.roles") {
                const container = new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder({ content: "Selecione um cargo abaixo" }))
                    .addActionRowComponents(new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                        new RoleSelectMenuBuilder({
                            customId: "select.ticket.roles",
                            placeholder: "Selecione um cargo abaixo.",
                            maxValues: 2
                        })
                    ))
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.home.panelTicket", emoji: client.appEmojis?.get("back") })
                    ))

                interaction.update({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] })
            }

            if (customId == "button.ticket.logs") {
                const container = new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder({ content: "Selecione um canal para definir os logs abaixo" }))
                    .addActionRowComponents(new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder({
                            customId: "select.ticket.logs",
                            placeholder: "Selecione um canal abaixo.",
                            channelTypes: [ChannelType.GuildText]
                        })
                    ))
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.home.panelTicket", emoji: client.appEmojis?.get("back") })
                    ))

                interaction.update({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] })
            }

            // LOGS SERVIDOR

            if (customId == "button.channelsLogs") {
                const nty = await NChannel(client, interaction);
                interaction.update(nty);
            }

            if (customId == "button.home.panelTicket") {
                const nty = await NTicket(client, interaction);
                interaction.update(nty)
            }

            if (customId == "home.config") {
                const nty = await NConfig(interaction);
                interaction.update(nty);
            }
        }
    }
})