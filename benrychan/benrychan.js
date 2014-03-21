function Template() {
  this.id = new Date().getTime();
  this.title = "new template";
  this.types = ["aaa", "bbb"];
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