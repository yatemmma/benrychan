var PREFIX = "benrychan-";

function Template() {
  this.id = new Date().getTime();
  this.title = "new template";
  this.types = ["common", "user_defined"];
  this.body = "";
}

Template.prototype.json = function() {
  return JSON.stringify(this);
}

Template.fromJson = function(obj) {
  var template = new Template();
  template.id = obj.id;
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
    github_issue,
    user_defined
  ]
   .forEach(function(type) {
    types[type.name] = type;	
  });
  return types;
}

var common = new Type("common", "title, url, selection",
  function() {
    var result = {
      title: document.title,
      url: location.href,
      selection: document.getSelection().toString()
    };
    return result;
  }
);

var github_issue = new Type("github_issue",
  "issue_repo, issue_no, issue_title, issue_labels, issue_milestone, issue_create_at",
  function() {
    var words = document.title.split(" · ");
    var result = {
      issue_repo: words[2].split("#").pop(),
      issue_no: words[1].split("#").pop(),
      issue_title: words[0],
      issue_labels: $("span.label").map(function(){return $(this).text();}).get().join(","),
      issue_milestone: $("a.milestone-name span").text(),
      issue_create_at: $("div.gh-header-meta time").attr("title"),
    };
    return result;
  }
);

var user_defined = new Type("user_defined", "", function(){});
user_defined.code = JSON.parse(localStorage[PREFIX + "userDefined"] || null);