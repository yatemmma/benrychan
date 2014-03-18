var bg = chrome.extension.getBackgroundPage();
var templates = bg.getTemplates();

$(function() {
  setApplicationInfo();
  setSettingsLink();
  setTemplateLink();
});

function setApplicationInfo() {
  var app = chrome.app.getDetails();
  $("#appinfo").text(app.name + " " + app.version);
}

function setSettingsLink() {
  $("#settings a").click(function() {
    bg.openOptionPage();
  });
}

function setTemplateLink() {
  templates.forEach(function(template, index) {
    if (!template.title) return;
    var $a = $("<a></a>").text(template.title).click(function() {
      onClickTemplateLink(this, template);
    });
    $("ul").append($("<li></li>").append($a));
  });
}

function onClickTemplateLink(element, template) {
  $("li a").css({"font-weight": "normal"});
  $(element).css({"font-weight": "bold"});
  bg.executeTemplate(template, function(result) {
    $("#result").animate({"min-width": "500px", "min-height": "400px"}, 200, function() {
      $(this).val(result).select();
    })
  });
}
