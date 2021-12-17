import requests
import json
import ast
from time import sleep

with open("UserIDs.json","r") as file:
	userIds = ast.literal_eval(file.read())
UserOwnedGames = {}

key = "key=INSERTSTEAMAPIKEYHERE"
user = "76561198062363193"

non_public = []

for group in userIds.keys():
	print("")
	print('Group : ' + group + " 0/"  + str(len(userIds[group]))  , end='')
	UserOwnedGames[group] = []
	for user in range(len(userIds[group])):
		url = 'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?' + key + "&steamid=" + userIds[group][user] + "&format=json"
		tries = 0
		reqfailed = False
		while tries < 5:
			sleep(0.1)
			try:
				req = requests.get(url)
				tries = 10
			except:
				tries += 1
				print(("\n" if tries == 1 else "\r") + "Connerror retrying " + str(tries) + " try stopping at try 5 Group : "+ group + " User : "+ str(user))

		if(tries != 10):
			reqfailed = True
		if not(reqfailed):
			jsonres = req.json()
			if(req.status_code != requests.codes.ok):
				print("\n Status code " + str(req.status_code) + "For " + group + " User : " + user)
			if (jsonres["response"] != {}):
				jsonres["response"]["user"] = userIds[group][user]
				UserOwnedGames[group].append(jsonres["response"])
			else:
				non_public.append(user)

		print('"\rGroup : ' + group + " " + str(user + 1) + "/" + str(len(userIds[group])), end='')

userGamesJson = json.dumps(UserOwnedGames)
print(list(map(len, UserOwnedGames.values())))

with open("UserOwnedGames.json", "w") as text_file:
    print(userGamesJson, file=text_file)