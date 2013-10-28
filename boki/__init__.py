import os
from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CsrfProtect

app = Flask(__name__)
app.config.from_pyfile('../config.py')

db = SQLAlchemy(app)
csrf = CsrfProtect(app)

def page_model():
	return {
		'title': app.config['BOKI_TITLE']
	}

@app.route('/')
def home():
	page = page_model()
	return render_template('dashboard.html', page=page)