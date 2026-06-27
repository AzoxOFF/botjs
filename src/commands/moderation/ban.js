const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Modération',
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannit un membre du serveur')
    .addUserOption((o) => o.setName('membre').setDescription('Le membre à bannir').setRequired(true))
    .addStringOption((o) => o.setName('raison').setDescription('Raison du bannissement'))
    .addIntegerOption((o) => o.setName('jours').setDescription('Jours de messages à supprimer (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison') ?? 'Aucune raison fournie';
    const days = interaction.options.getInteger('jours') ?? 0;

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (member && !member.bannable) {
      return interaction.reply({ content: '❌ Je ne peux pas bannir ce membre.', ephemeral: true });
    }

    await interaction.guild.bans.create(target.id, { deleteMessageSeconds: days * 86400, reason });
    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle('🔨 Membre banni')
      .addFields(
        { name: 'Membre', value: `${target.tag}`, inline: true },
        { name: 'Modérateur', value: `${interaction.user.tag}`, inline: true },
        { name: 'Raison', value: reason },
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
