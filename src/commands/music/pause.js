const { SlashCommandBuilder } = require('discord.js');
const { getQueue } = require('../../utils/musicQueue.js');

module.exports = {
  category: 'Musique',
  data: new SlashCommandBuilder().setName('pause').setDescription('Met en pause la musique en cours'),
  async execute(interaction) {
    const queue = getQueue(interaction.guild.id);
    if (!queue || !queue.playing) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }
    queue.player.pause();
    await interaction.reply('⏸️ Musique en pause.');
  },
};
