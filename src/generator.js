//Given an input file we want to generate a JSONscehma file based on it's properties
//
var fs = require("fs");
var javascriptObjectToJSONSchema = require("./jstoschema");
var yargs = require("yargs");

var argv = yargs.boolean("nullToString").argv;

function main () {
  //Get the input file from the command line string



  var inputFileName = process.argv[2];
  var outputFileName = process.argv[3];

  var inputFile; 
  var inputJSON;

  var finalSchema;
  var options = {};

  if(argv.nullString){
    options.nullToString = true;
  }

  //Get the json from standard input if no filename is given
  if(inputFileName){
    inputFile = fs.readFileSync(inputFileName);
  }
  else{
    inputFile = process.stdin;
  }

  inputFile = inputJSON = JSON.parse(inputFile)
  finalSchema = javascriptObjectToJSONSchema(inputJSON, "Test input json");

  //Print the output to the console if there is no output file given
  if(outputFileName){
    fs.writeFileSync(outputFileName, JSON.stringify(finalSchema, null, 2));
  }
  else{
    console.log(JSON.stringify(finalSchema, null, 2))
  }

  //console.log();
 
}

main();

