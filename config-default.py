import os

_basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = False

ADMINS = frozenset(['rbeardow@gmail.com'])
SECRET_KEY = 'SecretKeyForSessionSigning'
THREADS_PER_PAGE = 8
CSRF_ENABLED = True
CSRF_SESSION_KEY = "somethingimpossibletoguess"

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(_basedir, 'app.db')
DATABASE_CONNECT_OPTIONS = {}