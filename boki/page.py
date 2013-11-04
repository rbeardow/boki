from boki import db, app

class Page(db.Model):
    
    __tablename__ = 'page'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    content = db.Column(db.String(255))
    parent_id = db.Column(db.Integer, db.ForeignKey('page.id'))

    parent = db.relation('Page', remote_side=[id], backref='children')
    
    def __init__(self, parent_id, title, content=None):
    	self.parent_id = parent_id
        self.title = title
        self.content = content

    @property
    def siblings(self):
    	return self.parent.children if self.parent else []



