function Template() {
  this.id = new Date().getTime();
  this.title = "new template";
  this.types = ["aaa", "bbb"];
  this.body = "aaaaaaaaaaa";
}

Template.prototype.json = function() {
  return JSON.stringify(this);
}