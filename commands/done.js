const fetch = require("node-fetch");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "done",
  description: "Use this when u completed your challenge",
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

      if (!obj.question) {
        message.reply(
          "First use `challenge` command to get yourself a question, then use this"
        );
        return;
      }
      var link = `https://codeforces.com/api/user.status?handle=${obj.handle}&from=1&count=10`;
      var response = await fetch(link);

      var sub = await response.json();

      if (sub.status === "FAILED") {
        message.reply(sub.comment);
        return;
      } else {
        var { result } = sub;
        var { problem, verdict } = result[0];
        if (
          problem.index === obj.question.index &&
          problem.contestId === obj.question.contestId &&
          verdict === "OK"
        ) {
          /********TIME**** */

          console.log(obj.question.time);
          console.log(result[0].creationTimeSeconds);

          var time = result[0].creationTimeSeconds;
          var timediff = time - obj.question.time / 1000;
          var min = timediff / 60;
          console.log(timediff);
          var h = Math.floor(timediff / 3600);
          var m = Math.floor((timediff % 3600) / 60);
          var s = Math.floor(timediff % 60);
          console.log(timediff);
          message.reply(
            `Well Done. you have solved your challenge in \`${
              h > 0 ? `${h} hours` : ""
            }  ${m > 0 ? `${m} minutes` : ""} ${s > 0 ? `${s} seconds` : ""}\``
          );
          var sc = obj.question.score;
          console.log(sc);
          var score = Math.max(0.3 * sc, (1 - min / 250) * sc);

          console.log(score);
          obj.score += Math.floor(score);
          delete obj.question;
          fs.writeFileSync(file, JSON.stringify(obj), (err) => {
            if (err) console.log(err);
          });
          message.channel.send(`Your score :${obj.score}`);
          return;
        } else {
          message.reply("No cheating... \nSubmit it and then come here..");
          return;
        }
      }
    }
  },
};
