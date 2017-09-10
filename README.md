# Jungle.GG


Currently in development; more info to come! 

See the temporary website [here](http://jungle-gg.herokuapp.com).

## Running your own version of Jungle.GG
If you'd like to run your own version of Jungle.GG, follow these steps:

1. You need a MongoDB server hosted either locally with your web server or online. I recommend [mLab](https://mlab.com/) if you want a free/online database.
2. You will also need an API key from the Riot Games API. You can click [here](https://developer.riotgames.com/) for more information.
3. Ensure that you have node/npm installed on your machine.
4. Clone this git repository. 
5. Create a file called `config.js` in the root directory of the cloned repository. Add the following lines of code to this file.
```javascript
module.exports = {
MONGO_LINK: <YourMongoURI>,
RIOT_API_KEY: <RiotApiKey>    
}
```
where `<YourMongoURI>` should be of the form `"mongodb://<dbuser>:<dbpassword>@<serveraddress>/<databasename>"` and `<RiotApiKey>` should be of the form `"RGAPI-xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`.

6. Navigate to the root directory of the repository in your terminal and run: `npm install`. Do the same in the `client` directory. This will install all the dependencies for this node application.
7. Return to the root directory and run `npm run dev`. This will start running the server. If hosting locally, you can view the site at [http://localhost:5000](http://localhost:5000).
8. (Optional) If you want to gather win rates you must scrape the game data yourself. You can do so by navigating to the `scraper` directory and running the `scraper.js` file. You may need to adjust the `delay` variable in this file depending on your Riot API Key's rate limit. 
