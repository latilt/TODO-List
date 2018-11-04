# TODO-List
## 설치방법
터미널을 열고 깃을 복사해줍니다.
```
git clone https://github.com/latilt/TODO-List.git
```
복사된 폴더로 이동합니다.
```
cd TODO-List
```
서버 모듈들을 설치합니다.
```
npm install
```
클라이언트 모듈들을 설치합니다.
```
cd client
npm install
```
서버 폴더로 이동합니다.
```
cd ..
cd server
```
DB 연결을 위한 config폴더와 config.js 파일을 생성합니다.
```
mkdir config
cd config
vi config.js
```
config.js 파일을 작성합니다.
MySql 설정에 따라 필요한 정보들을 입력합니다.
```javascript
let env = process.env.NODE_ENV || 'development';
const config = {
    development: {
        db: 'mysql://username:password@hostname:port/database'
    },
    production: {
        db: 'mysql://username:password@hostname:port/database'
    }
};
module.exports = config[env];
```
설치가 완료되었습니다.
## 명령어
```javascript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start:linux": "NODE_ENV=production node ./server/index.js",
    "start:window": "set NODE_ENV=production&&node ./server/index.js",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "nodemon ./server/index.js",
    "dev:client": "npm --prefix ./client run start",
    "build": "npm --prefix ./client run build",
    "server:window": "set NODE_ENV=development&&nodemon ./server/index.js",
    "server:linux": "NODE_ENV=development nodemon ./server/index.js"
  }
```
### 개발 환경 구동
최상위 폴더에서 명령어를 실행합니다.
```
npm run dev
```
react 개발 서버(http://localhost:3000)와 express 서버(http://localhost:4000)가 구동됩니다.
### 빌드 환경 구동
최상위 폴더에서 명령어를 실행합니다.
먼저 react로 개발된 클라이언트를 빌드합니다.
```
npm run build
```
os 환경에 따라 명령어를 실행합니다.
```
npm run start:linux
or
npm run start:window
```
express 서버(http://localhost:4000)가 구동됩니다.
## 개발 도구
```
create-react-app
Nodejs - 8.11.2
Npm - 5.6.0
MySql - 8.0.13
```