var tvDB    = require("./../lib/main"),
    key     = require("./config").key;

//Episodes to update
var eps = {
  "247808": "Suits",
  "74608": "Top Gear",
  "258171": "Continuum",
  "164091": "Terra Nova"
};

var lastupdated = 1374620168;

function update () {
  tvDB(key).getUpdates(lastupdated,function(err,body) {
    if(!err) updateshow(body.Items.Series);
  });
}

function updateshow(cenas) {
  for (var i = 0; i < cenas.length; i++) {
    if (eps[cenas[i]])
      console.log("We need to update: "+eps[cenas[i]]+" ("+cenas[i]+")");
  }
}

update();
