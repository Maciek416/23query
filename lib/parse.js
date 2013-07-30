var fs = require('fs');

var Selectors = {
  // Select a single nucleotyde polymorphism by rsid
  SNP: 1
};

// Regexp for matching [aaaa][bbbb][ccccc] (conditions for selectors)
var conditionRe = /\[([^\]]+)\]/g;

module.exports = {

  // Return a document upon which selection operations can be executed
  parse: function(filename, callback, err){

    fs.readFile(filename, function (errorMessage, data) {

      if (errorMessage) {
        err(errorMessage);
        return;
      }

      //
      // Parse a genome file (i.e. like the kind from 23andme.com's raw data downloader)
      // and produce a map of rsid to objects in the shape:
      //
      // {
      //   id: str,
      //   chromosome: int,
      //   position: int,
      //   genotype: str
      // }
      //
      var lines = new String(data).split("\n")
      var dataset = {};

      for(var i = 0; i < lines.length; i++){
        var tokens = lines[i].trim().split("\t");
        
        if(tokens.length === 4){
          dataset[tokens[0]] = {
            id: tokens[0],
            chromosome: tokens[1],
            position: tokens[2],
            genotype: tokens[3]
          };
        }
      }

      callback(function(query) {

        // Tokenize and clean up the query
        query = query.split(",").map(function(exp){ return exp.trim(); });

        // Parse each expression in the query 
        query = query.map(function(exp){
          var result = {};
          if(exp.indexOf("#") === 0){
            result.op = Selectors.SNP;
            result.value = exp.substr(1).split("[")[0];
            result.conditions = exp.match(conditionRe) || [];
          }
          return result;
        });

        // Finally, return the result of each expression in a list of matched elements
        return query.reduce(function(result, exp) {

          // The only currently-supported operation is to select SNPs via
          // their rsid identifier, with optional conditions for subattributes
          if(exp.op === Selectors.SNP){
            var candidate = dataset[exp.value];

            if(candidate){

              // Check to see if a series of conditions in the form:
              //   [attr1=val1][attr2=val2]
              // are true for this candidate SNP object.
              var matched = exp.conditions.reduce(function(memo, conditionExp){
                // the only supported operator in here is currently equality
                var conditionMatch = false;
                var tokens = conditionExp.substr(1).substr(0, conditionExp.length - 2).split("=").map(function(t){ return t.trim(); })
                if(tokens.length === 2) {
                  var attribute = tokens[0];
                  var value = tokens[1];
                  conditionMatch = candidate[attribute] === value;
                }
                return memo && conditionMatch;
              }, true);

              // If either there were no conditions or all conditions were matched, add 
              // the candidate to the resulting matched elements list.
              if(matched) {
                result = result.concat([candidate]);
              }
            }
          }

          return result;
        },[]);

      });
    });

  }
};