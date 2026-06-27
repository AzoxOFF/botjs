const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../utils/musicQueue.js');

module.exports = {
  category: 'Musique',
  data: new SlashCommandBuilder().setName('queue').setDescription('Affiche la file d\'attente musicale'),
  async execute(interaction) {
    const queue = getQueue(interaction.guild.id);
    if (!queue || queue.songs.length === 0) {
      return interaction.reply({ content: '❌ La file d\'attente est vide.', ephemeral: true });
    }

    const list = queue.songs.map((s, i) => `${i === 0 ? '▶️' : `${i}.`} ${s.title}`).join('\n');
    const embed = new EmbedBuilder().setColor(0x1abc9c).setTitle('🎵 File d\'attente').setDescription(list);
    await interaction.reply({ embeds: [embed] });
  },
};
