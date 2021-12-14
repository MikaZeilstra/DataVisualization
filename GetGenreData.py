import json
import ast

with open("GamesGenre.json","r") as file:
	Games = json.load(file)

GenreData = {}

for game in Games:
	for tag in Games[game]["tags"]:
		if tag not in GenreData:
			GenreData[tag] = {}
			GenreData[tag]["genre"] = tag
			GenreData[tag]["user_count"] = [0] * 12
			for ind,group in enumerate(Games[game]["user_count"]):
				GenreData[tag]["user_count"][ind] = group
			GenreData[tag]["user_minutes"] = [0] * 12
			for ind,group in enumerate(Games[game]["user_minutes"]):
				GenreData[tag]["user_minutes"][ind] = group
			GenreData[tag]["user_played"] = [0] * 12
			for ind,group in enumerate(Games[game]["user_played"]):
				GenreData[tag]["user_played"][ind] = group
			GenreData[tag]["game_count"] = 1
			GenreData[tag]["initial_price_total"] = int(Games[game]["initial_price"])
			GenreData[tag]["price_total"] = int(Games[game]["price"])
			GenreData[tag]["positive_total"] = Games[game]["positive_reviews"]
			GenreData[tag]["negative_total"] = Games[game]["negative_reviews"]
		else:
			for ind, group in enumerate(Games[game]["user_count"]):
				GenreData[tag]["user_count"][ind] += group
			for ind,group in enumerate(Games[game]["user_minutes"]):
				GenreData[tag]["user_minutes"][ind] += group
			for ind,group in enumerate(Games[game]["user_played"]):
				GenreData[tag]["user_played"][ind] += group
			GenreData[tag]["game_count"] += 1
			GenreData[tag]["initial_price_total"] += int(Games[game]["initial_price"] if Games[game]["initial_price"] != None else 0)
			GenreData[tag]["price_total"] += int(Games[game]["price"] if Games[game]["price"] != None else 0)
			GenreData[tag]["positive_total"] += Games[game]["positive_reviews"]
			GenreData[tag]["negative_total"] += Games[game]["negative_reviews"]

genreDataJson = json.dumps(GenreData)

with open("GenreData.json", "w") as text_file:
    print(genreDataJson, file=text_file)