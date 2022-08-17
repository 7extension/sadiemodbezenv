const { inviteHandler, greetingHandler } = require("@src/handlers");
const { getSettings } = require("@schemas/Guild");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (client, member) => {
  if (!member || !member.guild) return;

  const { guild } = member;
  const settings = await getSettings(guild);

  // Autorole
  if (settings.autorole) {
    const role = guild.roles.cache.get(settings.autorole);
    if (role) member.roles.add(role).catch((err) => {});
  }

  // Check for counter channel
  if (settings.counters.find((doc) => ["MEMBERS", "BOTS", "USERS"].includes(doc.counter_type.toUpperCase()))) {
    if (member.user.bot) {
      settings.data.bots += 1;
      await settings.save();
    }
    if (!client.counterUpdateQueue.includes(guild.id)) client.counterUpdateQueue.push(guild.id);
  }

  // Check if invite tracking is enabled
  const inviterData = settings.invite.tracking ? await inviteHandler.trackJoinedMember(member) : {};

  // Send welcome message
  client.on('guildMemberAdd', member => {

    const welcome = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('elooo')
      .setDescription('Cała ekipa prosów wita cię na "Prosach Największych", najpierw przeczytaj regulamin i się zweryfikuj na <#968953371727900742>, a później zobacz reszte kanałów!\n\n Jeżeli dostaniesz bana możesz się od niego odwołać pod [tym linkiem](https://p1kaacho72.netlify.app/)')
      .setFooter('<:sadie:1001203945479340124> Prosy')
  
      member.send({ embed: welcome }).catch(console.error);
  
    console.log('Welcome message sent to: ${member.user.tag}');
  });
};
