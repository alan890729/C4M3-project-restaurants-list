# 美食口袋清單

把喜愛的美食收藏在口袋清單吧！

## 專案畫面

![image](https://github.com/alan890729/C4M2-project-restaurants-list/blob/main/public/images/read-all-restaurants.png)
![image](https://github.com/alan890729/C4M2-project-restaurants-list/blob/main/public/images/read-detail-restaurants.png)
![image](https://github.com/alan890729/C4M2-project-restaurants-list/blob/main/public/images/search-restaurant-ci.png)
![image](https://github.com/alan890729/C4M2-project-restaurants-list/blob/main/public/images/search-restaurant-category.png)
![image](https://github.com/alan890729/C4M2-project-restaurants-list/blob/main/public/images/create-restaurant.png)
![image](https://github.com/alan890729/C4M2-project-restaurants-list/blob/main/public/images/edit-restaurant.png)

## Features - 產品功能

1. 使用者可以瀏覽全部的餐廳
2. 使用者可以點擊某餐廳瀏覽該餐廳的細節資訊
3. 使用者可以依照店名進行搜尋
4. 使用者可以依照餐廳類別進行搜尋
5. 使用者可以新增餐廳到清單
6. 使用者可以編輯清單中的餐廳
7. 使用者可以刪除清單中的餐廳
8. 使用者可以在瀏覽全部的餐廳頁面，排序餐廳的顯示順序

## Getting Started - 啟動專案

以下為**Getting Started - 啟動專案**的各段落的摘要：
1. **Prerequisites - 環境建置與需求**：使用什麼框架、模組，以及各種工具的版本。
2. **Installing - 專案安裝流程**：如何從github下載這個專案，並在自己的本地環境啟動此專案。


### Prerequisites - 環境建置與需求
- Node.js(RTE) - v20.14.0
- MySQL - v8.0.16
- [Express.js - v4.19.2](https://expressjs.com)
- [Nodemon - v3.1.4](https://www.npmjs.com/package/nodemon)
- [Bootstrap - v5.2.1](https://www.jsdelivr.com/package/npm/bootstrap?tab=files&version=5.2.1&path=dist)
- [font-awesome - v5.8.1](https://cdnjs.com/libraries/font-awesome/5.8.1)
- [Express-handlebars - v7.1.3](https://www.npmjs.com/package/express-handlebars)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [sequelize](https://www.npmjs.com/package/sequelize)
- [sequelize-cli](https://www.npmjs.com/package/sequelize-cli)
- [method-override](https://www.npmjs.com/package/method-override)
- [express-session](https://www.npmjs.com/package/express-session)
- [connect-flash](https://www.npmjs.com/package/connect-flash)
- [dotenv](https://www.npmjs.com/package/dotenv)

### Installing - 專案安裝流程

1. 打開terminal，輸入
    ```
    git clone https://github.com/alan890729/C4M2-project-restaurants-list.git
    ```

2. 開啟終端機(Terminal)，進入存放此專案的資料夾
    ```
    cd C4M2-project-restaurants-list
    ```

3. 安裝 npm 套件
    ```
    npm install
    ```

4. 在MySQL WorkBench建立一個名為restaurants-list的資料庫

    以下提供兩個方案，一是資料庫中沒有存在與restaurants-list同名的資料庫，二是資料庫已存在restaurants-list資料庫，所以建立另一個資料庫，用途是來執行此專案

    - 資料庫沒有與restaurants-list同名的資料庫

      打開MySQL WorkBench，輸入以下指令建立資料庫：
      ```
      CREATE DATABASE `restaurants-list`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
      ```

      進到./config/config.json把"development"之下的"username", "password"的值改成你自己MySQL WorkBench使用的username和password

    - 資料庫有與restaurants-list同名的資料庫，所以另外建立一個執行此專案用的資料庫

      打開MySQL WorkBench，輸入以下指令建立資料庫：
      ```
      CREATE DATABASE `test-database`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
      ```

      進到./config/config.json把"development"之下的"username", "password"的值改成你自己MySQL WorkBench使用的username和password，"database"的值則改成"test-database"

6. 執行db migrate和db seed

    資料庫建立好後，打開終端機並移動到此專案目錄之下，輸入以下指令：
    ```
    npx sequelize db:migrate
    ```
    上面指令完成後接著輸入以下指令：
    ```
    npx sequelize db:seed:all
    ```

5. 是否已經安裝nodemon
  
    - 已有nodemon，直接輸入以下指令啟動專案
        ```
        npm run dev
        ```
        server會在 <http://localhost:3000> 執行

    - 還沒有安裝nodemon，先退回前一個路徑，在global安裝nodemon。輸入：
        ```
        npm install -g nodemon
        ```

       接著再回到 **C4M2-project-restaurants-list** 資料夾內，輸入：
       ```
       npm run dev
       ```

## Authors

  - [**Alpha Camp**](https://tw.alphacamp.co/) - provide project template.
  - [**Alan Huang**](https://github.com/alan890729) - build this project with express.js based on provided project template.

