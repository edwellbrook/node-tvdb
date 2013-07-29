var tvDB    = require("./../lib/main"),
    key     = require("./config").key;

function getEpisodes (name, lang) {
  tvDB(key).setLanguage(lang);
  tvDB(key).getSeries(name, function(err,body) {
    if (!err) console.log("#"+body.Data.Series.seriesid+" "+body.Data.Series.SeriesName+" - "+body.Data.Series.language);
  });
}

getEpisodes("Conta-me como foi", "pt");
