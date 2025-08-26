module.exports = {
    name: 'play',
    aliases: ['p'], 
    async execute(message, args, player) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('No estás conectado a un canal de voz');

        const result = args.join(' ');
        if (!result) return message.channel.send('Ingresa algo para buscar');

        await player.play(voiceChannel, result, {
            nodeOptions: {
                metadata: {
                    channel: message.channel,
                },
                selfDeaf: true,
                volume: 80,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            },
        });
    }
};
