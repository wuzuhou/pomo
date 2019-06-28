from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from pomo import db

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username =  db.Column(db.String(20))
    email = db.Column(db.String(20))
    password_hash = db.Column(db.String(128))
    active = db.Column(db.Boolean, default=False)
    activestrings = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def validate_password(self, password):
        return check_password_hash(self.password_hash, password)

class Potato():
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    tasknum = db.Column(db.Integer)
    dailyRecords = db.Column(db.String(128))

class Tomato():
    id = db.Column(db.Integer, primary_key=True)
    uptotop = db.Column(db.Boolean, default=False)
    finish = db.Column(db.Boolean, default=False)
