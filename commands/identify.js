const fetch = require("node-fetch");
const Discord = require("discord.js");
const fs = require("fs");

var { problems } = require("../questions.json");

module.exports = {
  name: "identify",
  description: "Register your user to this bot",
  usage: `<cf-handle>`,
  args: true,
  async execute(message, args) {
    const users = fs
      .readdirSync("./users")
      .filter((file) => file.endsWith(".json"));

    var filename = message.author.id;

    var filenametosearch = `${filename}.json`;

    if (users.includes(filenametosearch)) {
      message.reply("You are already registered");
      return;
    }

    //************************************************* */
    const index = Math.floor(Math.random() * problems.length);

    var name = problems[index].name;
    var rating = problems[index].rating;
    var tags = problems[index].tags;
    var tagsinstring = tags.join(" , ");

    var id = problems[index].contestId;
    var level = problems[index].index;
    var link1 = `https://codeforces.com/problemset/problem/${id}/${level}`;

    var embed = new Discord.MessageEmbed()
      .setColor("0x7289da")
      .setTitle(name)
      .addField("rating", rating)
      .addField("tags", tagsinstring)
      .setURL(link1);

    message.channel.send(
      "`GET A COMPILE-ERROR SUBMISSION IN THIS QUESTION in 60 seconds`"
    );
    message.channel.send(embed);

    /********************************************* */
    var flag = false;
    var count = 0;
    async function subi() {
      count++;
      var link = `https://codeforces.com/api/user.status?handle=${args[0]}&from=1&count=2`;
      var response = await fetch(link);
      var sub = await response.json();
      if (sub.status === "FAILED") {
        message.reply(sub.comment);
        return;
      } else {
        var { result } = sub;
        var { problem, verdict } = result[0];

        console.log(count);
        if (
          problem.index === level &&
          problem.contestId === id &&
          verdict === "COMPILATION_ERROR"
        ) {
          var user = {
            id: filename,
            handle: args[0],
            score: 0,
          };
          var obj = JSON.stringify(user);

          var fileStream = fs.createWriteStream(`./users/${filename}.json`);

          var file = `./users/${filename}.json`;
          fs.writeFile(file, obj, (err) => {
            if (err) {
              console.log(err);
            }
          });

          message.reply("user added");
          flag = true;
          return;
        }
        if (count > 13) {
          message.reply("Try again later");
          return;
        }
        setTimeout(subi, 5000);
      }
    }

    if (count > 13 && flag == false) {
      message.reply("Try again later");
      return;
    } else {
      if (count > 1) return;
      subi();
    }
    if (count > 13 && flag == false) {
      message.reply("Try again later");
      return;
    }
  },
};
