import json
import numpy as np
from pprint import pprint
import pandas as pd

with open("GamesGenre.json","r") as file:
	Games = json.load(file)

RatingData = []

for game in Games:
    for tag in Games[game]["tags"]:
        if(len(tag) > 0):
            totalreviews = int(Games[game]["positive_reviews"] + Games[game]["negative_reviews"])
            price = int(Games[game]["initial_price"])/100 
            if(price >= 80):
                roundedprice = 80
            else:
                roundedprice = 5 * round(price/5) # rounded to 5 to create "discrete" categories
            if(totalreviews > 0 and len(game) > 0 and len(tag) > 0):
                pos_reviews_percent = int(Games[game]["positive_reviews"]/totalreviews*100) # calculating % of positive reviews
                RatingData.append([tag, pos_reviews_percent, roundedprice])
            

df = pd.DataFrame(RatingData, columns =['genre', 'pos_reviews', 'price']) #cloning the 2d array into a dataframe
df['pos_reviews'] = pd.to_numeric(df['pos_reviews']) #positive reviews to numerical
df2 = df.groupby(['genre', 'price'], as_index=False)['pos_reviews'].mean() # rows which have identical price and genre are grouped and their review score is averaged out
df2['pos_reviews'] = df2['pos_reviews'].round(2) # rounding up to 2 decimal places
df2 = df2.sort_values(by=['price']) # sorting ascending by price

df2.to_csv('RatingData.csv', index=False) #exporting to csv

pprint(df2)
