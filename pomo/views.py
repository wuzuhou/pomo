from flask_login import login_user, login_required, current_user, logout_user
from flask import render_template, request, url_for, redirect, flash, session

from pomo import app, db
from pomo.models import User
import re

@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and email == user.email and user.validate_password(password):
            login_user(user)
            session['user_id'] = user.id
            return redirect(url_for('index'))
        else:
            flash('密码是无效的.')
            return redirect(url_for('login'))
    else:
        return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        str=r'^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$'
        email = request.form['email']
        if not re.match(str,'email'):
            flash('邮箱是无效的')
            return redirect(url_for('signup'))
        elif User.query.filter_by(email).first():
            flash('邮箱已经存在')
            return redirect(url_for('signup'))
        else:
            user = User(username=request.form['username'], email=request.form['email'])
            user.set_password(request.form['password'])
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return render_template(url_for('index'))
    else:
        return render_template('signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/forgot', methods=['GET', 'POST'])
def forgot():
    if request.method == 'post':
        ...
    else:
        return render_template('forgot.html')
