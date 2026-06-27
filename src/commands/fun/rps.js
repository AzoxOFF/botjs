const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const CHOICES = ['pierre', 'papier', 'ciseaux'];
const EMOJIS = { pierre: '🪨', papier: '📄', ciseaux: '✂️' };

function determineWinner(player, bot) {
  if (player === bot) return 'égalité';
  const beats = { pierre: 'ciseaux', papier: 'pierre', ciseaux: 'papier' };
  return beats[player] === bot ? 'gagné' : 'perdu';
}

module.exports = {
  category: 'Fun',
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Joue à pierre-papier-ciseaux contre le bot')
    .addStringOption((o) =>
      o.setName('choix').setDescription('Ton choix').setRequired(true).addChoices(
        { name: 'Pierre', value: 'pierre' },
        { name: 'Papier', value: 'papier' },
        { name: 'Ciseaux', value: 'ciseaux' },
      ),
    ),
  async execute(interaction) {
    const player = interaction.options.getString('choix');
    const bot = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const result = determineWinner(player, bot);

    const text = result === 'égalité' ? '🤝 Égalité !' : result === 'gagné' ? '🎉 Tu as gagné !' : '💀 Tu as perdu !';
    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('✊ Pierre Papier Ciseaux')
      .addFields(
        { name: 'Toi', value: `${EMOJIS[player]} ${player}`, inline: true },
        { name: 'Bot', value: `${EMOJIS[bot]} ${bot}`, inline: true },
      )
      .setDescription(text);
    await interaction.reply({ embeds: [embed] });
  },
};
