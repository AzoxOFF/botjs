const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const play = require('play-dl');
const { getQueue, createQueue, playNext, ensureConnection } = require('../../utils/musicQueue.js');

module.exports = {
  category: 'Musique',
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joue une musique depuis YouTube')
    .addStringOption((o) => o.setName('recherche').setDescription('URL YouTube ou mots-clés').setRequired(true)),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: '❌ Tu dois être dans un salon vocal.', ephemeral: true });
    }

    await interaction.deferReply();
    const query = interaction.options.getString('recherche');

    let url = query;
    let title = query;
    try {
      if (!play.yt_validate(query)) {
        const results = await play.search(query, { limit: 1, source: { youtube: 'video' } });
        if (!results.length) return interaction.editReply('❌ Aucun résultat trouvé.');
        url = results[0].url;
        title = results[0].title;
      } else {
        const videoId = new URL(query).searchParams.get('v');
        const cleanUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : query;
        const info = await play.video_info(cleanUrl);
        url = cleanUrl;
        title = info.video_details.title;
      }
    } catch (error) {
      console.error(error);
      return interaction.editReply('❌ Impossible de trouver cette musique.');
    }

    let queue = getQueue(interaction.guild.id);
    if (!queue) {
      queue = createQueue(interaction.guild, voiceChannel, interaction.channel);
      try {
        await ensureConnection(queue.connection);
      } catch (error) {
        return interaction.editReply(`❌ ${error.message}`);
      }
    }

    queue.songs.push({ url, title });

    const embed = new EmbedBuilder().setColor(0x1abc9c).setDescription(`✅ **${title}** ajouté à la file d'attente.`);
    await interaction.editReply({ embeds: [embed] });

    if (!queue.playing) playNext(interaction.guild.id);
  },
};
