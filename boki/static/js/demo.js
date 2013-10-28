var App = new Backbone.Marionette.Application();

var CurrentLocation = Backbone.Model.extend({

  fetch: function() {
      var self = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          self.set('latitude', pos.coords.latitude);
          self.set('longitude', pos.coords.longitude);
          self.trigger('change');
        });
      }
  }

});

var CurrentLocationView = Backbone.View.extend({

  initialize: function() {
    this.loader = new Loader({message: 'Finding Your Location', target: this.el});
    this.loader.start();
    this.listenTo(this.model, 'change', this.render);
  },
  
  render: function() {
    var self = this;
    self.loader.fadeOut('slow').then(function () {
      var lat = self.model.get('latitude');
      var long = self.model.get('longitude');
      self.renderMap(lat, long);
    });
  },
  
  renderMap: function(lat, long) {
    var opts = {
      zoom: 15,
      center: new google.maps.LatLng(lat, long),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(this.el, opts);
    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(lat, long),
      title: 'Your Location'
    });
    var range = new google.maps.Circle({
      map: map,
      radius: 500,
      strokeColor: '#387CB7',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#387CB7',
      fillOpacity: 0.2
    });
    range.bindTo('center', marker, 'position');
  }

});


var Promotion = Backbone.Model.extend({});

var Promotions = Backbone.Collection.extend({

  model: Promotion,

  initialize: function(opts) {
    this.location = opts.location;
    this.listenTo(this.location, 'change', this.fetch);
  },

  url: function() {
    return '/promotions/' + this.location.get('latitude') + '/' + this.location.get('longitude');
  },

  parse: function(data) {
    return data.promotions;
  }

});


var PromotionsView = Backbone.View.extend({

  initialize: function(opts) {
    this.loader = new Loader({message: 'Waiting for location', target: this.el});
    this.loader.start();
    this.template = $(opts.template).html();
    this.listenTo(this.model, 'sync', this.render);
  },

  render: function() {
    var self = this;
    self.loader.fadeOut('slow').then(function () {
      var html = _.template(self.template, {promotions: self.model.toJSON()});
      self.$el.html(html);
    });
  }

});


var currentLocation = new CurrentLocation();
var promotions = new Promotions({location: currentLocation});

var currentLocationView = new CurrentLocationView({
  el: '.current-location-map',
  model: currentLocation
});

var currenPromotionsView = new PromotionsView({
  el: '.current-location-promos',
  template: '#promotion-tmpl',
  model: promotions
});

currentLocation.fetch();