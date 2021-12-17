# Steam Visualizer
This project was made for the InfoVis project from IN4089 Data visualization. We were tasked to pick a dataset and apply Munzners 4-level Analysis on it to generate usefull visualizations. to achieve this we first needed to gather the dataset and then develop the visualizations in a webpage format.

The report for this project is the InfoVis.pdf file included in the repository, and the website is hosted at https://mikazeilstra.github.io/DataVisualization/.

# Data gathering
The data was gathered using pythonscripts which are available in the root of the repository as well as any intermediate json files not directly necessary for the visualization. The GetUserGames script requires a SteamApi key which is available to anyone who has a steam account with more than $5 worth of games, and is available at https://steamcommunity.com/dev/apikey.

The order in which the script need to be executed to gather a new dataset is steamapi.py -> getUserGames.py -> getUSersPerGame.py -> GetGameGenres.py and getDescriptionGames.py -> GetGameGenres.py and GetRatingData.py -> GetGenreData.py

# Website
The website is located in the docs folder this is in this way to allow a seperation of the python files and website and docs is the only subfolder github pages can host. This folder contains the data 4 json files and 1 CSV file and the website in the index.html which has two supporting files style.css and polyfill.css containing the general styling and styling for the searchbar functionality and the graphs.js containing the functions to initialize graphs and return update functions.