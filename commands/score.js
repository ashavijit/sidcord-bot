const { username, api_key } = require("../config.json");
const fs = require("fs");
const fetch = require("node-fetch");
const Discord = require("discord.js");

var plotly = require("plotly")(username, api_key);

module.exports = {
  name: "score",
  description: "Use this when u completed your challenge",
  async execute(message, args) {
    var id = message.author.id;
    const users = fs
      .readdirSync("./users")
      .filter((file) => file.endsWith(".json"));

    var values = [[], [], []];
    console.log(users);
    var msg = new Discord.MessageEmbed();
    msg.setTitle("Score Board :");

    for (var i = 0; i < users.length; i++) {
      var x = users[i];
      var file = `./users/${x}`;
      var data = fs.readFileSync(file);
      var obj = JSON.parse(data);
      console.log(obj);
      values[0].push(i);
      values[1].push(obj.handle);
      values[2].push(obj.score);
    }
    var data = [
      {
        type: "table",
        header: {
          values: [["<b>Rank</b>"], ["<b>User-Handle</b>"], ["<b>Score</b>"]],
          align: "center",
          line: { width: 1, color: "#506784" },
          fill: { color: "#119DFF" },
          font: { family: "Arial", size: 12, color: "white" },
        },
        cells: {
          values: values,
          align: "center",
          line: { color: "#506784", width: 1 },
          font: {
            family: "Arial",
            weight: "bold",
            size: 14,
            color: ["#506784"],
          },
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
