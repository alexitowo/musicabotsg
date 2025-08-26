const { ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'setcounter',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.channel.send('⚠️ No tienes permisos para usar este comando.');
        }

        const guild = message.guild;

        // Revisar si ya existe un canal contador
        let counterChannel = guild.channels.cache.find(c => c.name.includes("users voice"));
        if (counterChannel) {
            return message.channel.send('⚠️ Ya existe un canal contador en este servidor.');
        }

        // Crear canal de voz
        counterChannel = await guild.channels.create({
            name: "0 users voice",
            type: ChannelType.GuildVoice,
            reason: "Canal contador de usuarios en voz",
        });

        // Guardar en el mapa global
        message.client.voiceCounters.set(guild.id, { channel: counterChannel });

        // Actualizar inmediatamente
        const totalUsersInVoice = guild.channels.cache
            .filter(c => c.type === 2 && c.id !== counterChannel.id)
            .reduce((acc, c) => acc + c.members.size, 0);

        await counterChannel.setName(`🔊 ${totalUsersInVoice} EN VOICE!`).catch(() => {});

        message.channel.send(`✅ Canal contador creado: **${counterChannel.name}**`);
    }
};
