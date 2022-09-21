const fetch = require("node-fetch");
const Discord = require("discord.js");
const fs = require("fs");

var { problems } = require("../questions.json");
console.log(problems.length);
const prob = problems;
module.exports = {
  name: "challenge",
  description:
    "get a random question according to your given difficulty,  default max is 1500",
  usage: "<difficulty upto 3000>",
  async execute(message, args) {
    var id = message.author.id;
    const users = fs
      .readdirSync("./users")
      .filter((file) => file.endsWith(".json"));

    var filename = message.author.id;

    var filenametosearch = `${filename}.json`;
    if (!users.includes(filenametosearch)) {
      message.reply(
        "You are not registered\nKindly Register your codeforces account with the bot..using `#identify`"
      );
      return;
    } else {
      var file = `./users/${filename}.json`;
      var data = fs.readFileSync(file);

      var obj = JSON.parse(data);
      if (obj.question) {
        message.reply(
          "Complete your previous challenge before requesting for another :grimacing: "
        );
        return;
      }

      var min = 800,
        max = 1500;
      if (args.length == 0) {
        min = 800;
        max = 1500;
      } else {
        if (isNaN(args[0])) {
          message.reply("enter a number in the range `[800,3000]`");
          return;
        } else {
          if (args.length == 1) {
            min = args[0];
            if (min > 1500) max = min;
          } else if (args.length == 2) {
            if (isNaN(args[1])) {
              message.reply("enter a number in the range `[800,3000]`");
              return;
            }
            min = args[0];
            max = args[1];
            if (min > max) {
              message.reply(
                "minimum difficulty should be less than maximum difficulty"
              );
            }
          } else {
            message.reply(
              "enter maximum two numbers in the range `[800,3000]`"
            );
            return;
          }
        }
      }

      problems = prob;
      problems = problems.filter(
        (problem) => problem.rating <= max && problem.rating >= min
      );
      // console.log(problems);
      console.log(max, min);
      const index = Math.floor(Math.random() * problems.length);
      var name = problems[index].name;
      var rating = problems[index].rating;
      var tags = problems[index].tags;
      var tagsinstring = tags.join(" , ");
      var id = problems[index].contestId;
      var level = problems[index].index;
      var link1 = `https://codeforces.com/problemset/problem/${id}/${level}`;

      message.reply(` Challenge Question for you is:`);
      var embed = new Discord.MessageEmbed()
        .setColor("0x7289da")
        .setTitle(name)
        .addField("rating", rating)
        .addField("tags", tagsinstring)
        .setURL(link1);

      var date = new Date();
      var time = date.getTime();
      obj.question = {
        contestId: id,
        index: level,
        score: problems[index].points ? problems[index].points : 500,
        time: time,
      };

      if (rating <= 1700 || !problems[index].points) {
        var sc = [500, 750, 1250, 1750, 2000, 2250, 2500];
        var ch = level[0];
        console.log(ch.charCodeAt(0));
        obj.question.score = sc[ch.charCodeAt(0) - 65];
      }

      fs.writeFile(file, JSON.stringify(obj), (err) => {
        if (err) console.log(err);
      });
      message.channel.send(embed);

      message.reply(
        "Remember to use `%done` just after getting AC in that question"
      );
    }
  },
};
