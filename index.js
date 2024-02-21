require('dotenv/config');
const { Client } = require('discord.js');
const { OpenAI } = require('openai')

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

client.on('ready', () => {
    console.log('The bot is online');
})

const CHANNELS = ['1207477005902418022'];
const IGNORE_PREFIX = ['!', '.', ','];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,

})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (IGNORE_PREFIX.some(prefix => message.content.startsWith(prefix))) return;
    if (!CHANNELS.includes(message.channelId)) return;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
            {
                role: 'system',
                content: 'You are the worlds best music genre decider. Just using “yes” or “no”, you have to decide if the following band/artist qualifies as indie. Alternative bands, such as Radiohead, are not indie. If you don\'t recognize the band, say "I don\'t recognize this band/artist."'
            },
            {
                role: 'user',
                content: message.content,
            }
        ]
    })
    .catch((error) => console.error('OpenAI Error:\n', error));

    if (!response) {
        message.reply("Not working right now. Try again later.");
        return;
    }

    message.reply(response.choices[0].message.content);
})

client.login(process.env.TOKEN);