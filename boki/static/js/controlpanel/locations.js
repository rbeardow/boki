var LocationApp = new Backbone.Marionette.Application();

_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

Backbone.Validation.configure({forceUpdate: true});

var Location = Backbone.Model.extend({

  urlRoot: '/cp/locations/',

  validation: {
    name: {
      required: true
    }
  }

});

var Locations = Backbone.Collection.extend({

  model: Location,

  url: '/cp/locations/'

});

var LocationsToolbarView = Backbone.Marionette.ItemView.extend({

  template: '#location-toolbar-tmpl',

  events: {
    'click [data-action=add]': 'add',
  },

  add: function(e) {
    LocationApp.controller.handleAdd();
  }

})

var LocationLargeCellView = Backbone.Marionette.ItemView.extend({

  template: '#location-large-cell-tmpl',

  events: {
    'click [data-action=view]': 'view',
    'click [data-action=edit]': 'edit',
  },

  view: function(e) {
    LocationApp.controller.handleView(this.model.get('id'));
  },

  edit: function(e) {
    LocationApp.controller.handleEdit(this.model.get('id'));
  }

});

var LocationSmallCellView = Backbone.Marionette.ItemView.extend({

  template: '#location-small-cell-tmpl',

  events: {
    'click [data-action=view]': 'view'
  },

  view: function(e) {
    LocationApp.controller.handleView(this.model.get('id'));
  }

});

var LocationEditView = FormView.extend({

  template: '#location-edit-tmpl',

  geocoder: new google.maps.Geocoder(),

  events: {
    'click [data-action=create]': 'handleCreate',
    'click [data-action=save]': 'handleSave',
    'click [data-action=cancel]': 'handleCancel',
    'click [data-action=remove]': 'handleRemove',
    'change [name=address]': 'tryGeocode'
  },

  initialize: function() {
    FormView.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:latitude change:longitude', this.renderMap)
  },

  renderMap: function() {
    var map = new MapView({
      el: this.$el.find('.location-map'),
      title: this.title,
      latitude: this.model.get('latitude'), 
      longitude: this.model.get('longitude')
    });
    map.render();
  },  

  tryGeocode: function() {
    var address = this.$el.find('[name=address]').val();
    if (address) {
      var self = this;
      var status = this.$el.find('.geocoding-status');
      var loader = new Loader({
        size: 'small', message: 'Geocoding ' + address, target: status
      });
      loader.start();
      this.geocode(address).done(function(coords) {
        self.model.set('latitude', coords.latitude);
        self.model.set('longitude', coords.longitude);
        self.clearFormWarnings();
      }).fail(function (result) {
        self.addFormWarning('Unable to geocode', result);
      }).always(function() {
        loader.fadeOut();
      });
    }
  },

  geocode: function(address) {
    var def = $.Deferred();
    this.geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var loc = results[0].geometry.location;
        var coords = {latitude: loc.lb, longitude: loc.mb};
        def.resolveWith(coords, [coords]);
      }
      else {
        def.rejectWith(status, [status]);
      }
    });
    return def.promise();
  },

  handleCancel: function(e) {
    if (this.model.isNew()) {
      LocationApp.controller.handleDefault();
    }
    else {
      LocationApp.controller.handleView(this.model.get('id'));
    }
  }

});

var LocationReadOnlyView = Backbone.Marionette.ItemView.extend({

  template: '#location-readonly-tmpl',

  events: {
    'click [data-action=cancel]': 'cancel',
    'click [data-action=edit]': 'edit',
  },

  cancel: function(e) {
    LocationApp.controller.handleDefault();
  },

  onRender: function() {
    var map = new MapView({
      el: this.$el.find('.location-map'),
      title: this.title,
      latitude: this.model.get('latitude'), 
      longitude: this.model.get('longitude')
    });
    map.render();
  },

  edit: function(e) {
    LocationApp.controller.handleEdit(this.model.get('id'));
  }

});

var LocationsView = Backbone.Marionette.CollectionView.extend({

  itemView: LocationLargeCellView,
  cellSize: 'large',

  initialize: function() {
    this.listenTo(this.collection, 'sync reset remove', this.onSync);
  },

  onSync: function() {
    LocationApp.controller.handleDefault();
  },

  switchToSmall: function() {
    this.itemView = LocationSmallCellView;
    this.render();
  },

  switchToLarge: function() {
    this.itemView = LocationLargeCellView;
    this.render();
  }

});

var LocationsController = Backbone.Marionette.Controller.extend({

  initialize: function(opts) {
    this.collection = opts.collection;
  },

  handleDefault: function() {
    console.log('Handling default');
    LocationApp.location.close();
    LocationApp.locations.currentView.switchToLarge();
  },

  handleAdd: function() {
    console.log('Handling add');
    var model = new Location();
    LocationApp.location.show(
      new LocationEditView({model: model, collection: this.collection})
    );
    LocationApp.locations.currentView.switchToSmall();
  },

  handleView: function(id) {
    console.log('Handling view ', id);
    var model = this.collection.get(id);
    if (model) {
      LocationApp.location.show(
        new LocationReadOnlyView({model: model})
      );
      LocationApp.locations.currentView.switchToSmall();
    }
  },

  handleEdit: function(id) {
    console.log('Handling edit ', id);
    var model = this.collection.get(id);
    if (model) {
      LocationApp.location.show(
        new LocationEditView({model: model, collection: this.collection})
      );
      LocationApp.locations.currentView.switchToSmall();
    }
  }

});

var LocationsRouter = Backbone.Marionette.AppRouter.extend({

  appRoutes: {
    ':id': 'handleView',
    ':id/edit': 'handleEdit',
    '': 'handleDefault'
  },

});

var locations = new Locations();
var controller = new LocationsController({collection: locations});
var router = new LocationsRouter({controller: controller});

LocationApp.controller = controller;
LocationApp.router = router;
LocationApp.addRegions({
  toolbar: FadeInRegion.extend({el: '#toolbar'}), //'#sidebar',
  location: '#location', //FadeInRegion.extend({el: '#location'}),
  locations: '#locations' //FadeInRegion.extend({el: '#locations'})
});

$(function() {

  LocationApp.toolbar.show(new LocationsToolbarView());
  LocationApp.locations.show(new LocationsView({collection: locations}));
  Backbone.history.start({pushState: true, root: '/cp/locations/'});

});

$(document).on('click', 'a[data-action]', function (e) {
  var href = $(this).attr('href');
  var protocol = this.protocol + '//';
  if (href.slice(protocol.length) !== protocol) {
    e.preventDefault();
    LocationApp.router.navigate(href);
  }
});