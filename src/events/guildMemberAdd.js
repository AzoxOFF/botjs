const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const channel = member.guild.channels.cache.find(
      (c) => c.name.includes('bienvenue') || c.name.includes('welcome'),
    );
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('👋 Nouveau membre !')
      .setDescription(`Bienvenue ${member} sur **${member.guild.name}** !`)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `Membre n°${member.guild.memberCount}` })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};
