# Jungle.ninja

**Jungle.ninja** is a League of Legends online tool that allows users to create and share item builds and jungle routes with each other! Created item sets and jungle routes for specific junglers are displayed on a jungler's feed where users can vote to determine which ones are the best.

![](https://media.giphy.com/media/l378xcoaUcDhTk3ao/giphy.gif)

Create a new item set to share with your friends!

![](https://media.giphy.com/media/3ohhwuV4zOWh7nFtJu/giphy.gif)

Or share a jungle route using the route builder!

![](https://media.giphy.com/media/l1J9FSCoWdbGTTbcQ/giphy.gif)

The website is also mobile-friendly: view it on your phone!

![](https://media.giphy.com/media/3o7aCX610Xs6GjIXBe/giphy.gif)

See the website live [here](http://www.jungle.ninja).

## Running your own version of Jungle.ninja
If you'd like to run your own version of Jungle.ninja, follow these steps:

1. You need a MongoDB server hosted either locally with your web server or online. I recommend [mLab](https://mlab.com/) if you want a free/online database.
2. You will also need an API key from the Riot Games API. You can click [here](https://developer.riotgames.com/) for more information.
3. Ensure that you have node/npm installed on your machine.
4. Clone this git repository. 
5. Create a file called `config.js` in the root directory of the cloned repository. Add the following lines of code to this file where `<YourMongoURI>` should be of the form `"mongodb://<dbuser>:<dbpassword>@<serveraddress>/<databasename>"`, `<RiotApiKey>` should be of the form `"RGAPI-xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`, and `<CurrentPatch>` should be the current League of Legends patch version (At the time of writing, it is `"7.19"`).
```javascript
module.exports = {
    MONGO_LINK: <YourMongoURI>,
    RIOT_API_KEY: <RiotApiKey>,
    CURRENT_PATCH: <CurrentPatch>   
}
```

6. Navigate to the root directory of the repository in your terminal and run: `npm install`. Do the same in the `client` directory. This will install all the dependencies for this node application.
7. Return to the root directory and run `npm run dev`. This will start running the server. If hosting locally, you can view the site at [http://localhost:5000](http://localhost:5000).
8. (Optional) If you want to gather win rates you must scrape the game data yourself. You can do so by navigating to the `scraper` directory and running the `scrapeGame.js` file. You may need to adjust the `delay` variable in this file depending on your Riot API Key's rate limit. 
