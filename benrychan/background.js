var PREFIX = "benrychan-";

var templates = loadTemplates();
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

function getTypes() {
  return Type.getTypes();
}

function executeTemplate(template, callback) {
  callback_tmp = callback;
  recursiveExecute(template, [].concat(template.types), []);
}

function recursiveExecute(template, executeTypes, results) {
  if (executeTypes.length == 0) {
    executeCallback(template, results);
  }
  chrome.tabs.executeScript(null, { file: "jquery.2.0.3.js" }, function() {
    chrome.tabs.executeScript(null, { code: getExecuteCode(executeTypes.shift()) }, function(resultObj) {
      // TODO String判定
      console.log(resultObj);
      recursiveExecute(template, [].concat(executeTypes), results.concat(resultObj[0]));
    });
  });
}

function getExecuteCode(type) {
  console.log(type);
  if (!type) {
    var execute1 = "return {};";
  } else if (type == "common") {
    var execute1 = "console.log(1); return {a:1, b:2};";
  } else {
  	var execute1 = "console.log(2); return {b:3, c:222};";
  }
  var code = "(function(){ try {" + execute1 + "} catch(e) { return e.stack; } })();";
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