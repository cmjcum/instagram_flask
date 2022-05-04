from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.gsb7w.mongodb.net/Cluster0?retryWrites=true&w=majority')
db = client.instaClone


#Flask 객체 인스턴스 생성
app = Flask(__name__)

@app.route('/') # 접속하는 url
def index():
  return render_template('index.html')


@app.route('/api/comment', methods=['POST'])
def postComment():
  # 댓글 작성하기
  user_id_info = db.users.find_one({"username": payload["id"]})
  post_id_receive = request.form['post_id_give']
  comment_receive = request.form['comment_give']
  cmt_date_receive = request.form['cmt_date_give']

  doc = {'post_id': post_id_receive, 'user_id': user_id_info, 'comment': comment_receive, 'cmt_date': cmt_date_receive}
  db.comment.insert_one(doc)

  return jsonify({'msg': '댓글 작성 완료!'})


@app.route('/api/comment', methods=['GET'])
def getComment():
  # 댓글 조회하기
  all_comments = list(db.comment.find({}, {'_id': False}))
  return jsonify({'orders': all_comments})


if __name__=="__main__":
  app.run(debug=True)
  # host 등을 직접 지정하고 싶다면
  # app.run(host="127.0.0.1", port="5000", debug=True)