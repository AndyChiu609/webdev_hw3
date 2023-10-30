# Web Programming HW#3

## Run the app (後面有說明進階條件實作內容)

Follow the instructions in this section to run the app locally.

### 1. setup  `.env` (Note that it's .env not .env.local)

Start by creating the `.env` file in the backend folder, then fill the `POSTGRES_URL` with ur Postgresql URL, for this project I used Railway db, which is very easy do setup and access, theoraticly my setup should work with all postgresql but no gurenty, so I'll leave the link to the PostgresDB tutorial that teacher provided in the slide, follow the instruction for Railway if needed, don't 扣分 me pls.

https://ric2k1.notion.site/Free-postgresql-tutorial-f99605d5c5104acc99b9edf9ab649199


```bash
// example .env
// dont try it, its an expired link and will not work


POSTGRES_URL=postgres://postgres:*bdEE1b3B163bEf1-66DEA1GeF*aD*gf@monorail.proxy.rlwy.net:33472/railway
```

### 2. setup node_modules

Doing this should install all the neccesary dependencies I think.

```bash
yarn install
```

### 3. Migrate the schema to DB

Doing this should bring the schema to the DB.

```bash
yarn migrate
```

### 4. Run the website(Note that it may take ten or more seconds to load the page, pls switch back to the ide from time to time if that happens, the website will load in I swear.)

Run it and go check out the website, note that it takes time for it to load and actions may take time to proccess, so be patient, and pls don't 扣分 me, I tested it quite a few times.

```bash
yarn dev
```



## 基本功能實作內容說明(不包含進階功能)，若網站有使用疑慮請看這裡

首頁功能包含新增按鈕以及切換使用者按鈕，以及搜尋文字區，無須點擊搜尋，打字上去就會自動搜尋了，新增活動後，點擊活動即可進入活動分頁。

活動分頁包含參加&退出活動&留言輸入區，切記，留言輸入後按下enter即可輸入留言，按下enter是在老師的作業說明中規定的，請特別注意，並且只有當該使用者是參加狀態時才能留言，可以參加退出試試看，並且留言的排序也是同作業說明，由舊到新上到下排列


## Lint檢查說明

 
```bash
yarn lint
```


