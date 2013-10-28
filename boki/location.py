from pushyou import db


class Location(db.Model):
    
    __tablename__ = 'location'
    
    # See http://stackoverflow.com/questions/574691/mysql-great-circle-distance-haversine-formula
    id = db.Column(db.Integer, primary_key=True)
    #user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(255))
    address = db.Column(db.String(255))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    sin_latitude = db.Column(db.Float)
    cos_lat_long = db.Column(db.Float)
    cos_sin_lat_long = db.Column(db.Float)
    create_date = db.Column(db.Date)
    update_date = db.Column(db.Date)
    
    promotions = db.relationship('Promotion', backref='location', lazy='dynamic')
    
    def __init__(self, name, address, latitude, longitude):
        self.name = name
        self.address = address
        self.latitude = latitude
        self.longitude = longitude

    def __repr__(self):
        return '<User %r>' % (self.username)

    def to_json(self):
        return {
            "id": self.id,
            "name": str(self.name),
            "address": str(self.address),
            "latitude": self.latitude,
            "longitude": self.longitude
        }