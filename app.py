from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('mongodb+srv://test:sparta@cluster0.gsb7w.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.dbSignupPrac




@app.route('/')
def home():
   return render_template('sign_up.html')



@app.route('/signupPrac', methods=['POST'])
def sign_up_post():
   email_receive = request.form['email_give']
   id_receive = request.form['id_give']
   name_receive = request.form['name_give']
   password_receive = request.form['password_give']

   doc = {
      'email': email_receive,
      'id': id_receive,
      'name': name_receive,
      'password': password_receive
   }
   db.signupPrac.insert_one(doc)

   return jsonify({'msg': '가입완료'})


@app.route('/signupPrac', methods=['GET'])
def sing_up_get():
   return jsonify({'result':'success', 'msg': '이 요청은 GET!'})



if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)