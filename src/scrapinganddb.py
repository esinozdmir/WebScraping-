import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

# MongoDB bağlantısı kurma
client = MongoClient('mongodb+srv://mali:efmukl123@yazlab21.3tqyjnc.mongodb.net/?retryWrites=true&w=majority&appName=Yazlab21')
db = client['yazlab21']
collection = db['yayinlar']

# Web sayfasından veri çekme fonksiyonu
def veri_cekme(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    yayinlar = []

    # Her yayın için gerekli özellikleri çekme
    for yayin_element in soup.find_all('div', class_='meta'):
        
        # yayin_id_element yerine abstract_element olarak değiştirildi
        
        
        dt_tags = yayin_element.find_all('dt')
        yayin_id = ''
        for dt_tag in dt_tags:
            yayin_id += dt_tag.text.strip() + ' '  # Her bir dt etiketinin metnini birleştir
        yayin_id = yayin_id.strip()  # Son ekstra boşlukları temizle
    
        # Yayın adını çekme
        yayin_adi_element = yayin_element.find('div', class_='list-title mathjax')
        yayin_adi = yayin_adi_element.text.strip() if yayin_adi_element else 'Bulunamadı'
        
        yayin_yazar_adi_element = yayin_element.find('div', class_='list-authors')
        yayin_yazar_adi = yayin_yazar_adi_element.text.strip() if yayin_yazar_adi_element else 'Bulunamadı'

        # Diğer özellikleri de benzer şekilde çekin

        # Her bir yayının özelliklerini bir sözlükte toplayın
        yayin = {
            'id': yayin_id,
            'adi': yayin_adi,
            'yazar adi': yayin_yazar_adi,
            # Diğer alanlar...
            'url': url
         }

        # Yayın sözlüğünü listeye ekleyin
        yayinlar.append(yayin)

    return yayinlar 


# Veriyi MongoDB'ye kaydetme fonksiyonu
def veri_kaydet(yayinlar):
    for yayin in yayinlar:
        collection.insert_one(yayin)

# URL listesi (örnek olarak)
urls = ['https://arxiv.org/list/hep-lat/new']

# Her URL için veri çekme ve MongoDB'ye kaydetme
for url in urls:
    yayinlar = veri_cekme(url)
    veri_kaydet(yayinlar)
