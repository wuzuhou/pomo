from flask_login import login_user, login_required, current_user, logout_user
from flask import render_template, request, url_for, redirect, flash, session

from pomo import app, db
from pomo.models import User
import smtplib
from email.mime.text import MIMEText
from email.utils import formataddr
import os
import uuid


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and user.validate_password(password) and user.active == True:
            login_user(user)
            session['user_id'] = user.id
            return redirect(url_for('index'))
        elif not user:
            flash('用户不存在，请先注册！')
            return redirect(url_for('signup'))
        elif not user.validate_password(password):
            flash('密码是无效的.')
            return redirect(url_for('login'))
        else:
            return render_template('toactive.html')
    else:
        return render_template('login.html')

@app.route('/active', methods=['GET', 'POST'])
def active():
    if request.method == 'GET':
        id = request.args.get('id')
        activestrings = request.args.get('activestrings')
        user = User.query.filter_by(id=id).first()
        if activestrings == user.activestrings:
            user.active = True
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('激活失败')
            return render_template('toactive.html')
    else:
        return render_template('toactive.html')



@app.route('/')
@app.route('/app', methods=['GET', 'POST'])
def index():
    if not session.get('user_id'):
        return redirect(url_for('login'))
    else:
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        login_user(user)
        return render_template('index.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        username= request.form['username']
        password = request.form['password']
        if User.query.filter_by(email=email).first():
            flash('邮箱已经存在')
            return redirect(url_for('signup'))
        else:
            user = User(username=username, email=email)
            user.set_password(password)
            activestrings = uuid.uuid4().hex
            user.activestrings = activestrings
            db.session.add(user)
            db.session.commit()
            subject = '番茄土豆账户激活'
            emailcontent = '欢迎使用番茄土豆，请点击下面的链接来激活您的账户'
            emailverify(email, subject, emailcontent)
            return render_template('toactive.html')
            # return redirect(url_for('active'))
    else:
        return render_template('signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/forgot', methods=['GET', 'POST'])
def forgot():
    if request.method == 'POST':
        email=request.form['email']
        user = User.query.filter_by(email=email).first()
        if user:
            subject = '番茄土豆密码重设邮件'
            emailcontent = '您申请了重设密码，请点击下面的链接来重设密码'
            activestrings = uuid.uuid4().hex
            user.activestrings = activestrings
            db.session.add(user)
            db.session.commit()
            emailverify(email,subject,emailcontent)
            return render_template('sendmail.html')
        else:
            flash('该用户不存在，请先注册！')
            return render_template('sendmail_fail.html')
    else:
        return render_template('forgot.html')

def emailverify(email, subject, emailcontent):
    my_sender = '32311935@qq.com'
    my_pass = os.getenv('my_pass')
    user = User.query.filter_by(email=email).first()
    username = user.username
    mail_msg = render_template('mail_content.html',emailcontent=emailcontent)
    message = MIMEText(mail_msg, 'html','utf-8')
    message['From'] = formataddr(["後", my_sender])
    message['To'] = formataddr(["用户您好",email])
    message['Subject'] = subject

    try:
        server = smtplib.SMTP_SSL("smtp.qq.com",465)
        server.login(my_sender, my_pass)
        server.sendmail(my_sender, [email,], message.as_string())
        flash('发送成功！')
        server.quit()
    except Exception:
        flash('无法发送!')
        return render_template('sendmail_fail.html')
