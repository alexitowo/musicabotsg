module.exports = {
    name: 'skip',
    aliases: ['s'],
    execute(message, args, player) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('⚠️ No estás conectado a un canal de voz');

        const queue = player.queues.get(message.guild);
        if (!queue || !queue.currentTrack) return message.channel.send('📋 No hay lista de reproducción');

        const current = queue.currentTrack.title;

        queue.node.skip();
        message.channel.send(`⏭ Se saltó: **${current}**`);
    }
};
