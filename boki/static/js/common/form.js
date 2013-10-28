var FormView = Backbone.Marionette.ItemView.extend({

    initialize: function() {
        this.modelBinder = new Backbone.ModelBinder();
        this.listenTo(this.model, 'validated:invalid', this.onValidationError);
        this.listenTo(this.model, 'validated:valid', this.onValidationSuccess);
    },

    onRender: function() {
        this.modelBinder.bind(this.model, this.el, null, {modelSetOptions: {validate: true}});
    },

    onValidationError: function(model, errors) {
        for (var name in errors) {
            var control = this.$el.find('[name=' + name + ']').parents('.control-group');
            control.addClass('has-error').find('.error-message').remove();
            control.append('<p class="help-block error-message">' + errors[name] + '</p>');
        }
    },

    onValidationSuccess: function(model) {
        for (var name in model.changed) {
            var control = this.$el.find('[name=' + name + ']').parents('.control-group');
            control.removeClass('has-error').find('.error-message').remove();
        }
    },

    onSyncError: function(model, xhr) {
        var errors = xhr.responseJSON;
        if (errors) {
            this.onValidationError(model, errors);
        }
        else {
            this.addFormWarning('Sync Error', xhr.status + ': ' + xhr.statusText);
        }
    },

    clearFormWarnings: function() {
        var warning = this.$el.find('.form-warning');
        warning.html();
    },

    addFormWarning: function(title, msg) {
        var warning = this.$el.find('.form-warning');
        warning.append(
          '<div class="alert alert-danger alert-dismissable"><strong>'+title+'</strong> ' + msg + "</div>"
        );
    },

    handleCreate: function() {
        var self = this;
        var onError = function(model, xhr) { self.onSyncError(model, xhr); };
        if (this.model.isValid(true)) {
            this.collection.create(this.model, {wait: true, error: onError});
        }
    },

    handleSave: function() {
        var self = this;
        var onError = function(model, xhr) { self.onSyncError(model, xhr); };
        if (this.model.isValid(true)) {
            this.model.save({}, {error: onError});
        }
    },

    handleRemove: function() {
        this.collection.remove(this.model);
        this.model.destroy();
    },

});