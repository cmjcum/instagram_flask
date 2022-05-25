# 2022.05.03~11 | 인스타그램 클론 코딩
`Team.Codeing or Die`가 인스타그램을 Flask를 이용하여 기능까지 클론하는 프로젝트

  * [What to do](#what-to-do)
    + [필수 기능](#필수기능)
    + [추가 기능](#선택기능)
  * [진행](#진행)
    + [역할분담](#역할분담)
    + [목업](#목업)
    + [설계](#설계)
      - [기능](#기능)
      - [DB](#db)

***

## What to do
인스타그램을 flask로 구현하기
- 기술 선택은 웹 프로그래밍 A-Z 기초에서 배운 내용(HTML, JavaScript, Ajax, Python, Flask, MongoDB...) 내에서 할 것
- DB 연동하는 기능은 기본 CRUD를 모두 포함해야 함
### 필수 기능
`역할 분담해서 하나의 기능 이상 구현할 것`
- [x] 회원가입, 로그인, 로그아웃 기능 (JWT 사용)
- [x] 마이페이지 게시물 , 게시물 활동
- [x] 피드관련 사진 업로드 기능, 댓글, 좋아요, 더보기 모달 기능
- [x] Follower / Following 기능
### 추가 기능
`추가 기능은 구현하지 못함`
- [ ] 프로필 편집 기능
- [ ] 북마크 기능
- [ ] 게시글 과 Feed 부분 화면 스크롤 끝까지 내렸을때 추가 피드 불러오는 페이지네이션 기능
- [ ] DM기능
- [ ] 검색(해시태그, user)

***

## 진행
### 역할분담
`Team.Codeing or Die` 팀원들이 페이지 단위로 나누어 프론트엔드와 백엔드를 동시에 진행함
- 김동근
  - 로그인/회원가입 페이지
- 노을
  - 프로필 페이지, Follower / Following 기능
- 이정아
  - 피드관련 사진 업로드 기능, 모달 기능
- 이현경
  - 피드 관련 조회, 좋아요 기능
![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbPPMoy%2FbtrC3EmfszC%2FQZAUIxdGRK8GCzMs3JDKCk%2Fimg.png)

### 목업
![목업](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbTjZw1%2FbtrA7OLnBNv%2FBFUTh69XGCpj59RbVifmXk%2Fimg.png)

### 설계
#### 기능
![설계](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbLoa3V%2FbtrC6HJtJGC%2FqqBdl1SfpyhdigkX5nonwk%2Fimg.png)
![설계](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FpvGJG%2FbtrA9ikSk9x%2FTxYGrEknL0FIhQeFubYBFK%2Fimg.png)

#### DB
![ERD](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcadNX0%2FbtrC7MDkin8%2FncVIkeB7UKT1IvKTbujyC1%2Fimg.png)
