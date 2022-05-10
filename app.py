from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import jwt
import hashlib
import datetime



#Flask 객체 인스턴스 생성
app = Flask(__name__)


@app.route('/') # 접속하는 url
def index():
  return render_template('index.html')


@app.route('/feed', methods=['GET'])
def getFeed():
  # 피드 조회하기
  posts = list(db.posts.find({}).sort('post_date', -1).limit(20))

  for post in posts:
    post["_id"] = str(post["_id"])

  return jsonify({'posts': posts, 'result': 'success'})


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
  # user_info = db.users.find_one({"email": 'LULULALA_2@insta.com'})
  post_id_receive = request.form['post_id_give']
  comment_receive = request.form['comment_give']
  cmt_date_receive = request.form['cmt_date_give']

  doc = {'post_id': post_id_receive, 'email': 'LULULALA_2@insta.com', 'comment': comment_receive, 'cmt_date': cmt_date_receive}
  db.comments.insert_one(doc)

  return jsonify({'msg': '댓글 작성 완료!'})


# @app.route('/api/like', methods=['POST'])
# def updateLike():
#   # 좋아요 업데이트
#
#   user_info = db.users.find_one({'email': 'LULUALA_2@insta.com'})
#   post_id_receive = request.form['post_id_give']
#   action_receive = request.form['action_give']
#
#   doc = {'post_id': post_id_receive,
#          'user_id': user_info['user_id']}
#
#   if action_receive == "like":
#     db.likes.insert_one(doc)
#   else:
#     db.likes.delete_one(doc)
#
#   count = db.likes.count_documents({"post_id": post_id_receive})
#   return jsonify({'result': 'success', 'msg': 'updated', 'count':count})


if __name__=="__main__":
  app.run(debug=True)
  # host 등을 직접 지정하고 싶다면
  # app.run(host="127.0.0.1", port="5000", debug=True)