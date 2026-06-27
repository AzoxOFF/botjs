const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const REPONSES = [
  'Oui, absolument.', 'Sans aucun doute.', 'Probablement.', 'Je ne suis pas sûr.',
  'Demande à nouveau plus tard.', 'Je ne peux pas te le dire pour le moment.',
  'Non.', 'Très douteux.', 'Mes sources disent non.', 'C\'est certain.',
];

module.exports = {
  category: 'Fun',
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Pose une question à la boule magique')
    .addStringOption((o) => o.setName('question').setDescription('Ta question').setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const reponse = REPONSES[Math.floor(Math.random() * REPONSES.length)];
    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle('🎱 Boule magique')
      .addFields({ name: 'Question', value: question }, { name: 'Réponse', value: reponse });
    await interaction.reply({ embeds: [embed] });
  },
};
