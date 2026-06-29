const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelType,
} = require('discord.js');
const db = require('../../db.js');

module.exports = {
  category: 'Tickets',
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('[Admin] Configure le système de tickets et publie le panneau')
    .addRoleOption((o) => o.setName('role_support').setDescription('Rôle du staff support').setRequired(true))
    .addChannelOption((o) =>
      o.setName('categorie').setDescription('Catégorie où créer les tickets').addChannelTypes(ChannelType.GuildCategory),
    )
    .addChannelOption((o) =>
      o.setName('salon_logs').setDescription('Salon où envoyer les transcriptions de tickets fermés').addChannelTypes(ChannelType.GuildText),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const role = interaction.options.getRole('role_support');
    const category = interaction.options.getChannel('categorie');
    const logChannel = interaction.options.getChannel('salon_logs');

    db.prepare(
      `INSERT INTO ticket_configs (guild_id, category_id, support_role_id, log_channel_id)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(guild_id) DO UPDATE SET category_id = excluded.category_id, support_role_id = excluded.support_role_id, log_channel_id = excluded.log_channel_id`,
    ).run(interaction.guild.id, category?.id ?? null, role.id, logChannel?.id ?? null);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🎫 Support')
      .setDescription('Sélectionne une catégorie ci-dessous pour ouvrir un ticket avec notre équipe.');

    const select = new StringSelectMenuBuilder()
      .setCustomId('ticket_create_select')
      .setPlaceholder('Choisis une catégorie de ticket')
      .addOptions(
        { label: 'Support', description: 'Besoin d\'aide ou question générale', value: 'Support', emoji: '🛠️' },
        { label: 'Plainte', description: 'Signaler un membre ou un problème', value: 'Plainte', emoji: '⚠️' },
        { label: 'Achat', description: 'Question liée à un achat', value: 'Achat', emoji: '💳' },
      );

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Système de tickets configuré et panneau publié.', ephemeral: true });
  },
};
