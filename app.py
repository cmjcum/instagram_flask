from flask import Flask, render_template, jsonify, request
import gridfs
import jwt
import codecs

from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.gsb7w.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.instaClone

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
    email = 'LULULALA_2@insta.com'  # 나중에 토큰에서 메일주소 받으면 되겠지?
    user_info = db.users.find_one({"email": email}, {"_id": False})

    user_id = user_info['user_id']
    user_pic = user_info['pic']
    user_bio = user_info['bio']
    user_name = user_info['name']

    feed_cnt = db.posts.count_documents({"email": email})
    follower_cnt = db.follow.count_documents({"t_email": email})
    following_cnt = db.follow.count_documents({"email": email})

    follower_data = db.follow.find({"t_email": email})
    following_data = db.follow.find({"email": email})


    return render_template('profile.html', user_id=user_id, user_pic=user_pic, user_bio=user_bio, user_name=user_name,
                           follower_cnt=follower_cnt, following_cnt=following_cnt, feed_cnt=feed_cnt, follower_data=follower_data, following_data=following_data)


# @app.route('/user/<username>')
# def user(username):
#     # 각 사용자의 프로필과 글을 모아볼 수 있는 공간
#     token_receive = request.cookies.get('mytoken')
#     try:
#         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
#         status = (username == payload["id"])  # 내 프로필이면 True, 다른 사람 프로필 페이지면 False
#
#         user_info = db.users.find_one({"username": username}, {"_id": False})
#         return render_template('user.html', user_info=user_info, status=status)
#     except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
#         return redirect(url_for("home"))

# @app.route('/api/following'):
# def actionFollow():
#     email = 'LULULALA_2@insta.com'
#     # user_info = db.users.find_one({"email": payload["email"]})
#     user_info = db.users.find_one({"email": email})
#     t_email_receive = request.form["t_email_give"]
#     action_receive = request.form["action_give"]
#     doc = {
#         "t_email": t_email_receive,
#         "email": user_info["email"],
#     }
#
#     if action_receive == "follow":
#         db.follow.insert_one(doc)
#     else:
#         db.follow.delete_one(doc)

@app.route('/feed', methods=['GET'])
def getFeed():
  # 피드 조회하기
  email = 'LULULALA_2@insta.com'
  posts = list(db.posts.find({"email": email}).sort("post_date", -1).limit(20))

  for post in posts:
    post["_id"] = str(post["_id"])

  return jsonify({'posts': posts, 'result': 'success'})

if __name__ == "__main__":
    app.run(debug=True)
    # host 등을 직접 지정하고 싶다면
    # app.run(host="0.0.0.0", port="5000", debug=True)