const fetch = require("node-fetch");
const Discord = require("discord.js");

module.exports = {
  name: "cf-user",
  description: "Get your Codeforces user details",
  args: true,
  usage: `<cf-handle>`,
  execute(message, args) {
    var link = `https://codeforces.com/api/user.info?handles=${args[0]}`;

    fetch(link)
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (res.status === "OK") {
          var user = res.result[0];

          console.log(user);
          var rating = user.rating;
          var rank = user.rank;
          var maxrank = user.maxRank;
          var embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle(user.handle)
            .addField("rating", rating)
            .addField("current rank", rank)
            .addField("max rank achived", maxrank)
            .setURL(`https://codeforces.com/profile/${user.handle}`);
            

          message.reply(embed);
        }
      });
  },
};
