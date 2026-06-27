const { SlashCommandBuilder } = require('discord.js');
const { getQueue } = require('../../utils/musicQueue.js');

module.exports = {
  category: 'Musique',
  data: new SlashCommandBuilder().setName('skip').setDescription('Passe à la musique suivante'),
  async execute(interaction) {
    const queue = getQueue(interaction.guild.id);
    if (!queue || queue.songs.length === 0) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }
    queue.player.stop();
    await interaction.reply('⏭️ Musique passée.');
  },
};
