const { SlashCommandBuilder } = require('discord.js');
const { getQueue } = require('../../utils/musicQueue.js');

module.exports = {
  category: 'Musique',
  data: new SlashCommandBuilder().setName('resume').setDescription('Reprend la musique en pause'),
  async execute(interaction) {
    const queue = getQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }
    queue.player.unpause();
    await interaction.reply('▶️ Musique reprise.');
  },
};
