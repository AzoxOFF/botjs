const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');

module.exports = {
  category: 'Info',
  data: new SlashCommandBuilder().setName('botinfo').setDescription('Affiche les informations du bot'),
  async execute(interaction) {
    const { client } = interaction;
    const uptime = Math.floor(client.uptime / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`🤖 ${client.user.username}`)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'Serveurs', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Utilisateurs', value: `${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)}`, inline: true },
        { name: 'Commandes', value: `${client.commands.size}`, inline: true },
        { name: 'Uptime', value: `${hours}h ${minutes}m ${seconds}s`, inline: true },
        { name: 'discord.js', value: djsVersion, inline: true },
        { name: 'Node.js', value: process.version, inline: true },
      );
    await interaction.reply({ embeds: [embed] });
  },
};
