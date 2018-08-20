const botSettings = require("./includes/botsettings.json")
const Discord = require('discord.js');

const bot = new Discord.Client();

bot.on("ready", async () => {
    console.log("Bot is ready! Username: " + bot.user.username + "#" + bot.user.discriminator);

    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log("Invite link: " + link);
    }).catch(err => {
        console.log("Error: " + error.stack);
    });
    var dailyshop = false;
    bot.user.setStatus("online");
    //Random color
    function setColor()
    {
        var users = -1;
        users += bot.users.size;
        bot.user.setActivity(`${users} :אנשים בשרת | Bot by DK S4muRaY#6861`);
        var date = new Date();
        if(date.getHours() === 24 && date.getMinutes() === 4 && dailyshop === false)
        {
          var dailychannel = bot.channels.find("id", "477414196061929472");
          dailychannel.send("@everyone השופ של היום!");
          dailyshop = true;
        }
        if(date.getHours() !== 24 && date.getMinutes() !== 10)
        {
          dailyshop = false;
        }
    }
    setInterval(() => {setColor();}, 1000);
});
bot.login(botSettings.token);
console.log("Login in using token: " + botSettings.token);
console.log("Using command prefix: \"" + botSettings.prefix + "\"");

bot.on("guildMemberAdd", async member => {
    var welcomechannel = bot.channels.find("id", "478919302372655104");
    welcomechannel.send("<@" + member.user.id + ">" + " !DK ברוך הבא לשרת הדיסקודר של");
    if(member.bot)
    {
        role = member.guild.roles.find("name", "Bots");
        member.addRole(role);
    }
});
bot.on("guildMemberRemove", (member, event) => {
    var welcomechannel = bot.channels.find("id", "478919302372655104");
    welcomechannel.send("" + member.user.username + " עזב את השרת!");
});

bot.on("message", async message => {
    if(message.author.bot)return;
    if(message.channel.type === "dm")return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(botSettings.prefix))return;
    //Kicks
    if(command === `${botSettings.prefix}kick`)
    {
        if(!message.member.hasPermission("KICK_MEMBERS"))
        {
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.username)
                .setDescription("Error! You do not have access to this command!")
                .setColor("#FF000")
                .setTimestamp();
            return message.channel.send(embed);
        }
        let target = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!target)
        {
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.username)
                .setDescription("Error! This target is not a valid user")
                .setColor("#FF0000")
                .setTimestamp();
             return message.channel.send(embed);

        }
        if(!target.kickable)
        {
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.username)
                .setDescription("Error! I cannot kick <@" + target.user.id + ">! It can be because he has a higher role than me or because I do not have access to kick people!")
                .setColor("#FF0000")
                .setTimestamp();
             return message.channel.send(embed);
        }
        let failed = "false"
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";

        await target.kick(reason)
            .catch(error => {
                let embed = new Discord.RichEmbed()
                    .setAuthor(message.author.username)
                    .setDescription(`Oops <@${message.author.id}>, It looks like I cannot kick <@${target.user.id}>! Reason: "${error}"`)
                    .setColor("#FF0000")
                    .setTimestamp();
                failed = "true";
                return message.channel.send(embed);
            });
        if(failed === "true")return;
        console.log(`${message.author.tag} has kicked ${target.user.tag}`);
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setDescription("Success! Kicked <@" + target.user.id + "> Reason: \"" + reason + "\"")
            .setColor("#00FF00")
            .setTimestamp();
         return message.channel.send(embed);
    }
    //Clear
    if(command === `${botSettings.prefix}clear`)
    {
        if(!message.member.hasPermission("MANAGE_MESSAGES"))
        {
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.username)
                .setDescription("Error! You do not have access to this command!")
                .setColor("#FF000")
                .setTimestamp();
            return message.channel.send(embed);
        }
        const iCount = parseInt(args[0], 10);
        if(!iCount || iCount < 2 || iCount > 100)
        {
            let embed = new Discord.RichEmbed()
                .setAuthor(message.author.username)
                .setDescription("Error! Please provide a number between 2 to 100")
                .setColor("#FF000")
                .setTimestamp();
            return message.channel.send(embed);
        }
        const fetchedMsg = await message.channel.fetchMessages({limit: iCount});
        const failed = "false";
        message.channel.bulkDelete(fetchedMsg)
            .catch(error => {
                let embed = new Discord.RichEmbed()
                    .setAuthor(message.author.username)
                    .setDescription("Error! Couldn't delete the message! Reason: \"" + error + "\"")
                    .setColor("#FF000")
                    .setTimestamp();
                failed = "true";
                return message.channel.send(embed);
            });
        if(failed === "true")return;
        console.log(`${message.author.tag} has cleared ${iCount} messages in channel #${message.channel.name}`);
        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setDescription("Sucess! Sucessfully deleted " + iCount + " messages!")
            .setColor("#00FF00")
            .setTimestamp();
        message.channel.send(embed);
        const botmsg = await message.channel.fetchMessages({limit: 1});
        setTimeout(function() {
            message.channel.bulkDelete(botmsg);
        }, 3000);
    }
});
