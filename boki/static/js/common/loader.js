var Loader = Backbone.View.extend({

  defaultSpinner: {
    lines: 12, // The number of lines to draw
    length: 10, // The length of each line
    width: 4, // The line thickness
    radius: 14, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  },

  smallSpinner: _.defaults({
    length: 4,
    width: 2,
    radius: 5,
    left: 0
  }, this.defaultSpinner),

  initialize: function(opts) {
    this.target = opts.target;
    this.message = opts.message ? opts.message : 'Loading';
    var spinnerOptions;
    switch (opts.size) {
      case 'small': spinnerOptions = this.smallSpinner; break;
      default: spinnerOptions = this.defaultSpinner;
    }
    this.spinner = new Spinner(spinnerOptions);
    this.$el.addClass('loader');
    this.$el.append('<p class="loader-msg">' + this.message + '</p>');
  },

  update: function(msg) {
    this.$el.find('.loader-msg').html(msg);
  },
  
  start: function() {
    $(this.el).show();
    $(this.target).append(this.el);
    this.spinner.spin(this.el);
  },
  
  stop: function() {
    this.spinner.stop();
  },
  
  fadeOut: function() {
    var self = this;
    var def = $.Deferred();
    self.$el.fadeOut('slow', function() {
        self.stop();
        def.resolve();
    });
    return def.promise();
  }

});