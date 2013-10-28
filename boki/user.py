from pushyou import db

class User(db.Model):
    
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True)
    status = db.Column(db.SmallInteger)
    account_type = db.Column(db.SmallInteger) # Staff,Client,
    email = db.Column(db.String(255), unique=True)
    password_hash = db.Column(db.String(255))
    password_salt = db.Column(db.String(255))
    business_name = db.Column(db.String(255))
    business_abn = db.Column(db.String(255))
    contact_name = db.Column(db.String(255))
    contact_phone = db.Column(db.String(255))
    address_line1 = db.Column(db.String(255))
    address_line2 = db.Column(db.String(255))
    address_suburb = db.Column(db.String(255))
    address_state = db.Column(db.String(255))
    address_postcode = db.Column(db.String(255))
    plan = db.Column(db.SmallInteger) # Basic? Gold?
    max_sites = db.Column(db.SmallInteger)
    max_active_promo = db.Column(db.SmallInteger)
    max_promo_per_site = db.Column(db.SmallInteger)
    create_date = db.Column(db.Date)
    update_date = db.Column(db.Date)
    last_login_date = db.Column(db.Date)
    last_login_ip = db.Column(db.Date)
    
    locations = db.relationship('Location', backref='user', lazy='dynamic')
    promotions = db.relationship('Promotion', backref='user', lazy='dynamic')

    def __repr__(self):
        return '<User %r>' % (self.username)