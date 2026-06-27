const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Modération',
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Débannit un membre via son ID')
    .addStringOption((o) => o.setName('id').setDescription('ID du membre à débannir').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const id = interaction.options.getString('id');
    try {
      await interaction.guild.bans.remove(id);
      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle('✅ Membre débanni')
        .setDescription(`L'utilisateur \`${id}\` a été débanni.`)
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply({ content: '❌ Impossible de débannir cet utilisateur (ID invalide ou non banni).', ephemeral: true });
    }
  },
};
