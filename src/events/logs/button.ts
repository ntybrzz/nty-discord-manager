import { ActionRowBuilder, ButtonBuilder, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";
import { createEvent } from "../../base/event";
import { NLog } from "../../functions/Admin/NLog";

export default createEvent({
    name: "interactionCreate",
    async run(client, interaction) {
        if (interaction.isButton()) {
            const customId = interaction.customId

            if (customId == "button.log.entry") {
                const container = new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder({ content: "Selecione um canal abaixo" }))
                    .addActionRowComponents(new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder({
                            customId: "select.channel.entry",
                            placeholder: "Selecione uma opção abaixo.",
                            channelTypes: [ChannelType.GuildText]
                        })
                    ))
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.home.logs", emoji: client.appEmojis?.get("back") })
                    ))
                interaction.update({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] })
            }

            if (customId == "button.log.exit") {
                const container = new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder({ content: "Selecione um canal abaixo" }))
                    .addActionRowComponents(new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder({
                            customId: "select.channel.exit",
                            placeholder: "Selecione uma opção abaixo.",
                            channelTypes: [ChannelType.GuildText]
                        })
                    ))
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.home.logs", emoji: client.appEmojis?.get("back") })
                    ))
                interaction.update({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] })
            }

            if (customId == "button.log.messages") {
                const container = new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder({ content: "Selecione um canal abaixo" }))
                    .addActionRowComponents(new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder({
                            customId: "select.channel.messages",
                            placeholder: "Selecione uma opção abaixo.",
                            channelTypes: [ChannelType.GuildText]
                        })
                    ))
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.home.logs", emoji: client.appEmojis?.get("back") })
                    ))
                interaction.update({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] })
            }

            if (customId == "button.log.channel") {
                const container = new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder({ content: "Selecione um canal abaixo" }))
                    .addActionRowComponents(new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder({
                            customId: "select.channel.channel",
                            placeholder: "Selecione uma opção abaixo.",
                            channelTypes: [ChannelType.GuildText]
                        })
                    ))
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.home.logs", emoji: client.appEmojis?.get("back") })
                    ))
                interaction.update({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] })
            }

            if (customId == "button.log.roles") {
                const container = new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder({ content: "Selecione um cargo abaixo" }))
                    .addActionRowComponents(new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                        new ChannelSelectMenuBuilder({
                            customId: "select.channel.roles",
                            placeholder: "Selecione um cargo abaixo.",
                            channelTypes: [ChannelType.GuildText]
                        })
                    ))
                    .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder({ style: 2, customId: "button.home.logs", emoji: client.appEmojis?.get("back") })
                    ))
                interaction.update({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] })
            }

            if (customId == "button.home.logs") {
                const nty = await NLog(client, interaction);
                interaction.update(nty);
            }
        }
    }
})