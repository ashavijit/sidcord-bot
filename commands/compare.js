const { username, api_key } = require("../config.json");
const fs = require("fs");
const fetch = require("node-fetch");
const Discord = require("discord.js");
const { time } = require("console");

var plotly = require("plotly")(username, api_key);

module.exports = {
  name: "compare",
  cooldown: 6,
  usage: "<codeforces-user-handle 1> <codeforces-user-handle 2> ",
  args: true,
  description: "Plot graph",
  async execute(message, args) {
    var handle1 = args[0];
    var handle2 = args[1];
    var url1 = `https://codeforces.com/api/user.rating?handle=${handle1}`;
    var url2 = `https://codeforces.com/api/user.rating?handle=${handle2}`;
    var submissions;
    var rating = [];
    var timeSeries = [];

    var datas = await fetch(url1).then((response) => {
      return response.json();
    });

    if (datas.status !== "OK") {
      message.reply(
        `There was an error finding the given codeforces handle: ${args[0]} `
      );
      return;
    }

    submissions = datas.result;
    var time = [];
    var rate = [];
    for (let i = 0; i <= submissions.length - 1; i++) {
      var date = new Date(submissions[i].ratingUpdateTimeSeconds * 1000);

      time.push(date);
      rate.push(submissions[i].newRating);
    }
    timeSeries.push(time);
    rating.push(rate);

    datas = await fetch(url2).then((response) => {
      return response.json();
    });

    if (datas.status !== "OK") {
      message.reply(
        `There was an error finding the given codeforces handle: ${args[1]} `
      );
      return;
    }

    submissions = datas.result;
    var time = [];
    var rate = [];
    for (let i = 0; i <= submissions.length - 1; i++) {
      var date = new Date(submissions[i].ratingUpdateTimeSeconds * 1000);
      time.push(date);

      rate.push(submissions[i].newRating);
    }
    timeSeries.push(time);
    rating.push(rate);

    var trace1 = {
      x: timeSeries[0],
      y: rating[0],
      mode: "lines+markers",
      type: "scatter",
      line: {
        color: "#006400",
        width: 1,
      },
      name: `${args[0]}`,
    };
    var trace2 = {
      x: timeSeries[1],
      y: rating[1],
      mode: "lines+markers",
      type: "scatter",
      line: {
        color: "red",
        width: 1,
      },
      name: `${args[1]}`,
    };
    var ratings = [
      1000,
      1200,
      1400,
      1600,
      1900,
      2100,
      2300,
      2400,
      2600,
      3000,
      4000,
    ];
    var opaci = [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.2, 0.6, 0.6];
    var color = [
      "#aaa",
      "#0f0",
      "#0ff",
      "#00f",
      "#f0f",
      "orange",
      "orange",
      "red",
      "red",
      "rgb(128,0,0)",
    ];

    var shapes = [];

    var shape = {};
    for (var i = 0; i < 10; i++) {
      shape = {
        type: "rect",
        xref: "paper",
        yref: "y",
        x0: 0,
        x1: 1,
        y0: ratings[i],
        y1: ratings[i + 1],
        fillcolor: color[i],
        opacity: opaci[i],
        layer: "below",
        line: {
          width: 0,
        },
      };

      shapes.push(shape);
    }

    var layout = {
      autosize: false,
      title: `Rating for ${args[0]} & ${args[1]}`,
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4,
      },
      showlegend: true,
      shapes: shapes,
    };
    var figure = { data: [trace1, trace2], layout: layout };
    var filename = "plot1.png";

    var pngOptions = { format: "png", width: 1000, height: 500 };
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
        .setTitle(`Rating for ${args[0]} & ${args[1]}`)
        .attachFiles([`./images/${filename}`])
        .setImage(`attachment://${filename}`);
      message.reply(embeds);
    });
  },
};
