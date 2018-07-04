#!/usr/bin/env python


import requests

def get_page(url):
    ''' get BOM weather data by weather station id, return page as text'''
    page = requests.get(url)
    if page.ok:
        return page
    else:
        return None

# target url
target_url = "https://en.wikipedia.org/wiki/List_of_Rugby_World_Cup_try_scorers"

page = get_page(target_url)

#with open('test.html', 'w') as w:
#    w.write(page)
