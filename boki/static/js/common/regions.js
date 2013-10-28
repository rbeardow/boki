var FadeInRegion = Backbone.Marionette.Region.extend({

  open: function(view){
    this.$el.hide();
    //this.$el.html(view.el).show();
    this.$el.html(view.el).fadeIn();
  }

});