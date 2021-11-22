import requests
import json

from lxml import etree
from collections import defaultdict


Steam_groups = [{
    "Name" : "US",
    "Group_ID": "103582791453709703",
    "Members": []
},
{
    "Name": "DE",
    "Group_ID": "103582791430396700",
    "Members": []
},
{
    "Name": "NL",
    "Group_ID": "103582791429524490",
    "Members": []
},
{
    "Name": "FR",
    "Group_ID": "103582791433685117",
    "Members": []
},
{
    "Name": "UK",
    "Group_ID": "103582791429829491",
    "Members": []
},
{
    "Name": "BR",
    "Group_ID": "103582791429970582",
    "Members": []
},
{
    "Name": "PO",
    "Group_ID": "103582791429526392",
    "Members": []
},
{
    "Name": "RU",
    "Group_ID": "103582791429551180",
    "Members": []
},
{
    "Name": "IT",
    "Group_ID": "103582791435681262",
    "Members": []
},
{
    "Name": "AU",
    "Group_ID": "103582791429529819",
    "Members": []
},
{
    "Name": "SK",
    "Group_ID": "103582791430868052",
    "Members": []
},
{
    "Name": "SA",
    "Group_ID": "103582791429568891",
    "Members": []
}
]

Users= {}
for group in Steam_groups:
	url = 'https://steamcommunity.com/gid/'+ group["Group_ID"]+'/memberslistxml/?xml=1'
	req = requests.get(url)
	doc = etree.XML(req.text.encode())
	users = doc.xpath('//steamID64/text()')
	Users[group["Name"]] = users

users = json.dumps(Users)

with open("UserIDs.json", "w") as text_file:
    print(Users, file=text_file)