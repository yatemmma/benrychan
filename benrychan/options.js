var bg = chrome.extension.getBackgroundPage();
var selectedTemplate = null;

$(function() {
  setAddLink();
  setDeleteLink();
  setTemplates();
});

function setAddLink() {
  $("#add").click(function() {
  	var newTemplate = new Template();
  	bg.addTemplate(newTemplate);
  	bg.saveTemplates();
  	var $a = $("<a></a>").text(newTemplate.title).click(function() {
      onClickTemplateLink(this, newTemplate);
    });
    $("#template-list ul").append($("<li></li>").append($a));
    $a.click();
  });
}

function setDeleteLink() {
  $("#delete").click(function() {
    clearTemplate();
    selectedTemplate = null;
    $(".selected").parent().animate({opacity:"hide"}, 1000, "swing", function(){$(this).remove()});
    // TODO save
  });
}

function setTemplates() {
  var templates = bg.getTemplates();
  templates.forEach(function(template, index) {
    if (!template.title) return;
    var $a = $("<a></a>").text(template.title).click(function() {
      onClickTemplateLink(this, template);
    });
    $("ul").append($("<li></li>").append($a));
  });
}

function onClickTemplateLink(element, template) {
  selectedTemplate = template;
  $("#template-list ul li a").removeClass("selected");
  $(element).addClass("selected");
  displayTemplate(template);
}

function displayTemplate(template) {
  $("#template-title input").val(template.title);
  $("#template-types p").text("types: " + template.types.join(","));
  $("#template-body textarea").val(template.body);
}

function clearTemplate() {
  $("#template-title input").val("");
  $("#template-types p").text("types: ");
  $("#template-body textarea").val("");
}