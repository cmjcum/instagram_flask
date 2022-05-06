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
  posts = list(db.posts.find({}).sort("post_date", -1).limit(20))

  for post in posts:
    post["_id"] = str(post["_id"])
    post["post_date"] = str(post["post_date"])

  return jsonify({'posts': posts, 'result':'success'})


# @app.route('/api/comment', methods=['POST'])
# def postComment():
#   # 댓글 작성하기
#   user_info = db.users.find_one({"email": payload["id"]}) # payload에 들어있는 email값을 이용해 user_info를 찾아와라
#   post_id_receive = request.form['post_id_give']
#   comment_receive = request.form['comment_give']
#   cmt_date_receive = request.form['cmt_date_give']
#
#   doc = {'post_id': post_id_receive, 'user_id': user_info['email'], 'comment': comment_receive, 'cmt_date': cmt_date_receive}
#   db.comments.insert_one(doc)
#
#   return jsonify({'msg': '댓글 작성 완료!'})
#
#
# @app.route('/api/comment', methods=['GET'])
# def getComment():
#   # 댓글 조회하기
#   all_comments = list(db.comments.find({}).sort("date", -1))
#
#   for comment in all_comments:
#     comment["_id"] = str(comment["_id"])
#
#   return jsonify({'comments': all_comments})



# @app.route('/api/like', methods=['POST'])
# def updageLike():
#   # 좋아요 업데이트



if __name__=="__main__":
  app.run(debug=True)
  # host 등을 직접 지정하고 싶다면
  # app.run(host="127.0.0.1", port="5000", debug=True)