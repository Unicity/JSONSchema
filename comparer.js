var fs = require("fs");
var javascriptObjectToJSONSchemaObject = require("./jstoschema");

function compareSchema(source, schema, keyName){
  var errors = [];
  var passes = true;
  if(!source){
    console.log(schema);
    return;
  }
  if(source.type === schema.type){
    if(source.type === "object"){
      var sourceKeys = Object.keys(source.properties);
      var schemaKeys = Object.keys(schema.properties);
      sourceKeys = sourceKeys.sort();
      schemaKeys = schemaKeys.sort();

      if(sourceKeys.length !== schemaKeys.length){
         errors.push(keyName+" property does not contain the same number of keys as the schema")
      }
        sourceKeys.forEach(function(key, i){
          var result;
          if(key === schemaKeys[i]){
            result = compareSchema(source.properties[key], schema.properties[key], key);
            console.log(result);
          }else{
            errors.push("key names should match but don't ( "+key+" , "+schemaKeys[i]+" )");
          }
        });
      }
  }
  else{
    errors.push(keyName+" type does not match schema. ( "+ source.type+" , "+ schema.type+" )");
  }

  return {
    passes: errors.length === 0,
    errors: errors
  }
}

function main(){
  var inputJSON = javascriptObjectToJSONSchemaObject(JSON.parse(fs.readFileSync(process.argv[2])), "root");
  var schema = JSON.parse(fs.readFileSync(process.argv[3]));
  var result = compareSchema(inputJSON, schema, "root");
  if(!result.passes){
    console.log("comparison failed")
    result.errors.forEach(function(error){
      console.log(error);
    })
  }
}

main();