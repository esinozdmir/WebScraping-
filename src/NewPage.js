import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';

function NewPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // Varsayılan sıralama tipi

  useEffect(() => {
    // Elasticsearch'ten verileri çeken fonksiyonu çağırın
    fetchDataFromElasticsearch();
  }, [sortOrder]); // sortOrder state'i değiştiğinde useEffect yeniden çağrılacak

  const fetchDataFromElasticsearch = async () => {
    try {
      // Elasticsearch'ten verileri çekin
      const response = await fetch('http://localhost:9200/yayinlar/_search', {
        method: 'POST', // Veya 'GET' eğer uygunsa
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            "sort": [{ "publication_year": { "order": sortOrder } }]
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Elasticsearch verileri alınamadı.');
      }

      const data = await response.json();
      setSearchResults(data.articles); // Elasticsearch'ten gelen verileri state'e kaydedin
    } catch (error) {
      console.error('Elasticsearch verileri alma hatası:', error);
    }
  };

  const handleSortChange = () => {
    // Sıralama tipini değiştir
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <Typography variant="h1">Yeni Sayfa</Typography>
      {/* Sıralama düğmesi */}
      <Button variant="outlined" onClick={handleSortChange}>
        {sortOrder === 'asc' ? 'Yeniden Eskiye' : 'Eskiden Yeniye'}
      </Button>
      {/* Elasticsearch'ten gelen verileri ekranda gösterin */}
      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>
            <Typography variant="body1">{result.title}</Typography>
            <Typography variant="body2">{result.author_info}</Typography>
            <Typography variant="body2">{result.snippet}</Typography>
            {/* Diğer veri alanlarını da gösterebilirsiniz */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewPage;
