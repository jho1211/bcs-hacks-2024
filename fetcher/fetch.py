import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import json
from pymongo import MongoClient
import os
import datetime
from dotenv import load_dotenv

load_dotenv()

headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"}
s = requests.Session()
s.headers.update(headers)

options = Options()
# options.add_argument("--headless=new")
options.add_extension("extensions/ublock.crx")
driver = webdriver.Chrome(options=options)

client = MongoClient(host=os.getenv("ATLAS_URI"))

def get_saveon_url(search_term, sale_only, sort_price):
    base_url = "https://www.saveonfoods.com/sm/pickup/rsid/2241/results?q="
    url = base_url + search_term

    if sale_only:
        url = url + "&fpromotions=True"
    if sort_price:
        url = url + "&take=30&sort=price"
        
    return url
    
def fetch_saveon(url):
    r = s.get(url)
    soup = BeautifulSoup(r.content, 'html.parser')
    return soup

def process_saveon(search_term, soup_stuff):
    html_items = soup_stuff.find("div", class_='Listing--vkq6wb exoySO')
    items = []
    items_ = html_items.find_all("div", class_="ColListing--1fk1zey")

    if not items_:
        return items
    
    for item in items_[:min(len(items_), 3)]:
        d = {}
        name = item.find("div", class_="sc-dlnjPT cuIYFB").get_text().replace("Open product description", "")
        price = item.find("span", class_="ProductCardPrice--xq2y7a ihyHsI")
        price2 = item.find("span", class_="ProductCardPrice--xq2y7a jzIfcR")
        if (price):
            d["price"] = price.get_text()
            d["sale"] = False
        else:
            d["price"] = price2.get_text()
            d["sale"] = True
        d["input_name"] = search_term
        d["name"] = name
        d["unit"] = "n/a"
        d["store"] = "Save on Foods"
        d["img_link"] = item.find("img")['src']
        d["store_link"] = item.find("a", class_="ProductCardHiddenLink--v3c62m dGWlVm")["href"]
        d["date"] = datetime.datetime.now(tz=datetime.timezone.utc) #get current date as string
        items.append(d)

        # d = {}
        # d["input_name"] = search_term
        # d["name"] = compl_name
        # d["price_per_unit"] = price
        # d["unit"] = size #get the unit
        # d["store"] = "No Frills"
        # d["img_link"] = img
        # d["store_link"] = link
        # d["sale"] = sale
        # d["date"] = datetime.datetime.now(tz=datetime.timezone.utc) #get current date as string
        
    return items

def get_nofrills_url(search_term, sale_only, sort_price):
    base_url = "https://www.nofrills.ca/search?search-bar="
    url = base_url + search_term
    if sale_only:
        url += "&promotions=Multi-Buy&promotions=Price%20Reduction&promotions=$1,$2,$3,$4,$5"
    if sort_price:
        url += "&sort=price-asc"
    return url

def fetch_nofrills(url):
    driver.get(url)
    time.sleep(10)
    html = driver.page_source
    return html

def process_nofrills(search_term, soup_stuff):
    soup = BeautifulSoup(soup_stuff, 'html.parser')

    items = []
    html_items = soup.find("div", class_="product-tile-group product-tile-group--product-grid product-tile-group--flex product-tile-group--cross-category-active")
    items_ = html_items.find_all("li", class_="product-tile-group__list__item")

    if not items_:
        return None
        
    for item in items_[:min(len(items_), 3)]:
        track = json.loads(item.find("div", class_="product-tracking")['data-track-products-array'])[0]
        # {'productSKU': '20142553_KG', 'productName': 'Lamb Leg Short Cut, Frozen', 'productBrand': None, 'productCatalog': 'grocery', 'productVendor': None, 'productPrice': '20.24', 
        #  'productQuantity': None, 'dealBadge': None, 'loyaltyBadge': 'false', 'textBadge': '', 'productPosition': 1, 'productOrderId': None, 'productVariant': None, 'subProduct': None}

        brand = track['productBrand'] if track['productBrand'] else "No Brand"
        name = track['productName']
        price = track['productPrice']
        # price = item.find("span", class_="price__value comparison-price-list__item__price__value").get_text()
        # unit = item.find("span", class_="price__value comparison-price-list__item__price__unit").get_text()
        sale = True if (track['dealBadge'] == 'sale') else False
        id_ = track['productSKU']
        
        if sale:
            size = item.find("span", class_="price__unit selling-price-list__item__price selling-price-list__item__price--sale__unit").get_text()
        else:
            size = item.find("span", class_="price__unit selling-price-list__item__price selling-price-list__item__price--now-price__unit").get_text()

        compl_name = "{} - {} ({})".format(brand, name, size)
        img = "https://assets.shop.loblaws.ca/products/{}/b1/en/front/{}_front_a01.png".format(id_, id_)
        link = "https://www.nofrills.ca" + item.find("a", "product-tile__details__info__name__link")["href"]

        d = {}
        d["input_name"] = search_term
        d["name"] = compl_name
        d["price_per_unit"] = price
        d["unit"] = size #get the unit
        d["store"] = "No Frills"
        d["img_link"] = img
        d["store_link"] = link
        d["sale"] = sale
        d["date"] = datetime.datetime.now(tz=datetime.timezone.utc) #get current date as string

        items.append(d)
    return items

def get_item_price_saveon(search_term, sale_only, sort_price):
    return process_saveon(search_term, fetch_saveon(get_saveon_url(search_term, sale_only, sort_price)))

def get_item_price_nofrills(search_term, sale_only, sort_price):
    return process_nofrills(search_term, fetch_nofrills(get_nofrills_url(search_term, sale_only, sort_price)))

def get_item_price(source, search_term, sale_only, sort_price):
    d = {"saveon": get_item_price_saveon, "nofrills": get_item_price_nofrills}

    if source not in d:
        print("Invalid source! Valid sources are: {}".format(" and ".join(d.keys())))
        return
    
    return d[source](search_term, sale_only, sort_price)

def save_to_db(prices):
    db = client.grocery
    collection = db.grocery_prices
    
    documents = prices
    res = collection.insert_many(documents)
    
    if res.inserted_ids:
        print("Successfully added grocery prices to the database")
    else:
        print('There was an error adding one or more grocery prices to the database.')

## DRIVER FUNCTION ##
## RUN TO FETCH ALL THE PRICE DATA FOR ALL THE TERMS IN item_list.txt ##

stores = ["saveon", "nofrills"]
terms = []

with open("item_list.txt") as file:
    data = file.read()
    terms = data.split("\n")

print(terms)

for term in terms:
    for store in stores:
        print(term)
        prices = get_item_price(store, term, False, False)
        save_to_db(prices)