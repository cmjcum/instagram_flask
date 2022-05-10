from flask import Flask, render_template, request, jsonify, redirect, url_for
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId

import jwt
import hashlib
import datetime
from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.gsb7w.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.instaClone
SECRET_KEY = 'CMG'

# Flask 객체 인스턴스 생성
app = Flask(__name__)


@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    # try뜻
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"email": payload['id']}, {'_id': False})
        if user_info['pic'] == '':
            pic = './static/img/profile.jpg'
        else:
            pic = user_info['pic']
        return render_template('index.html', profile_pic=pic, user_info=user_info)

    except jwt.ExpiredSignatureError:
        return render_template('login_page.html')
        # return redirect(url_for("login", msg="로그인 시간이 만료되었습니다"))
    except jwt.exceptions.DecodeError:
        return render_template('login_page.html')
        # return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다"))

    
@app.route('/signup')
def home_signup():
    return render_template('sign_up.html')


@app.route('/api/signup', methods=['POST'])
def sign_up_post():
    email_receive = request.form['email_give']
    id_receive = request.form['id_give']
    name_receive = request.form['name_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        'email': email_receive,
        'user_id': id_receive,
        'name': name_receive,
        'password': pw_hash
    }
    db.users.insert_one(doc)
    return jsonify({'msg': '가입완료'})


# get을 받는 이유
@app.route('/api/signup', methods=['GET'])
def sign_up_get():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        userinfo = db.users.find_one({'id': payload['id']})
        return jsonify({'result': 'success'})
    except jwt.ExpiredSignatureError:
        return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다'})
    except jwt.ExpiredSignatureError:
        return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다'})

    # return jsonify({'result':'success', 'msg': '이 요청은 GET!'})


@app.route('/api/login', methods=['POST'])
def api_login():
    id_receive = request.form['id_give']
    password_receive = request.form['pw_give']
    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'email': id_receive, 'password': pw_hash})

    if result is not None:
       payload = {
         'id': id_receive,
         'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=100)
       }
       token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

       return jsonify({'result': 'success', 'token': token})

    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


@app.route('/api/feed', methods=["POST"])
def upload():
    images = request.files.getlist("image[]")
    desc = request.form['desc']
    location = request.form['location']
    time = datetime.datetime.utcnow()
    images_path = []

    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        for image in images:
            timestamp = datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
            path = './static/img/post_img/' + timestamp + secure_filename(image.filename)
            image.save(path)
            images_path.append(path)

        doc = {
            'email': payload['id'],
            'photo': images_path,
            'location': location,
            'post_date': time,
            'desc': desc
        }

        db.posts.insert_one(doc)

        return jsonify({'msg': '완료!'})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/feed', methods=['GET'])
def getFeed():
    # 피드 조회하기
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_id_receive = request.args.get('user_id_give')

        if user_id_receive == '':
            posts = list(db.posts.find({}).sort('post_date', -1).limit(20))

        else:
            posts = list(db.posts.find({'user_id': user_id_receive}).sort('post_date', -1).limit(20))

        for post in posts:
            post["_id"] = str(post["_id"])
            post["like_cnt"] = db.likes.count_documents({"post_id": post["_id"]})
            post["heart_by_me"] = bool(db.likes.find_one({"post_id": post["_id"], "email": payload["id"]}))
            post['user_id'] = db.users.find_one({'email': post['email']})['user_id']
            post['pic'] = db.users.find_one({'email': post['email']})['pic']
        print(post)

        return jsonify({'posts': posts, 'result': 'success'})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/api/comment', methods=['GET'])
def getComment():
    # 댓글 조회하기
    post_id = request.args['post_id_give']
    all_comments = list(db.comments.find({'post_id': post_id}))

    for comment in all_comments:
        comment["_id"] = str(comment["_id"])
        user_info = db.users.find_one({"email": comment['email']})
        comment['user_id'] = user_info['user_id']

    return jsonify({'comments': all_comments})

@app.route('/api/comment', methods=['POST'])
def postComment():
    # 댓글 작성하기
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        user_info = db.users.find_one({"email": payload["id"]})
        post_id_receive = request.form['post_id_give']
        comment_receive = request.form['comment_give']
        cmt_date_receive = request.form['cmt_date_give']

        doc = {'post_id': post_id_receive, 'email': user_info['email'], 'comment': comment_receive,
               'cmt_date': cmt_date_receive}
        db.comments.insert_one(doc)

        return jsonify({'msg': '댓글 작성 완료!'})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/api/like', methods=['POST'])
def updateLike():
  # 좋아요 업데이트
  token_receive = request.cookies.get('mytoken')
  try:
      payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
      user_info = db.users.find_one({'email': payload["id"]})
      post_id_receive = request.form['post_id_give']
      action_receive = request.form['action_give']

      doc = {'post_id': post_id_receive,
             'email': user_info['email']}

      if action_receive == "like":
        db.likes.insert_one(doc)
      else:
        db.likes.delete_one(doc)

      count = db.likes.count_documents({"post_id": post_id_receive})
      return jsonify({'result': 'success', 'msg': 'updated', 'count': count})

  except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
      return redirect(url_for("home"))


