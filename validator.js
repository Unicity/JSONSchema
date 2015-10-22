//Given a schema this validates whether or not it is valid
var fs = require("fs");

function validateSchema(schema){
    var validKeywords = [
    "properties",
    "type",
    "$ref",
    "title",
    "pattern",
    "items"
  ];

  var validTypes = [
    "string",
    "array",
    "object",
    "integer",
    "number"
  ];

  var errors = [];
  var keys = Object.keys(schema);
  keys.forEach(function(key){
    if(validKeywords.indexOf(key) === -1){
      errors.push("keyword: `"+key+"` is not valid");
    }
  });

  if(validTypes.indexOf(schema.type) > -1){
    if(schema.type === "object"){
      var propertyKeys = Object.keys(schema.properties);
      propertyKeys.forEach(function(key){
        errors = errors.concat(validateSchema(schema.properties[key]));
      });
    }
  }
  else{
    errors.push("Schema contains non-valid type ( "+schema.type+" )");

  }
  return errors;
}

tokens = {
  unknown: 0,
      
  openParen: 1,    
  closeParen: 2,    
  colon: 3,    
  semicolon: 4,    
  asterisk: 5,    
  openBracket: 6,    
  closeBracket: 7,    
  openBrace: 8,    
  closeBrace: 9,
  comma: 10, 

  string: 11,    
  identifier: 12,    
  endOfLine: 13,

  endOfStream: 14, 
}

function createNode(key, type, value, line){
  return {
    key: key,
    type: type,
    value: value,
    line: line,
    children: []
  }
}

function isWhitespace(character){
  var result = ((character == ' ') ||
                 (character == '\t') ||
                 (character == '\v') ||
                 (character == '\f'));
  return result;
}

function eatAllWhitespace(tokenizer){

  while(1){
    var character = tokenizer.text[tokenizer.index];
    if(isWhitespace(character)){
      tokenizer.index++;
    } 
    else if(isEndOfLine(character)){
      tokenizer.index++;
      tokenizer.lineNumber++;
    }
    else{
      break;
    }
  }
}

function isEndOfLine(character){
  var result = ((character == '\n') ||
                 (character == '\r'));

  return(result);
}

function requireToken(tokenizer, type){
  var token = getToken(tokenizer);
  while(token.type !== type && token.type !== tokens.endOfStream){
    token = getToken(tokenizer, type);
  }
  return token;
}

function getToken(tokenizer){
  var token = {
    text: "",
  }

  eatAllWhitespace(tokenizer);

  var character = tokenizer.text[tokenizer.index];
  tokenizer.index++;
  //console.log(character);
  switch(character){  


    case '(': {token.type = tokens.openParen; break;}
    case ')': {token.type = tokens.closeParen; break;}
    case ':': {token.type = tokens.colon; break;}
    case ';': {token.type = tokens.semicolon; break;}
    case '*': {token.type = tokens.asterisk; break;}
    case '[': {token.type = tokens.openBracket; break;}
    case ']': {token.type = tokens.closeBracket; break;}
    case '{': {token.type = tokens.openBrace; break;}
    case '}': {token.type = tokens.closeBrace; break;}
    case ':': {token.type = tokens.colon; break;}
    case ',': {token.type = tokens.comma; break;}
    case '"': {
      //Get the text from a string
      var textStart = tokenizer.index;
      token.type = tokens.string;
      while(tokenizer.text[tokenizer.index] && tokenizer.text[tokenizer.index] != '"'){
        if(tokenizer.text[tokenizer.index] === "\\" && tokenizer.text[tokenizer.index+1]){
          tokenizer.index++;
        }
        tokenizer.index++;
      }
      if(tokenizer.text[tokenizer.index] === '"'){
        token.text = tokenizer.text.substring(textStart, tokenizer.index);
        tokenizer.index++;
      }   
    }break;
    default:{
      
      token.type = tokens.unknown;
      
      if(!character){
        //console.log("no char")
        token.type = tokens.endOfStream;
      }
    }break;
  }
  return token;
}

function ASTFromText (tokenizer, key) {
  var parsing = true;
  var node = createNode();
  var childKey;
  var childNode;
  var tokenKeys = Object.keys(tokens);
  var token = getToken(tokenizer);
  //console.log(tokenKeys[token.type]);
  switch(token.type){
    case tokens.openBrace: {
      node = createNode(key, "object", null, tokenizer.lineNumber);
      
      while(token.type !== tokens.closeBrace && token.type !== tokens.endOfStream){
        childKey = requireToken(tokenizer, tokens.string);
        requireToken(tokenizer, tokens.colon);
        childNode = ASTFromText(tokenizer, childKey.text);
        node.children.push(childNode);
        //requireToken(tokenizer, tokens.comma);
        token = getToken(tokenizer);
      }
    }break;

    case tokens.openBracket: {
      node = createNode(key, "array", null, tokenizer.lineNumber);
      var index = 0;
      while(token.type !== tokens.closeBracket && token.type !== tokens.endOfStream){
        childNode = ASTFromText(tokenizer, index);
        token = getToken(tokenizer);
        node.children.push(childNode);
        if(token.type !== tokens.comma){
          break;
        }
        index++;
      }
    }break;

    case tokens.string: {
      node = createNode(key, "string", token.text, tokenizer.lineNumber);
    }break;
    case tokens.endOfStream:{
      parsing = false;
    }break;
    default: {
      node = createNode(key, "unknown", "I DONT KNOW", tokenizer.lineNumber)
    }break;
  }
  return node;
  console.log(lineNumber);
}

function main () {
  var schema = fs.readFileSync(process.argv[2]).toString("utf8");
   var tokenizer = {
    index: 0,
    text: schema,
    lineNumber: 1,
  }
  var ast = ASTFromText(tokenizer, "root");
  console.log(JSON.stringify(ast, null, 2));
  //console.log(validateSchema(schema));
}

main();