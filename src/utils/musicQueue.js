const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

const queues = new Map();

function getQueue(guildId) {
  return queues.get(guildId);
}

function createQueue(guild, voiceChannel, textChannel) {
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();
  connection.subscribe(player);

  const queue = { connection, player, songs: [], textChannel, playing: false };
  queues.set(guild.id, queue);

  player.on(AudioPlayerStatus.Idle, () => {
    queue.songs.shift();
    playNext(guild.id);
  });

  player.on('error', (error) => {
    console.error('Erreur lecteur audio:', error);
    queue.songs.shift();
    playNext(guild.id);
  });

  return queue;
}

async function playNext(guildId) {
  const queue = queues.get(guildId);
  if (!queue) return;

  if (queue.songs.length === 0) {
    queue.playing = false;
    setTimeout(() => {
      if (queue.songs.length === 0) {
        queue.connection.destroy();
        queues.delete(guildId);
      }
    }, 60_000);
    return;
  }

  const play = require('play-dl');
  const song = queue.songs[0];
  try {
    const stream = await play.stream(song.url);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    queue.player.play(resource);
    queue.playing = true;
    queue.textChannel.send(`🎶 Lecture : **${song.title}**`).catch(() => {});
  } catch (error) {
    console.error('Erreur de lecture:', error);
    queue.songs.shift();
    playNext(guildId);
  }
}

async function ensureConnection(connection) {
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
  } catch {
    connection.destroy();
    throw new Error('Connexion au salon vocal impossible.');
  }
}

module.exports = { getQueue, createQueue, playNext, ensureConnection, queues };
