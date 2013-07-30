# Genome Querying Node Module

## Instructions

Clone the repository

> git clone git://github.com/Maciek416/23query.git

Install node by using brew or through the website http://nodejs.org/#download

> curl http://npmjs.org/install.sh | sh

> npm install

Run the sample code

> node sample.js

## Usage Example

```javascript

var parser = require("23query");
var error = function(err){ console.log("Error while parsing: ", err);};

// A simple test to check if certain SNPs in our dataset match some genotypes.
var callback = function($){
  console.log("successful match test:", $("#rs11240777[genotype=AG], #rs35940137[genotype=GG]").length === 2 ? "passed" : "failed");
  console.log("failed match test:", $("#rs35940137[genotype=CT]").length === 0 ? "passed" : "failed");
};

// Load our sample genome data file
var $ = parser.parse('./manu-genome.txt', callback, error);

```

## TODO

Nicer tests, more ways to query SNPs in the Genome. Probability-selectors for ancestry guessing, etc.
