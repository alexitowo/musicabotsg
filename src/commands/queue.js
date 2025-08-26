module.exports = {
    name: 'queue',
    execute(message, args, player) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('⚠️ No estás conectado a un canal de voz');

        const queue = player.queues.get(message.guild);
        if (!queue || !queue.currentTrack) return message.channel.send('📋 No hay lista de reproducción');

        const history = queue.history.tracks.data.map((x, i) => `${i + 1}. ${x.title}`);
        const current = `▶️ ${queue.currentTrack.title}`;
        const nextSongs = queue.tracks.data.map((x, i) => `${i + 1 + history.length}. ${x.title}`);

        const list = [...history, current, ...nextSongs];

        message.channel.send(`📀 **Lista en ${message.guild.name}**\n${list.join('\n')}`);
    }
};
