var PREFIX = "benrychan-";

function Template() {
  this.id = new Date().getTime();
  this.title = "new template";
  this.types = [];
  this.body = "";
}

Template.prototype.json = function() {
  return JSON.stringify(this);
}

Template.fromJson = function(obj) {
  var template = new Template();
  template.title = obj.title;
  template.types = obj.types;
  template.body = obj.body;
  return template;
}

function Type(name, params, func) {
  this.name = name;
  this.params = params;
  this.code = func.toString().substr(14).slice(0, -1);
}

Type.getTypes = function() {
  var types = {};
  [
    common,
    sample,
    user_defined
  ]
   .forEach(function(type) {
    types[type.name] = type;	
  });
  return types;
}

var common = new Type("common", "a, b",
  function() {
    var result = {
      a:11111111111,
      b:2
    };
    return result;
  }
);

var sample = new Type("sample", "a, b",
  function() {
    var result = {
      a:"sample",
      b:"howaaaaaaa"
    };
    return result;
  }
);

var user_defined = new Type("user_defined", "a, b", function(){});
user_defined.code = JSON.parse(localStorage[PREFIX + "userDefined"] || null);
// TODO 読み込み時がずっとのこる
// TODO ロードすると全部それになる
