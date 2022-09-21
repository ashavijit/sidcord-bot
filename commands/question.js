const fetch = require("node-fetch");
const Discord = require("discord.js");
var { problems } = require("../questions.json");
const Fuse = require("fuse.js");
const { TAG } = require("../tags");

module.exports = {
  name: "question",
  description: "find a question from codeforces",
  usage: " `<tag>` `<min difficulty>` `<max difficulty>`",
  async execute(message, args) {
    console.log(args);
    var tag = args;
    console.log(tag);
    var min = 800,
      max = 3000;

    var link = `https://codeforces.com/api/problemset.problems?`;
    var link1 = `https://codeforces.com/api/problemset.problems?`;
    var x = tag[0];
    var tags1 = "1";

    if (tag.length == 1) {
      if (isNaN(tag[0])) {
        tags1 = x;
        console.log(link);
      } else {
        max = tag[0];
      }
    } else if (tag.length == 2) {
      if (isNaN(tag[0])) {
        tags1 = x;
        max = tag[1];
      } else if (tag.length == 3) {
        tags1 = x;
        min = tag[0];
        max = tag[1];
      }
    } else {
      min = tag[1];
      max = tag[2];
    }
    if (max < min) {
      message.reply("Maximum difficulty should be greater than minimum");
      return;
    }
    if (max < 800 || min > 3000) {
      message.reply(
        "maximum difficuty must be greater than `800` & minimum difficuty must be less than `3000`"
      );
      return;
    }
    if (tags1 !== "1") {
      const options = {
        keys: ["title", "aliases"],
      };
      const fuse = new Fuse(TAG, options);
      console.log(fuse);
      const results1 = fuse.search(tags1);
      console.log(results1);
      tags1 = results1[0].title;

      problems = problems.filter((problem) => {
        var item = problem;
        var a = problem.tags;
        if (a.includes(tags1)) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (isNaN(min) || isNaN(max)) {
      message.reply(
        "Difficulty levels must be a number, in the range : [800,3000]"
      );
      return;
    }
    // console.log(problems);
    // console.log("max & min");
    // console.log(max, min);
    problems = problems.filter(
      (problem) => problem.rating <= max && problem.rating >= min
    );

    //console.log(link);
    //console.log(tag);
    //console.log(problems);
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

    message.reply(embed);
  },
};
