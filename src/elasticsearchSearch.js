const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({ node: 'http://localhost:9200' });

async function fetchDocuments(indexName) {
  try {
    const { body } = await elasticClient.search({
      index: indexName, // İndeks adı
      body: {
        query: {
          match_all: {} // Tüm belgeleri almak için boş bir sorgu
        }
      }
    });

    return body.hits.hits.map(hit => hit._source); // Belge verilerini döndür
  } catch (error) {
    console.error('Elasticsearch sorgu hatası:', error);
    throw error; // Hata durumunda istisna fırlat
  }
}

// Örnek olarak "yayinlar" indeksindeki tüm belgeleri alalım
fetchDocuments('yayinlar')
  .then(documents => {
    console.log('Belgeler:', documents);
  })
  .catch(error => {
    console.error('Belge alımı hatası:', error);
  });
