const { username, api_key } = require("../config.json");
const fs = require("fs");
const fetch = require("node-fetch");
const Discord = require("discord.js");

var plotly = require("plotly")(username, api_key);

module.exports = {
  name: "plot",
  cooldown: 5,
  usage: "<codeforces-user-handle>",

  description: "Plot graph",
  async execute(message, args) {
    if (args.length > 1) {
      message.reply("`username` should be single word");
      return;
    }

    //console.log(obj);
    var handle;
    if (!args.length) {
      var filename = message.author.id;
      var file = `./users/${filename}.json`;

      const users = fs
        .readdirSync("./users")
        .filter((file) => file.endsWith(".json"));

      var filenametosearch = `${filename}.json`;
      if (!users.includes(filenametosearch)) {
        message.reply(
          "You are not registered\nKindly Register your codeforces account `OR` give some argument"
        );

        return;
      }

      var data = fs.readFileSync(file);
      var obj = JSON.parse(data);

      handle = obj.handle;
    } else handle = args[0];

    var url = `https://codeforces.com/api/user.rating?handle=${handle}`;
    var submissions;
    var rating = [];
    var timeSeries = [];

    var datas = await fetch(url).then((response) => {
      return response.json();
    });

    if (datas.status !== "OK") {
      message.reply(
        `There was an error finding the given codeforces handle: ${handle} `
      );
      return;
    }

    submissions = datas.result;
    // console.log(submissions);
    // console.log(submissions.length);

    var maxRating = -1;
    var mini = 5000;
    var da = new Date();
    for (i = 0; i <= submissions.length - 1; i++) {
      var date = new Date(submissions[i].ratingUpdateTimeSeconds * 1000);

      rating.push(submissions[i].newRating);

      if (maxRating < submissions[i].newRating) {
        maxRating = submissions[i].newRating;
        da = date;
      }
      if (mini > submissions[i].newRating) {
        mini = submissions[i].newRating;
      }
      timeSeries.push(date);
    }

    // console.log(rating);
    // console.log(timeSeries);

    var trace1 = {
      x: timeSeries,
      y: rating,
      mode: "lines+markers",
      type: "scatter",
      line: {
        color: "rgb(255,217,25)",
        width: 2,
      },
      name: `${handle}`,
    };
    var trace2 = {
      x: [da],
      y: [maxRating],
      mode: "markers",
      type: "scatter",
      marker: {
        color: "red",
        opacity: 0.5,
        size: 8,
      },
      name: "max rating",
    };

    if (mini > 1200) mini = 1000;
    var ratings = [
      mini - 200,
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
    var opaci = [0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.6, 0.2, 0.6, 0.6];
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
      if (maxRating < ratings[i + 1]) break;
    }
    var layout = {
      autosize: false,
      title: `Rating for ${handle}`,
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4,
      },
      layer: "below",
      showlegend: true,
      shapes: shapes,
    };
    //console.log(layout);

    var figure = { data: [trace1, trace2], layout: layout };
    // console.log(figure);
    var filename = "plot.png";

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
        .setTitle(`Rating for ${handle}`)
        .attachFiles([`./images/${filename}`])
        .setImage(`attachment://${filename}`);
      message.reply(embeds);
    });

    //console.log(timeSeries);
  },
};