@app.route('/api/getModal', methods=['GET'])
def sendModalType():
    token_receive = request.cookies.get('mytoken')
    post_id_receive = request.args['post_id_give']
    post_info = db.posts.find_one({'_id': ObjectId(post_id_receive)})
    post_writer = post_info['email']
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        if post_writer == payload['id']:
            return jsonify({'type': 'writer'})
        else:
            return jsonify({'type': 'not writer'})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/api/loadModify', methods=['GET'])
def sendFeedInfo():
    post_id_receive = request.args['post_id_give']
    post_info = db.posts.find_one({'_id': ObjectId(post_id_receive)}, {'_id': False})
    post_info['user_id'] = db.users.find_one({'email': post_info['email']})['user_id']
    return jsonify({'post_info': post_info})


@app.route('/api/modifyFeed', methods=['POST'])
def modifyFeed():
    post_id_receive = request.form['post_id_give']
    desc_receive = request.form['desc_give']
    location_receive = request.form['location_give']

    db.posts.update_one({'_id': ObjectId(post_id_receive)},
                        {'$set': {'desc': desc_receive, 'location': location_receive}})

    return jsonify({'msg': '수정 완료!'})


@app.route('/api/deleteFeed', methods=['GET'])
def deleteFeed():
    post_id_receive = request.args['post_id_give']
    db.posts.delete_one({'_id': ObjectId(post_id_receive)})

    return jsonify({'msg': '삭제 완료!'})

@app.route('/api/userInfo', methods=['GET'])
def sendUserInfo():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({'email': payload['id']}, {'_id':False})
        return jsonify({'user_info': user_info})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))





# @app.route('/fileshow')
# def file_show():
#     token_receive = request.cookies.get('mytoken')
#     try:
#         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
#         img_info = db.users.find_one({"email": payload['id']})
#         return render_template('index.html', img_info=img_info)
#     except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
#         return redirect(url_for("home"))





@app.route('/user')
def user():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        email = payload['id']
        user_info = db.users.find_one({"email": email})

        feed_cnt = db.posts.count_documents({"email": email})
        follower_cnt = db.follow.count_documents({"t_email": email})
        following_cnt = db.follow.count_documents({"email": email})

        return render_template('profile.html', user_info=user_info, follower_cnt=follower_cnt,
                               following_cnt=following_cnt, feed_cnt=feed_cnt)

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return render_template('login_page.html')


@app.route('/follower', methods=['GET'])
def getFollower():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        follower_data = list(db.follow.find({"t_email": payload['id']}))

        follower_id = []

        for data in follower_data:
            user_info = db.users.find_one({"email": data['email']})
            data['user_id'] = user_info['user_id']
            follower_id.append(data['user_id'])

        return jsonify({'follower_id': follower_id})

        # follow_status = ''  # True:서로 팔로우 / False:상대만 날 팔로우>팔로우 버튼 노출

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route('/following', methods=['GET'])
def getFollowing():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        following_data = list(db.follow.find({"email": payload['id']}))
        following_id = []
        for data in following_data:
            user_info = db.users.find_one({"email": data['t_email']})
            data['user_id'] = user_info['user_id']
            following_id.append(data['user_id'])

        return jsonify({'following_id': following_id})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/api/follow', methods=['POST'])
def actionFollow():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        email = payload["id"]
        id_receive = request.form["id_give"]
        t_user_info = db.users.find_one({"user_id":id_receive})
        doc = {"email": email, "t_email": t_user_info['email']}
        db.follow.insert_one(doc)

        return jsonify({'msg': '완료!'})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/api/unfollow', methods=['POST'])
def actionUnFollow():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        email = payload["id"]
        id_receive = request.form["id_give"]
        t_user_info = db.users.find_one({"user_id": id_receive})
        doc = {"email": email, "t_email": t_user_info['email']}
        db.follow.delete_one(doc)

        return jsonify({'msg': '완료!'})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/api/deleteFollower', methods=['POST'])
def deleteFollower():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        t_email = payload["id"]
        email = db.users.find_one({'user_id': request.form['user_id_give']})['email']

        doc = {'email': email, 't_email': t_email}

        db.follow.delete_one(doc)

        return jsonify({'msg': '완료!'})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)
    # host 등을 직접 지정하고 싶다면
    # app.run(host="0.0.0.0", port="5000", debug=True)



# @app.route('/')
# def home():
#     token_receive = request.cookies.get('mytoken')
#     print(token_receive)
#     try:
#         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
#         user_info = db.users.find_one({"email": payload['id']})
#         return render_template('index.html', user_info=user_info)
#     except jwt.ExpiredSignatureError:
#         return render_template('login_page.html')
#     except jwt.exceptions.DecodeError:
#         return render_template('login_page.html')
#
#
#
#
# #
# @app.route('/fileshow')
# def file_show():
#     token_receive = request.cookies.get('mytoken')
#     try:
#         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
#         img_info = db.users.find_one({"email": payload['id']})
#         return render_template('index.html', img_info=img_info)
#     except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
#         return redirect(url_for("home"))

# if __name__ == '__main__':
#     app.run('0.0.0.0', port=5001, debug=True)


# html code
# <img src="/static/{{ img_info.img }}">