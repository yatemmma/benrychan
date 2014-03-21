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
  var jsonArray = JSON.parse(localStorage[PREFIX + "templates"]);
  var templates = jsonArray.map(function(json) {
  	return Template.fromJson(JSON.parse(json));
  })
  return templates;
}

function addTemplate(template) {
  templates.push(template);
  saveTemplates();
}

function updateTemplate(template) {
  var updated = templates.map(function(item) {
  	if (item.id == template.id) {
  	  return template;
  	}
  	return item;
  });
  templates = updated;
  saveTemplates();
}

function deleteTemplate(template) {
  var deleted = templates.filter(function(item) {
  	return item != template;
  });
  templates = deleted;
  saveTemplates();
}

function getTemplates() {
  return templates;
}

function executeTemplate(template, callback) {
  // TODO
  var result = "xxxxxxxx:" + template.title;
  callback(result);
}