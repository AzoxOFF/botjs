const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'Modération',
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprime un nombre de messages dans le salon')
    .addIntegerOption((o) => o.setName('nombre').setDescription('Nombre de messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption((o) => o.setName('membre').setDescription('Filtrer uniquement les messages de ce membre'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('nombre');
    const target = interaction.options.getUser('membre');

    await interaction.deferReply({ ephemeral: true });
    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    const filtered = target ? messages.filter((m) => m.author.id === target.id).first(amount) : messages.first(amount);

    const deleted = await interaction.channel.bulkDelete(filtered, true);
    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setDescription(`🧹 ${deleted.size} message(s) supprimé(s).`);
    await interaction.editReply({ embeds: [embed] });
  },
};
