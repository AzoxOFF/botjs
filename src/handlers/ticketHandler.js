const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
  AttachmentBuilder,
} = require('discord.js');
const db = require('../db.js');

function getConfig(guildId) {
  return db.prepare('SELECT * FROM ticket_configs WHERE guild_id = ?').get(guildId);
}

function controlRow(ticketId) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`ticket_claim_${ticketId}`).setLabel('S\'assigner').setEmoji('🙋').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`ticket_close_${ticketId}`).setLabel('Fermer').setEmoji('🔒').setStyle(ButtonStyle.Danger),
  );
}

async function handleSelect(interaction) {
  if (interaction.customId !== 'ticket_create_select') return;

  const topic = interaction.values[0];
  const config = getConfig(interaction.guild.id);
  if (!config) {
    return interaction.reply({ content: '❌ Le système de tickets n\'est pas configuré sur ce serveur.', ephemeral: true });
  }

  const existing = db
    .prepare('SELECT * FROM tickets WHERE guild_id = ? AND user_id = ? AND status = \'open\'')
    .get(interaction.guild.id, interaction.user.id);
  if (existing) {
    return interaction.reply({ content: `❌ Tu as déjà un ticket ouvert : <#${existing.channel_id}>`, ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: ChannelType.GuildText,
    parent: config.category_id || undefined,
    permissionOverwrites: [
      { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      { id: config.support_role_id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] },
    ],
  });

  const { lastInsertRowid: ticketId } = db
    .prepare('INSERT INTO tickets (guild_id, channel_id, user_id, topic, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(interaction.guild.id, channel.id, interaction.user.id, topic, new Date().toISOString());

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`🎫 Ticket — ${topic}`)
    .setDescription(`Bienvenue ${interaction.user}, un membre du staff <@&${config.support_role_id}> va te répondre.`)
    .setTimestamp();

  await channel.send({ content: `${interaction.user} <@&${config.support_role_id}>`, embeds: [embed], components: [controlRow(ticketId)] });
  await interaction.editReply({ content: `✅ Ticket créé : ${channel}` });
}

async function handleClaim(interaction, ticketId) {
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
  if (!ticket) return interaction.reply({ content: '❌ Ticket introuvable.', ephemeral: true });

  const config = getConfig(interaction.guild.id);
  if (!interaction.member.roles.cache.has(config.support_role_id) && !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.reply({ content: '❌ Seul le staff support peut s\'assigner ce ticket.', ephemeral: true });
  }

  db.prepare('UPDATE tickets SET assigned_to = ? WHERE id = ?').run(interaction.user.id, ticketId);
  await interaction.reply({ content: `🙋 ${interaction.user} a pris en charge ce ticket.` });
}

async function handleClose(interaction, ticketId) {
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
  if (!ticket) return interaction.reply({ content: '❌ Ticket introuvable.', ephemeral: true });

  const config = getConfig(interaction.guild.id);
  const isStaff = interaction.member.roles.cache.has(config.support_role_id) || interaction.member.permissions.has(PermissionFlagsBits.ManageGuild);
  if (!isStaff && interaction.user.id !== ticket.user_id) {
    return interaction.reply({ content: '❌ Tu ne peux pas fermer ce ticket.', ephemeral: true });
  }

  await interaction.reply({ content: '🔒 Fermeture du ticket et génération de la transcription...' });

  const messages = await interaction.channel.messages.fetch({ limit: 100 });
  const transcript = [...messages.values()]
    .reverse()
    .map((m) => `[${m.createdAt.toISOString()}] ${m.author.tag}: ${m.content}`)
    .join('\n');

  db.prepare('UPDATE tickets SET status = \'closed\', closed_at = ? WHERE id = ?').run(new Date().toISOString(), ticketId);

  if (config.log_channel_id) {
    const logChannel = await interaction.guild.channels.fetch(config.log_channel_id).catch(() => null);
    if (logChannel) {
      const attachment = new AttachmentBuilder(Buffer.from(transcript || 'Aucun message.', 'utf-8'), {
        name: `ticket-${ticketId}.txt`,
      });
      const embed = new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle(`🎫 Ticket fermé — #${ticketId}`)
        .addFields(
          { name: 'Sujet', value: ticket.topic, inline: true },
          { name: 'Ouvert par', value: `<@${ticket.user_id}>`, inline: true },
          { name: 'Fermé par', value: `${interaction.user}`, inline: true },
        )
        .setTimestamp();
      await logChannel.send({ embeds: [embed], files: [attachment] });
    }
  }

  setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
}

async function handleInteraction(interaction) {
  if (interaction.isStringSelectMenu()) return handleSelect(interaction);
  if (interaction.isButton()) {
    if (interaction.customId.startsWith('ticket_claim_')) return handleClaim(interaction, interaction.customId.replace('ticket_claim_', ''));
    if (interaction.customId.startsWith('ticket_close_')) return handleClose(interaction, interaction.customId.replace('ticket_close_', ''));
  }
}

module.exports = { handleInteraction };
