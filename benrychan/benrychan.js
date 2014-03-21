function Template() {
  this.id = new Date().getTime();
  this.title = "new template";
  this.types = [];
  this.body = "aaaaaaaaaaa";
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

function Type(name) {
  this.name = name;
  this.code;
  this.params;
}

Type.getTypes = function() {
  var types = {};
  var common = new Type("common");
  types[common.name] = common;
  var userDefined = new Type("user_defined");
  types[userDefined.name] = userDefined;
  return types;
}
