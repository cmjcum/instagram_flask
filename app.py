import codecs

from flask import Flask, render_template, request, jsonify
import gridfs

from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.gsb7w.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.instaClone

#Flask 객체 인스턴스 생성
app = Flask(__name__)

@app.route('/') # 접속하는 url
def index():
  return render_template('index.html')

@app.route('/upload', methods=["POST"])
def upload():
    images = request.files.getlist("image[]")
    desc = request.form['desc']
    location = request.form['location']

    fs = gridfs.GridFS(db)

    for image in images:
      fs.put(image)

    doc = {
        'desc': desc,
        'location': location
    }

    post_id = db.posts.insertOne(doc)
    print(post_id)

    return render_template('index.html')

if __name__=="__main__":
  app.run(debug=True)
  # host 등을 직접 지정하고 싶다면
  # app.run(host="127.0.0.1", port="5000", debug=True)