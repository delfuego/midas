define([
    'jquery',
    'bootstrap',
    'underscore',
    'backbone',
    'i18n',
    'utilities',
    'markdown_editor',
    'project_collection',
    'text!project_form_template'
], function ($, Bootstrap, _, Backbone, i18n, utils, MarkdownEditor, ProjectsCollection, ProjectFormTemplate) {

  var ProjectFormView = Backbone.View.extend({

    events: {
      "blur #project-form-title"      : "v",
      "blur #project-form-description": "v",
      "submit #project-form"          : "post"
    },

    render: function () {
      var template = _.template(ProjectFormTemplate);
      this.$el.html(template);
      
      this.$el.i18n();
      this.initializeTextArea();
      this.$(".btn-add-project").val('Add ' + i18n.t('Project'));
      return this;
    },

    v: function (e) {
      return validate(e);
    },

    initializeTextArea: function () {
      if (this.md) { this.md.cleanup(); }
      this.md = new MarkdownEditor({
        data: '',
        el: ".markdown-edit",
        id: 'project-form-description',
        placeholder: 'A description of your ' + i18n.t('project') + ' that explains the focus, objectives, and deliverables.',
        title: i18n.t('Project') + ' Description',
        rows: 6,
        validate: ['empty']
      }).render();
    },

    post: function (e) {
      if (e.preventDefault) e.preventDefault();

      // validate input fields
      var validateIds = ['#project-form-title', '#project-form-description'];
      var abort = false;
      for (i in validateIds) {
        var iAbort = validate({ currentTarget: validateIds[i] });
        abort = abort || iAbort;
      }
      if (abort === true) {
        return;
      }

      // process project form
      var data;
      data = {
        title       : this.$(".project-title-form").val(),
        description : this.$("#project-form-description").val()
      };

      this.collection.trigger("project:save", data);
    },

    cleanup: function () {
      if (this.md) { this.md.cleanup(); }
      removeView(this);
    }

  });

  return ProjectFormView;

});