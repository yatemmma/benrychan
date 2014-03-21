var PREFIX = "benrychan-";

var templates = loadTemplates();

function openOptionPage() {
  chrome.tabs.create({
  	"url": chrome.extension.getURL(chrome.app.getDetails().options_page)
  });
}

function saveTemplates() {
  var jsonArray = templates.map(function (template) {
    return template.json();
  });
  localStorage[PREFIX + "templates"] = JSON.stringify(jsonArray);
}

function loadTemplates() {
  var templates = [
  	_createTemplate("111"),
  	_createTemplate("112"),
  	_createTemplate("113"),
  ];
  return templates;
}

function addTemplate(template) {
  templates.push(template);
}

function getTemplates() {
  return templates;
}

function _createTemplate(title) {
  var t = new Template();
  t.title = title;
  return t;
}

function executeTemplate(template, callback) {
  // TODO
  var result = "xxxxxxxx:" + template.title;
  callback(result);
}