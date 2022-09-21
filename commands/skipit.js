const fetch = require("node-fetch");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "skipit",
  description: "To skip your current challenge",
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
        message.reply("Currently you dont have any challenge !!");
        return;
      }
      var date = new Date();
      var time = date.getTime();
      var timediff = (time - obj.question.time) / 1000;
      console.log(timediff);
      var h = Math.floor(timediff / 3600);
      var m = Math.floor((timediff % 3600) / 60);
      var s = Math.floor(timediff % 60);
      console.log(timediff);

      console.log(`${h} hours , ${m} minutes,${s}seconds`);
      if (h < 3) {
        var limit = 3600 * 3;
        var x = timediff;

        timediff = limit - x;
        console.log(timediff);
        h = Math.floor(timediff / 3600);
        m = Math.floor((timediff % 3600) / 60);
        s = Math.floor(timediff % 60);

        message.reply(
          `Come On Man! You can do it! Try to solve it for more \`${
            h > 0 ? `${h} hours` : ""
          }  ${m > 0 ? `${m} minutes` : ""} ${
            s > 0 ? `${s} seconds` : ""
          }\` before skipping it`
        );

        return;
      } else {
        obj.score = Math.max(0, obj.score - 50);
        delete obj.question;
        message.reply(
          "This challenge is skipped! But try to complete your challenge man, you are losing points"
        );
      }
    }
  },
};
