var templates = loadTemplates();
var types = Type.getTypes();
var callback_tmp = null;


(function() {
  if (localStorage[PREFIX + "noMoreTutrial"]) {
    return;
  }
  localStorage[PREFIX + "noMoreTutrial"] = "true";
  
  var sample = new Template();
  sample.title = "sample";
  sample.body = "----\ntitle: %{title}\nurl: %{url}\nI am %{author}, %{hoge}!\n----";
  templates.push(sample);
  saveTemplates();

  setUserDefined('var result = {\n  author: "yatemmma",\n  hoge:"Hello benrychan"\n};\nreturn result;\n');
})();

function openOptionPage() {
  chrome.tabs.create({
  	"url": chrome.extension.getURL(chrome.app.getDetails().options_page)
  });
}

function saveTemplates() {
  var jsonArray = templates.map(function(template) {
    return template.json();
  });
  localStorage[PREFIX + "templates"] = JSON.stringify(jsonArray);
}

function loadTemplates() {
  var jsonArray = JSON.parse(localStorage[PREFIX + "templates"] || "[]");
  var templates = jsonArray.map(function(json) {
  	return Template.fromJson(JSON.parse(json));
  });
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
  types.user_defined.code = text; // TODO 汎用的にする
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
  if (text) {
    results.forEach(function(result) {
      text = replaceText(text, result);
    }); 
  } else {
    text = allParams(results);
  }
  callback_tmp(text);
  callback_tmp = null;
}

function allParams(results) {
  var allParamsText = "";
  results.forEach(function(result) {
    for (var key in result) {
      allParamsText = key + ": " + result[key] + "\n" + allParamsText;
    }
  });
  return allParamsText;
}

function replaceText(templateBody, params) {
  if (!params) return templateBody;
  for (var key in params) {
    var reg = new RegExp("%{" + key + "}", "g");
    templateBody = templateBody.replace(reg, params[key]);
  }
  return templateBody;  
}