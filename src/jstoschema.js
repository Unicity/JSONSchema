//see if something passed is either an int or a float

function isNumeric(number){
  return (typeof number === 'number') && !isNaN(parseFloat(number)) && isFinite(number);
}

module.exports = function javascriptObjectToJSONSchemaObject (obj, title) {
  var finalSchema = {};
  var keys;
  if(title){
    finalSchema.title = title;
  }
  if (typeof obj === 'object' && !Array.isArray(obj) && !isNumeric(obj) && obj !== null) {
    keys = Object.keys(obj);
    keys = keys.sort();
    finalSchema = {
      type: "object",
      properties:{}
    }
    
    keys.forEach(function(key){
      finalSchema.properties[key] = javascriptObjectToJSONSchemaObject(obj[key]);
    })
  }
  else if (Array.isArray(obj)) {
    finalSchema = {
      type: "array",
      items: [javascriptObjectToJSONSchemaObject(obj[0])]
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
    finalSchema = {
      type: "string"
    }
  }
  else {
    finalSchema = {
      type: typeof obj
    }
    
  }
  
  return finalSchema;
}