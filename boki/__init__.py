import os

from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CsrfProtect

app = Flask(__name__)
app.config.from_pyfile('../config.py')

db = SQLAlchemy(app)
csrf = CsrfProtect(app)

from boki.page import Page


@app.route('/')
def home():
	page = Page.query.get(1)
	return render_template('page.html', page=page)

@app.route('/page/<int:id>')
def page(id):
	page = Page.query.get(id)
	return render_template('page.html', page=page)

@app.route('/edit')
def edit():
	page = Page('Test Edit Page')
	page_nav = get_page_nav(page)
	return render_template('edit.html', page=page)