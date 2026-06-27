const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  category: 'Fun',
  data: new SlashCommandBuilder().setName('meme').setDescription('Affiche un meme aléatoire de Reddit'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await fetch('https://meme-api.com/gimme');
      const data = await res.json();

      const embed = new EmbedBuilder()
        .setColor(0xff4500)
        .setTitle(data.title ?? 'Meme')
        .setImage(data.url)
        .setFooter({ text: `👍 ${data.ups ?? 0} • r/${data.subreddit ?? 'memes'}` });
      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply('❌ Impossible de récupérer un meme pour le moment.');
    }
  },
};
