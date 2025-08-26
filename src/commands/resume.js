module.exports = {
    name: 'resume',
    async execute(message, args, player) {
        const queue = player.nodes.get(message.guild.id);
        if (!queue || !queue.isPlaying())
            return message.channel.send('❌ No hay nada reproduciéndose.');

        queue.node.setPaused(false);
        return message.channel.send('▶️ Música reanudada.');
    }
};
