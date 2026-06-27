const { SlashCommandBuilder } = require('discord.js');
const { getQueue, queues } = require('../../utils/musicQueue.js');

module.exports = {
  category: 'Musique',
  data: new SlashCommandBuilder().setName('stop').setDescription('Arrête la musique et vide la file d\'attente'),
  async execute(interaction) {
    const queue = getQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }
    queue.songs = [];
    queue.player.stop();
    queue.connection.destroy();
    queues.delete(interaction.guild.id);
    await interaction.reply('⏹️ Musique arrêtée et file d\'attente vidée.');
  },
};
