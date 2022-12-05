#!/usr/bin/env node

// Awesome price bot. Usage:

import { SoonEnv, TokenRepository} from '@soonaverse/lib';
import Discord, { PresenceUpdateStatus } from 'discord.js';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
  })

const args = process.argv.slice(2);

if (args.length < 1) {
    console.log('Invalid number of arguments.\nUsage: node bot.mjs [token-address]');
    process.exit(1);
}

var token_address = args[0];

var title = ''
var symbol = ''
var total_supply = 0

 const repo3 = new TokenRepository(SoonEnv.PROD);
 repo3.getById(token_address).then((obj) => {

    title =  obj['title']
    symbol =  obj['symbol']
    total_supply =  obj['totalSupply'] / 1000000

});

var prefix = ''; // Example: '!' or empty

console.log('Prefix:', prefix)
console.log('Token address:', token_address)

// ******** SETTINGS ********

// This is where the bot token goes.
var BOT_TOKEN = ""; // <--------------------------------------- INSERT YOUR BOT TOKEN HERE

// ******** END OF SETTINGS ********

// Handle discord messages
client.on("messageCreate", function (message) {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    
    if (command === "p") { // Token price

        let url = "https://soonaverse.com/api/getTokenPrice?token=" + token_address;
        let url2 = "https://api.coingecko.com/api/v3/simple/price?ids=shimmer&vs_currencies=usd";

        let settings = { method: "Get" };
    
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {

            fetch(url2, settings)
            .then(res => res.json())
            .then((json2) => {
    
                var price = json.price
                var mc = total_supply * price

                var price_usd =  Math.round(price * json2.shimmer.usd * 100.0) / 100.0;
                var mc_usd =  Math.round(mc * json2.shimmer.usd)
    
                var str = title + " (" + symbol + ")\n:rocket: Price: " + json.price + 
                " *SMR* / $" + price_usd + "\n:moneybag: Market cap: " + mc + " SMR / $" + mc_usd
    
                console.log(str)
    
                message.reply(str)
            });
        });
    }
});

client.login(BOT_TOKEN);
