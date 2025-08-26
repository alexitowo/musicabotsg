module.exports = (player) => {
    player.events.on('playerStart', (queue, track) => {
        queue.metadata.channel.send(`▶️ Reproduciendo: **${track.title}**`);
    });

    player.events.on('audioTrackAdd', (queue, track) => {
        queue.metadata.channel.send(`➕ Añadido: **${track.title}**`);
    });

    player.events.on('audioTracksAdd', (queue) => {
        queue.metadata.channel.send(`🎶 Se añadieron varias canciones a la cola`);
    });

    player.events.on('disconnect', (queue) => {
        queue.metadata.channel.send('👋 Me desconecté del canal de voz.');
    });

    player.events.on('emptyChannel', (queue) => {
        queue.metadata.channel.send('❌ Me fui porque no había nadie en el canal.');
    });

    player.events.on('emptyQueue', (queue) => {
        queue.metadata.channel.send('✅ La cola terminó.');
    });
};
