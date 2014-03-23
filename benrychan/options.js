var bg = chrome.extension.getBackgroundPage();
var selectedTemplate = null;

$(function() {
  setAddLink();
  setDeleteLink();
  setTypes();
  setEditListener();
  setTemplates();
});

function setAddLink() {
  $("#add").click(function() {
  	var newTemplate = new Template();
  	bg.addTemplate(newTemplate);
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
    if (!selectedTemplate) return;
    bg.deleteTemplate(selectedTemplate);
    selectedTemplate = null;
    $(".selected").parent().animate({opacity:"hide"}, 1000, "swing", function() {
      $(this).remove()
    });
  });
}

function setEditListener() {
  $("#template-title input").on("input", function() {
  	selectedTemplate.title = $(this).val();
  	$(".selected").text(selectedTemplate.title);
  	bg.updateTemplate(selectedTemplate);
  });
  $("#template-body textarea").on("input", function() {
  	selectedTemplate.body = $(this).val();
  	bg.updateTemplate(selectedTemplate);
  });
  $("#type-list textarea").on("input", function() {
  	bg.setUserDefined($(this).val());
  });
}

function setTemplates() {
  var templates = bg.getTemplates();
  templates.forEach(function(template, index) {
    if (!template.title) return;
    var $a = $("<a></a>").text(template.title).click(function() {
      onClickTemplateLink(this, template);
    });
    $("#template-list ul").append($("<li></li>").append($a));
  });
  if (templates.length > 0) {
    $("#template-list ul li a").get(0).click();  
  }
}

function setTypes() {
  var types = bg.getTypes();
  for (var key in types) {
  	var type = types[key];
    var $input = $('<input type="checkbox" name="types" />').val(type.name).click(function() {
      if (!selectedTemplate) return;
      selectedTemplate.types = $("input:checkbox:checked").map(function() {
      	return $(this).val()
      }).get();
      bg.updateTemplate(selectedTemplate);
      $("#template-types p").text("types: " + selectedTemplate.types.join(", "));
    });
    $("#type-list ul").append($("<li></li>").append($("<label></label>").append($input).append(" "+type.name)));
    if (type.params) {
      $("#type-list ul").append($("<li></li>").append($("<div></div>").addClass("type-params").text(type.params)));
    }
  }
  $("#type-list textarea").val(bg.getUserDefined());
}

function onClickTemplateLink(element, template) {
  selectedTemplate = template;
  $("#template-list ul li a").removeClass("selected");
  $(element).addClass("selected");
  displayTemplate(template);
}

function displayTemplate(template) {
  $("#template-title input").val(template.title);
  $("#template-types p").text("types: " + template.types.join(", "));
  $("#template-body textarea").val(template.body);
  $("input:checkbox").each(function() {
  	var checked = ($.inArray($(this).val(), selectedTemplate.types) >= 0);
  	$(this).attr("checked", checked);
  });
}

function clearTemplate() {
  $("#template-title input").val("");
  $("#template-types p").text("types: ");
  $("#template-body textarea").val("");
  $("input:checkbox").attr("checked", false);
}