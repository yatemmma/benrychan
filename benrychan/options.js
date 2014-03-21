var bg = chrome.extension.getBackgroundPage();

$(function() {
  setAddLink();
  setDeleteLink();
  setTemplates();
});

function setAddLink() {
  $("#add").click(function() {
  	var $a = $("<a></a>").text("new template").click(function() {
      onClickTemplateLink(this);
    });
    $("#template-list ul").append($("<li></li>").append($a));
    $a.click();
    // TODO save
  });
}

function setDeleteLink() {
  $("#delete").click(function() {
    displayTemplate(new Template(""));
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

function onClickTemplateLink(element) {
  $("#template-list ul li a").removeClass("selected");
  $(element).addClass("selected");
  var template = bg.getTemplate($(element).text());
  displayTemplate(template);
}

function displayTemplate(template) {
  $("#template-title input").val(template.title);
  $("#template-types p").text("types: " + template.types.join(","));
  $("#template-body textarea").val(template.body);
}