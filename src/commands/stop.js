module.exports = {
    name: 'stop',
    async execute(message, args, player) {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying())
            return message.channel.send('❌ No hay nada reproduciéndose.');

        queue.delete();
        return message.channel.send('⏹️ La música se detuvo y la cola fue limpiada.');
    }
};
