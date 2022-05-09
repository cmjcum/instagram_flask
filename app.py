import codecs

from flask import Flask, render_template, request, jsonify
import gridfs
from datetime import datetime

from pymongo import MongoClient

client = MongoClient('#################')
db = client.instaClone

#Flask 객체 인스턴스 생성
app = Flask(__name__)

@app.route('/') # 접속하는 url
def index():
  return render_template('index.html')

@app.route('/api/feed', methods=["POST"])
def upload():
    images = request.files.getlist("image[]")
    desc = request.form['desc']
    location = request.form['location']
    time = datetime.now()
    email = "LULULALA_2@insta.com"
    user_id = "LULULALA_2"

    fs = gridfs.GridFS(db)
    fs_ids = []

    for image in images:
      fs_ids.append(fs.put(image))

    doc = {
        'email': email,
        'user_id': user_id,
        'photo': fs_ids,
        'location': location,
        'post_date': time,
        'desc': desc
    }

    db.posts.insert_one(doc)

    return jsonify({'msg': '완료!'})

if __name__=="__main__":
  app.run(debug=True)
  # host 등을 직접 지정하고 싶다면
  # app.run(host="127.0.0.1", port="5000", debug=True)