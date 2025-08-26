const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'updatec',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.channel.send('⚠️ No tienes permisos para usar este comando.');
        }

        const data = message.client.voiceCounters.get(message.guild.id);
        if (!data) return message.channel.send('⚠️ No hay un canal contador configurado en este servidor.');

        const { channel } = data;
        if (!channel || !channel.guild) return message.channel.send('⚠️ El canal contador no existe.');

        // Contar usuarios en todos los canales de voz, ignorando el canal contador
        const totalUsersInVoice = channel.guild.channels.cache
            .filter(c => c.type === 2 && c.id !== channel.id)
            .reduce((acc, c) => acc + c.members.size, 0);

        const newName = `${totalUsersInVoice} users voice`;
        if (channel.name !== newName) {
            await channel.setName(newName).catch(() => {});
            return message.channel.send(`✅ Canal contador actualizado: **${newName}**`);
        } else {
            return message.channel.send('ℹ️ El canal contador ya está actualizado.');
        }
    }
};
