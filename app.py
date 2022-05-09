from flask import Flask, render_template, jsonify, request
import gridfs
import codecs

from pymongo import MongoClient

# Flask 객체 인스턴스 생성
app = Flask(__name__)


@app.route('/')  # 접속하는 url
def index():
    return render_template('index.html')


@app.route('/profile')  # 접속하는 url
def profile():
    return render_template('profile.html')

@app.route('/<user_id>')
def user(user_id):
    return render_template('profile.html', word={user_id})

@app.route('/api/profile', methods=['GET'])
def getUserInfo():
    user_info = list(db.users.find({}, {'password':False}))
    return jsonify({'getUserInfo': user_info})



@app.route('/prifile/download', methods=['GET'])
# user 특정
# 특정한 user의 포스트 id 최신 9개 수집
# 각 포스트 id의 img 리스트의 첫번째 이미지 주소
def download():
    fs = gridfs.GridFS(db)
    data = list(db.fs.files.find({}).sort("uploadDate", -1).limit(9))
    images = []
    for d in data:
        outputData = fs.get(d['_id'])
        base64_img = codecs.encode(outputData.read(), 'base64')
        decoded_img = base64_img.decode('utf-8')
        images.append(decoded_img)

    return jsonify({'image': images})


if __name__ == "__main__":
    app.run(debug=True)
    # host 등을 직접 지정하고 싶다면
    # app.run(host="0.0.0.0", port="5000", debug=True)