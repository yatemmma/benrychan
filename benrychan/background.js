function openOptionPage() {
  chrome.tabs.create({
  	"url": chrome.extension.getURL(chrome.app.getDetails().options_page)
  });
}

function getTemplates() {
  // TODO 
  var templateList = [
  	new Template("tmpl1"),
  	new Template("tmpl2"),
  	new Template("tmpl3"),
  ];
  return templateList;
}

function executeTemplate(template, callback) {
  // TODO
  var result = "xxxxxxxx:" + template.title;
  callback(result);
}

function getTemplate(title) {
  // TODO
  return new Template(title);
}