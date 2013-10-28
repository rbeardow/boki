var MapView = Backbone.View.extend({

  initialize: function(options) {
    console.log(options);
    this.title = options.title;
    this.latitude = options.latitude;
    this.longitude = options.longitude;
  },
  
  render: function() {
    console.log('Rendering map');
    var opts = {
      zoom: 15,
      center: new google.maps.LatLng(this.latitude, this.longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(this.el, opts);
    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(this.latitude, this.longitude),
      title: this.title
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