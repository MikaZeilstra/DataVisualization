import json
import ast
import requests
from time import sleep

with open("Games.json","r") as file:
	Games = ast.literal_eval(file.read());


print("0/" + str(len(Games)),end='')
for ind,game in enumerate(Games.keys()):
	url = "https://steamspy.com/api.php?request=appdetails&appid=" + str(Games[game]["appid"])
	tries = 0
	while tries < 5:
		try:
			sleep(1)
			req = requests.get(url)
			reqJson = req.json()
			break
		except:
			tries += 1
	if tries != 5:
		Games[game]["tags"] = reqJson["genre"].split(", ") if reqJson["genre"] != None else ""
		Games[game]["positive_reviews"] = reqJson["positive"]
		Games[game]["negative_reviews"] = reqJson["negative"]
		Games[game]["initial_price"] = reqJson["initialprice"]
		Games[game]["price"] = reqJson["price"]
	else:
		print("could not get info for game : " + game)
	print("\r" + str(ind+1) + "/" + str(len(Games)), end='')


GameGenreJson = json.dumps(Games)

with open("GamesGenre.json", "w") as text_file:
    print(GameGenreJson, file=text_file)