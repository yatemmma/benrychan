var templates = loadTemplates();
var types = Type.getTypes();
var callback_tmp = null;

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
  var jsonArray = JSON.parse(localStorage[PREFIX + "templates"] || "[]");
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

function getTypes() {
  return types;
}

function getUserDefined() {
  return JSON.parse(localStorage[PREFIX + "userDefined"] || null);
}

function setUserDefined(text) {
  localStorage[PREFIX + "userDefined"] = JSON.stringify(text);
}

function executeTemplate(template, callback) {
  callback_tmp = callback;
  recursiveExecute(template, [].concat(template.types.reverse()), []);
}

function recursiveExecute(template, executeTypes, results) {
  if (executeTypes.length == 0) {
    executeCallback(template, results);
  }
  chrome.tabs.executeScript(null, { file: "jquery.2.0.3.js" }, function() {
    chrome.tabs.executeScript(null, { code: getExecuteCode(executeTypes.shift()) }, function(result) {
      console.log(result);
      if (typeof result[0] == 'string') {
        callback_tmp(result[0]);
      } else {
        recursiveExecute(template, [].concat(executeTypes), results.concat(result[0]));
      }
    });
  });
}

function getExecuteCode(type) {
  var execute = (!type || !types[type]) ? "return {};" : types[type].code;
  var code = "(function(){ try {" + execute + "} catch(e) { return e.stack; } })();";
  return code;
}

function executeCallback(template, results) {
  var text = template.body;
  results.forEach(function(result) {
    text = replaceText(text, result);
  });
  callback_tmp(text);
  callback_tmp = null;
}

function replaceText(templateBody, params) {
  if (!params) return templateBody;
  for (var key in params) {
  	console.log(key);
    var reg = new RegExp("%{" + key + "}", "g");
    templateBody = templateBody.replace(reg, params[key]);
  }
  return templateBody;
}