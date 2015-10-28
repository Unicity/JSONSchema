//see if something passed is either an int or a float

function isNumeric(number){
  return (typeof number === 'number') && !isNaN(parseFloat(number)) && isFinite(number);
}

module.exports = function javascriptObjectToJSONSchemaObject (obj, title, options) {
  var finalSchema = {};
  var keys;

  options = options || {};
  
  if(title){
    finalSchema.title = title;
  }

  if (typeof obj === 'object' && !Array.isArray(obj) && !isNumeric(obj) && obj !== null) {
    keys = Object.keys(obj);
    keys = keys.sort();
    finalSchema = {
      properties:{},
      type: "object"
    }
    
    keys.forEach(function(key){
      finalSchema.properties[key] = javascriptObjectToJSONSchemaObject(obj[key], null, options);
    })
  }
  else if (Array.isArray(obj)) {
    finalSchema = {
      items: [javascriptObjectToJSONSchemaObject(obj[0], null, options)],
      type: "array"
    }
  }
  else if (isNumeric(obj)) {
    if (Number.isInteger(obj)) {
      finalSchema = {
        type: "integer"
      }
    }
    else{
      finalSchema = {
        type: "number"
      }
    }
  }
  else if(obj === null){
    if(options.nullToString){
      finalSchema = {
        type: "string"
      }
    }else{
      finalSchema = {
        type: "null"
      }
    }
  }
  else if(typeof obj === "boolean"){
    finalSchema = {
      type: "boolean"
    }
  }
  else {
    finalSchema = {
      type: "string"
    }
    
  }
  //Sort the keys before outputting
  var schemaKeys = Object.keys(finalSchema);
  var result = {};
  schemaKeys.sort();
  schemaKeys.forEach(function(key){
    result[key] = finalSchema[key];
  })
  return result;;
}