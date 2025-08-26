require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ChannelType } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const fs = require('fs');
const path = require('path');

// Crear cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Prefijo
const prefix = '#';

// Colección de comandos
client.commands = new Collection();

// ─── CARGA DE COMANDOS ─────────────────────────────
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (!command.name || !command.execute) continue; // Ignorar comandos mal formados

    client.commands.set(command.name, command);

    // Soporte para aliases
    if (command.aliases && Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
            client.commands.set(alias, command);
        }
    }
}

// ─── CONFIGURAR PLAYER ─────────────────────────────
const player = new Player(client);
player.extractors.register(YoutubeiExtractor).then(() => {
    console.log('Extractor de YouTube cargado');
});

// Cargar eventos del player
const playerEventsPath = path.join(__dirname, 'events', 'playerEvents.js');
if (fs.existsSync(playerEventsPath)) {
    require(playerEventsPath)(player);
}

// ─── CONTADOR DE USUARIOS EN VOZ ───────────────────
client.voiceCounters = new Map();

client.on('voiceStateUpdate', () => {
    for (const [guildId, data] of client.voiceCounters) {
        const { channel } = data;
        if (!channel || !channel.guild) continue;

        const totalUsersInVoice = channel.guild.channels.cache
            .filter(c => c.type === ChannelType.GuildVoice && c.id !== channel.id)
            .reduce((acc, c) => acc + c.members.size, 0);

        const newName = `🔊 ${totalUsersInVoice} EN VOICE!`;
        if (channel.name !== newName) {
            channel.setName(newName).catch(() => {});
        }
    }
});

// ─── EVENTO DE MENSAJES ───────────────────────────
client.on('messageCreate', (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        command.execute(message, args, player);
    } catch (err) {
        console.error(err);
        message.reply('Hubo un error ejecutando el comando.');
    }
});

// ─── SERVIDOR PARA RAILWAY ───────────────────────
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('🎵 Bot de Discord funcionando correctamente!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// ─── LOGIN DEL BOT ─────────────────────────────────
client.login(process.env.TOKEN);
