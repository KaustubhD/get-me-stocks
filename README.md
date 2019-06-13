Stock price tracker
------
On the front-end,
- edit `public/client.js`, `public/style.css` and `views/index.html`
- drag in `assets`, like images or music, to add them to your project

On the back-end,
- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)


Example requests
-------------------
* /api/stock-prices?stock=goog
* /api/stock-prices?stock=goog&like=true
* /api/stock-prices?stock=goog&stock=msft
* /api/stock-prices?stock=goog&stock=msft&like=true


Example responses
-------------------
* `{"stockData":{"stock":"GOOG","price":"786.90","likes":1}}`
* `{"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]}`


Objectives
-------------------
- [x] Set the content security policies to only allow loading of scripts and css from your server.
- [x] I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object stockData.
- [x] In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).
- [x] I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
- [x] If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display rel_likes(the difference between the likes on both) on both.
- [x] All 5 functional tests are complete and passing.

Testing
-------------------
For testing, the ```NODE_ENV``` variable needs to be set to testin the **.env** file


Live Project
-------------------
[\ ゜o゜)ノ](https://get-me-stocks.glitch.me)