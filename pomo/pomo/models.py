from flask_login import UserMixin
from pomo import db

class User(db.Model, UserMixin):
    id = db.Colum(db.Integer, primary_key=True)
    username =  db.Colum(db.string(20))
    email = db.Colum(db.string(20))
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def validate_password(self, password):
        return check_password_hash(self.password_hash, password)
