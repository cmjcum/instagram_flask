from flask import Flask, render_template, request, jsonify, redirect, url_for
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.gsb7w.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.instaClone


SECRET_KEY = 'CMG'

import jwt
import datetime
import hashlib



@app.route('/')
def home():
   token_receive = request.cookies.get('mytoken')

   # try뜻
   try:
      # jwt 디코드(암호풀기를 해준다 jwt토큰 안에 있는 토큰 리시브 시크릿키) 까지는 알겠는데 헤쉬256이 , 하고 나오는 이유는 모르겠다
      payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
      # payload의 뜻 알기, 이 코드는 db에 저장되어 있는 id 값을 불러오는 코드인듯?
      user_info = db.user.find_one({"id": payload['id']})
      # render_template()뜻 알기
      return render_template('index.html')
   except jwt.ExpiredSignatureError:
      return render_template('login_page.html')
      # return redirect(url_for("login", msg="로그인 시간이 만료되었습니다"))
   except jwt.exceptions.DecodeError:
      return render_template('login_page.html')
      # return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다"))


@app.route('/signup')
def home_signup():
   return render_template('sign_up.html')

# @app.route('/loginpage')
# def home_signup():
#    return render_template('login_page.html')


@app.route('/signupPrac/', methods=['POST'])
def sign_up_post():
   email_receive = request.form['email_give']
   id_receive = request.form['id_give']
   name_receive = request.form['name_give']
   password_receive = request.form['password_give']

   pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

   doc = {
      'email': email_receive,
      'id': id_receive,
      'name': name_receive,
      'password': pw_hash
   }
   db.users.insert_one(doc)
   return jsonify({'msg': '가입완료'})


@app.route('/api/login', methods=['POST'])
def api_login():
   id_receive = request.form['id_give']
   password_receive = request.form['pw_give']
   pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
   result = db.users.find_one({'email': id_receive, 'password': pw_hash})

   if result is not None:
      payload = {
         'id': id_receive,
         'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=30)
      }
      token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')


      return jsonify({'result': 'success', 'token': token})
   else:
      return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


# get을 받는 이유
@app.route('/signupPrac', methods=['GET'])
def sing_up_get():
   token_receive = request.cookies.get('mytoken')
   try:
      payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
      print(payload)

      userinfo = db.users.find_one({'id': payload['id']})
      return jsonify({'result': 'success', 'nickname': userinfo['nick']})
   except jwt.ExpiredSignatureError:
      return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다'})
   except jwt.ExpiredSignatureError:
      return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다'})

   # return jsonify({'result':'success', 'msg': '이 요청은 GET!'})

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)