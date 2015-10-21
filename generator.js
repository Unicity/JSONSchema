//Given an input file we want to generate a JSONscehma file based on it's properties
//
var fs = require("fs");
var javascriptObjectToJSONSchema = require("./jstoschema");



function main () {
  //Get the input file from the command line string
  var inputFileName = process.argv[2];
  var outputFileName = process.argv[3];
  var inputFile = fs.readFileSync(inputFileName);
  var inputJSON = JSON.parse(inputFile);
  var finalSchema = javascriptObjectToJSONSchema(inputJSON, "Test input json");
  fs.writeFileSync(outputFileName, JSON.stringify(finalSchema, null, 1));

  //console.log();
 
}

main();

