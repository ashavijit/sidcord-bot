const { username, api_key } = require("../config.json");
const fs = require("fs");
const fetch = require("node-fetch");
const Discord = require("discord.js");

var plotly = require("plotly")(username, api_key);
module.exports = {
  name: "role",
  cooldown: 6,

  description: "Plot graph",
  execute(message, args) {
    var values = [
      ["Salaries", "Office", "Merchandise", "Legal", "<b>TOTAL</b>"],
      [1200000, 20000, 80000, 2000, 12120000],
      [1300000, 20000, 70000, 2000, 130902000],
    ];

    var data = [
      {
        type: "table",
        header: {
          values: [["<b>Rank</b>"], ["<b>User-Handle</b>"], ["<b>Score</b>"]],
          align: "center",
          line: { width: 1, color: "black" },
          fill: { color: "grey" },
          font: { family: "Arial", size: 12, color: "white" },
        },
        cells: {
          values: values,
          align: "center",
          line: { color: "black", width: 1 },
          font: { family: "Arial", size: 11, color: ["black"] },
        },
      },
    ];
    var filename = "plot3.png";
    var figure = { data };
    var pngOptions = { format: "png", width: 500, height: 500 };

    var x = new Promise((resolve, reject) => {
      plotly.getImage(figure, pngOptions, function (error, imageStream) {
        if (error) return console.log(error);

        var fileStream = fs.createWriteStream(`./images/${filename}`);
        imageStream.pipe(fileStream);
        fileStream.on("error", reject);
        fileStream.on("finish", resolve);
      });
    }).then(() => {
      var embeds = new Discord.MessageEmbed()
        .setTitle("score Board")
        .attachFiles([`./images/${filename}`])
        .setImage(`attachment://${filename}`);
      message.reply(embeds);
    });
  },
};
