const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const OWNER_ID = '715612911250309260';

module.exports = {
  category: 'Utilitaire',
  ownerOnly: true,
  data: new SlashCommandBuilder()
    .setName('servliste')
    .setDescription('[Owner] Liste les serveurs où le bot est présent')
    .addSubcommand((sub) => sub.setName('liste').setDescription('Affiche tous les serveurs'))
    .addSubcommand((sub) =>
      sub
        .setName('quitter')
        .setDescription('Fait quitter le bot d\'un serveur')
        .addStringOption((o) => o.setName('id').setDescription('ID du serveur à quitter').setRequired(true)),
    ),
  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: '❌ Cette commande est réservée au propriétaire du bot.', ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();

    if (sub === 'liste') {
      const guilds = [...interaction.client.guilds.cache.values()];
      const description = guilds
        .map((g) => `**${g.name}** — \`${g.id}\` — ${g.memberCount} membres`)
        .join('\n') || 'Aucun serveur.';

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(`📋 Serveurs (${guilds.length})`)
        .setDescription(description.slice(0, 4096))
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === 'quitter') {
      const id = interaction.options.getString('id');
      const guild = interaction.client.guilds.cache.get(id);
      if (!guild) {
        return interaction.reply({ content: '❌ Le bot n\'est pas sur un serveur avec cet ID.', ephemeral: true });
      }
      const name = guild.name;
      await guild.leave();
      return interaction.reply({ content: `✅ Le bot a quitté **${name}** (\`${id}\`).`, ephemeral: true });
    }
  },
};
