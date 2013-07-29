var tvDB    = require("./../lib/main"),
    key     = require("./config").key;

function getEpisodes (name) {
  tvDB(key).getSeries(name, function(err, res) {
    if (!err) {
      var id = res.Data.Series[0].seriesid;
      tvDB(key).getSeriesAllById(id,function(err, res) {
        if (!err) epName(res.Data.Episode);
      });
    }
  });
}

function epName(eps) {
  for (var i = 0; i < 10; i++) { //Let's just print the first 10 episodes
    console.log(eps[i].EpisodeName);
  }
}

getEpisodes("The Simpsons");
