var parser = require("./lib/parse");

var error = function(err){
  console.log("Error while parsing: ", err);
};

var callback = function($){
  console.log("successful match test:", $("#rs11240777[genotype=AG], #rs35940137[genotype=GG]").length === 2 ? "passed" : "failed");
  console.log("failed match test:", $("#rs35940137[genotype=CT]").length === 0 ? "passed" : "failed");
};

var $ = parser.parse('./sample-data/manu-genome.txt', callback, error);
