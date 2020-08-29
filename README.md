# 家庭記帳本
使用者可以新增、刪除、過濾及查看支出和收入的紀錄資訊，是管理財務的好幫手

+ 測試帳戶

|姓名|信箱|帳號|
|----|---|----|
|Cindy|cindy@gmail.com|123456|
|Jessie|jessie@gmail.com|123456|

![image](https://github.com/Rubyrubylai/expense-tracker-sequelize/blob/master/expense-tracker.PNG)

## 環境
+ Node.js v10.15.0

## 安裝
1. 開啟終端機，cd到存放專案位置並執行:
```
git clone https://github.com/Rubyrubylai/expense-tracker.git
```

2. 在 https://developers.facebook.com/ 上創建一個專案

3. 在expense-tracker資料夾中安裝套件
```
cd expense-tracker
npm install
```

4. 在專案的根目錄新增.env檔，將API Key存入
```
FACEBOOK_ID=<YOUR_FACEBOOK_APP_ID>
FACEBOOK_SECRET=<YOUR_FACEBOOK_APP_SECRET>
FACEBOOK_CALLBACK=<YOUR_FACEBOOK_REDIRECT_URI>
SECRET_KEY =<YOUR_SECRET_KEY>
MONGODB_URI = mongodb://localhost/expenseTracker
PORT = 3000
```

5. 新增使用者和餐廳的種子資料
```
cd models/seeds
node Seeder.js
```

6. 執行專案
```
cd ../../
npm run dev
```

7. 在本機端 http://localhost:3000 開啟網址

## 功能列表
+ 網站功能

|功能|URL|描述|
|----|---|----|
|首頁|/|查看當天的收入及支出，並從月份及類別選單篩選要查看的資料|
|新增|/records/new|點選右下角的加號，新增收入或支出|
|編輯|/records/:id/edit|點選編輯按鈕，編輯收入或支出的名稱、日期、商家、類別及金額|

+ 使用者功能

|功能|URL|描述|
|----|---|----|
|登入|/users/login|使用者登入|
|登入|/auth/facebook|FB使用者登入|
|登出|/users/logout|登入後即可藉由右上角的登出按鈕登出|
|註冊|/users/register|填寫姓名、帳號及密碼註冊帳戶|