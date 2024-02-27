require('dotenv/config');
const { Client } = require('discord.js');
const { OpenAI } = require('openai')

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

client.on('ready', () => {
    console.log('The bot is online');
})

const CHANNELS = ['1210005194134392873'];
const IGNORE_PREFIX = ['!', '.', ','];

const IGNORE_DUMBASSES = ['428343552007864348', '262764303214575617', '279654000759144448', '484151643932196877'];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,

})

client.on('messageCreate', async (message) => {
    // if (IGNORE_DUMBASSES.includes(message.author.id)) {
    //     var temp = message.content;
    //     let mixedCaseStr = '';
    //     for (let i = 0; i < temp.length; i++) {
    //         mixedCaseStr += Math.random() > 0.5 ? temp[i].toUpperCase() : temp[i].toLowerCase();
    //     }
    //     mixedCaseStr += ":nerd:"
    //     message.reply(mixedCaseStr);
    //     return;
    // }
    
    if (message.author.bot) return;
    if (IGNORE_PREFIX.some(prefix => message.content.startsWith(prefix))) return;
    if (!CHANNELS.includes(message.channelId)) return;



    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
            {
                role: 'system',
                content: 'You are the worlds best music genre decider. Just using “yes” or “no”, you have to decide if the following band/artist qualifies as indie. Alternative bands, such as Radiohead or Weezer, as well as hip hop or rap artists, such as MF DOOM, are not indie. Arctic Monkeys is indie. If you don\'t recognize the band, say "I don\'t recognize this band/artist. If the artist is Taylor Swift, say "die". If the artist is Radiohead, say "uhhh umm uhh uhhhhh".'
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