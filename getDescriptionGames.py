import ast
# standard library imports
import csv
import datetime as dt
import json
import os
import statistics
import time

# third-party imports
import numpy as np
import pandas as pd
import requests

# customisations - ensure tables show all columns
pd.set_option("max_columns", 100)


def get_request(url, parameters=None):
    """Return json-formatted response of a get request using optional parameters.
    
    Parameters
    ----------
    url : string
    parameters : {'parameter': 'value'}
        parameters to pass as part of get request
    
    Returns
    -------
    json_data
        json-formatted response (dict-like)
    """
    try:
        response = requests.get(url=url, params=parameters)
    except SSLError as s:
        print('SSL Error:', s)
        
        for i in range(5, 0, -1):
            print('\rWaiting... ({})'.format(i), end='')
            time.sleep(1)
        print('\rRetrying.' + ' '*10)
        
        # recusively try again
        return get_request(url, parameters)
    
    if response:
        return response.json()
    else:
        # response is none usually means too many requests. Wait and try again 
        print('No response, waiting 10 seconds...')
        time.sleep(20)
        print('Retrying.')
        return get_request(url, parameters)


with open("Games.json","r") as file:
	Games = ast.literal_eval(file.read())


def parse_steam_request(appid, name):
    """Unique parser to handle data from Steam Store API.
    
    Returns : json formatted data (dict-like)
    """
    url = "http://store.steampowered.com/api/appdetails/l=english&"
    parameters = {"appids": appid}
    
    json_data = get_request(url, parameters=parameters)
    json_app_data = json_data[str(appid)]
    
    if json_app_data['success']:
        data = json_app_data['data']["short_description"]
    else:
        data = {'app_id': name, 'steam_appid': appid}
        
    return data

data = {}
for ind,game in enumerate(Games.keys()):
    if ind % 100 == 0:
        print(ind)
    data[Games[game]["appid"]] = parse_steam_request(Games[game]["appid"], "OK")


with open("GamesDescriptions.json", "w") as text_file:
    print(data, file=text_file)


