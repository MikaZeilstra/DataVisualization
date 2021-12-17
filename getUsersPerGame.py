import json
import ast

with open("UserOwnedGames.json","r") as file:
	UserOwnedGames = ast.literal_eval(file.read())


#print(UserOwnedGames)
Games = {}

for gInd,group in enumerate(UserOwnedGames.keys()):
	#print(len(UserOwnedGames[group]))
	for uInd,user in enumerate(UserOwnedGames[group]):
		if "total_count" in user and "games" in user:
			try:
				if user["total_count"] > 0:
					for game in user["games"]:
						if game["name"] not in Games:
							#print(game)
							game["user_count"] = [0] * 12
							game["user_count"][gInd] += 1
							game["user_minutes"] = [0] * 12
							game["user_minutes"][gInd] += game["playtime_forever"]
							game["user_played"] = [0] * 12
							game["user_played"][gInd] += 1 if game["playtime_forever"] > 0 else 0
							del game["playtime_2weeks"]
							del game["playtime_forever"]
							del game["playtime_windows_forever"]
							del game["playtime_mac_forever"]
							del game["playtime_linux_forever"]
							Games[game["name"]] = game
						else :
							Games[game["name"]]["user_count"][gInd] += 1
							Games[game["name"]]["user_minutes"][gInd] += game["playtime_forever"]
							Games[game["name"]]["user_played"][gInd] += 1 if game["playtime_forever"] > 0 else 0
			except:
				print(game)
print(len(Games.keys()))

GameJson = json.dumps(Games)

with open("Games.json", "w") as text_file:
    print(GameJson, file=text_file)