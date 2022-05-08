from flask import Flask, render_template, jsonify, request

from pymongo import MongoClient


# Flask 객체 인스턴스 생성
app = Flask(__name__)


@app.route('/')  # 접속하는 url
def index():
    return render_template('index.html')

@app.route('/profile')  # 접속하는 url
def profile():
    return render_template('profile.html')


@app.route("/profile", methods=["POST"])
def bucket_post():
    sample_receive = request.form['sample_give']
    print(sample_receive)
    return jsonify({'msg': 'POST(기록) 연결 완료!'})


@app.route("/profile", methods=["GET"])
def follow_get():
    # 팔로잉, 팔로워 db에서 내가 들어간 것들 가져오기


def thumbnail_get():
    # 유저 db에서 최근 게시물 9개 사진 가져오기
    return jsonify({'msg': 'GET 연결 완료!'})


if __name__ == "__main__":
    # app.run(debug=True)
    # host 등을 직접 지정하고 싶다면
    app.run(host="0.0.0.0", port="5000", debug=True)