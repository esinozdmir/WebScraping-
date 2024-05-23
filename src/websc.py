import requests
from bs4 import BeautifulSoup

# İstek yapılacak URL
url = 'https://arxiv.org/list/hep-lat/new'

# Sayfayı çekme
response = requests.get(url)

# HTML içeriğini BeautifulSoup ile parse etme
soup = BeautifulSoup(response.text, 'html.parser')

# Spesifik verileri bulma ve yazdırma
# Örnek olarak, her makalenin başlığını alalım
for item in soup.find_all('div', class_='list-title mathjax'):
    title = item.text.strip().replace('Title: ', '')  # Başlık metninden "Title: " kısmını kaldırıyoruz
    print(title)
