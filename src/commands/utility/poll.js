const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NUMBERS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = {
  category: 'Utilitaire',
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Crée un sondage')
    .addStringOption((o) => o.setName('question').setDescription('La question du sondage').setRequired(true))
    .addStringOption((o) => o.setName('options').setDescription('Options séparées par des virgules (max 10)')),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const optionsRaw = interaction.options.getString('options');

    const embed = new EmbedBuilder().setColor(0x5865f2).setTitle('📊 Sondage').setDescription(question).setFooter({ text: `Créé par ${interaction.user.tag}` });

    let reactions = ['👍', '👎'];
    if (optionsRaw) {
      const options = optionsRaw.split(',').map((o) => o.trim()).filter(Boolean).slice(0, 10);
      embed.setDescription(`${question}\n\n${options.map((o, i) => `${NUMBERS[i]} ${o}`).join('\n')}`);
      reactions = NUMBERS.slice(0, options.length);
    }

    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    for (const emoji of reactions) await message.react(emoji);
  },
};
