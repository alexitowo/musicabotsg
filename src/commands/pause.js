module.exports = {
    name: 'pause',
    async execute(message, args, player) {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying())
            return message.channel.send('❌ No hay nada reproduciéndose.');

        queue.node.setPaused(true);
        return message.channel.send('⏸️ Música en pausa.');
    }
};
