import json
import numpy as np
from pprint import pprint
import pandas as pd

with open("GamesGenre.json","r") as file:
	Games = json.load(file)

RatingData = []
NAData = []
GenreList = [] 
pricepoints = [0,5,10,15,20,25,30,35,40,45,50] #init price points

for game in Games:
    for tag in Games[game]["tags"]:
        if(len(tag) > 0):
            if (tag not in GenreList): GenreList.append(tag) #populate genre list with genres in GamesGenre.json
            totalreviews = int(Games[game]["positive_reviews"] + Games[game]["negative_reviews"])
            price = int(Games[game]["initial_price"])/100 #price in standardised format
            if(price >= 50): #treat games which cost 50 or more the same
                roundedprice = 50
            else:
                roundedprice = 5 * round(price/5) # rounded to 5 to create "discrete" categories
            if(totalreviews > 0 and len(game) > 0 and len(tag) > 0):
                pos_reviews_percent = int(Games[game]["positive_reviews"]/totalreviews*100) # calculating % of positive reviews
                RatingData.append([tag, pos_reviews_percent, roundedprice])

df = pd.DataFrame(RatingData, columns =['genre', 'pos_reviews', 'price']) #cloning the 2d array into a dataframe
df['pos_reviews'] = pd.to_numeric(df['pos_reviews']) #positive reviews to numerical
df2 = df.groupby(['genre', 'price'], as_index=False)\
    .agg(count=('price', 'size'), pos_reviews=('pos_reviews', 'mean')) #merge entries with duplicate price, size values and add count
df2['pos_reviews'] = df2['pos_reviews'].round(2) # rounding up to 2 decimal places

df2 = df2.sort_values(by=['price']) # sorting ascending by price

count = 0
for genre in GenreList:
    for pricepoint in pricepoints:
        if(~((df2['genre'] == genre) & (df2['price'] == pricepoint)).any()): #populate dataframe with rows of genre/price which dont exist
            NAData.append([genre, -1, pricepoint, 0])
NAdf = pd.DataFrame(NAData, columns = ['genre', 'pos_reviews', 'price', 'count']) 

df2 = df2.append(NAdf) #merge both dataframes
df2['price'] = df2['price'].astype(str)
df2['price'] = df2['price'].str.replace('50','50+')

df2.to_json('RatingData.json', index=False) #exporting to csv
