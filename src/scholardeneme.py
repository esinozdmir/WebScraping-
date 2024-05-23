import sys
import json
import requests
from bs4 import BeautifulSoup
import re
from pymongo import MongoClient
from elasticsearch import Elasticsearch

def scrape_google_scholar(query):
    headers = {'User-Agent': 'Mozilla/5.0'}
    query = query.replace(' ', '+')
    url = f"https://scholar.google.com/scholar?q={query}"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return {"error": "Failed to fetch data from Google Scholar."}

    soup = BeautifulSoup(response.text, 'html.parser')
    articles = soup.find_all("div", class_="gs_ri")
    article_data = []
    myId = 1

    for article in articles:
        title_tag = article.find("h3", class_="gs_rt")
        title = title_tag.text
        link = title_tag.find('a', href=True)['href'] if title_tag.find('a', href=True) else "Link bulunamadı"

        author_info_div = article.find("div", class_="gs_a")
        author_info = author_info_div.text
        author_name = author_info.split(' - ')[0].strip()

        # Yayın tarihini çekme
        publication_year_match = re.search(r'\b\d{4}\b', author_info)
        publication_year = publication_year_match.group(0) if publication_year_match else "Bilinmiyor"

        snippet = article.find("div", class_="gs_rs").text

        publisher_info = author_info_div.text.split(' - ')
        publisher = publisher_info[-1] if len(publisher_info) > 1 else "Yayıncı bilgisi bulunamadı"

        corrected_query_div = soup.find("div", id="gs_res_ccl_top")
        if corrected_query_div:
            corrected_query_tag = corrected_query_div.find("h2", class_="gs_rt")
            if corrected_query_tag and corrected_query_tag.a:
                corrected_query = corrected_query_tag.a.text
            else:
                corrected_query = "Düzeltilmiş sorgu bulunamadı"
        else:
            corrected_query = "Düzeltilmiş sorgu bulunamadı"


        # Yayın türü bilgisini çekme
        publication_type_tag = article.find("span", class_="gs_ct1")
        publication_type = publication_type_tag.text if publication_type_tag else "Bilinmiyor"

        pdf_link = None
        pdf_section = article.parent.find("div", class_="gs_ggsd")
        if pdf_section:
            pdf_link_tag = pdf_section.find("a")
            if pdf_link_tag and 'href' in pdf_link_tag.attrs:
                pdf_link = pdf_link_tag['href']

        citation_div = article.find("div", class_="gs_fl gs_flb")
        citation_text = "Alıntılanma sayısı bulunamadı"
        if citation_div:
            citation_link = citation_div.find("a", href=lambda href: href and "scholar?cites" in href)
            if citation_link:
                citation_text = citation_link.text

        article_data.append({
            "id": myId,
            "title": title,
            "author_info": author_name,
            "publication_year": publication_year,
            "snippet": snippet,
            "key": query,
            "publication_type": publication_type,
            "citation_count": citation_text,
            "pdf_link": pdf_link,
            "link": link,
            "publisher": publisher
        })
        myId = myId + 1

    return {"articles": article_data, "corrected_query": corrected_query}


client = MongoClient("mongodb+srv://mali:efmukl123@yazlab21.3tqyjnc.mongodb.net/?retryWrites=true&w=majority&appName=Yazlab21")
db = client.yazlab21
collection = db.yayinlar

# Verileri işle ve MongoDB'ye yaz
def write_to_mongodb(data):
    if isinstance(data, list):
        collection.insert_many(data)
    else:
        collection.insert_one(data)

es = Elasticsearch("http://localhost:9200")

def write_to_elasticsearch(data):
     index_name = "yayinlar"  # Elasticsearch endeksinizin adı
     for article in data["articles"]:
         es.index(index=index_name, document=article)



if __name__ == "__main__":
    query = sys.argv[1]
    results = scrape_google_scholar(query)
    print(json.dumps(results, indent=2))
    write_to_mongodb(results)
    write_to_elasticsearch(results)
