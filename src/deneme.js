import React, { useEffect, useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import { IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function ScholarSearch() {
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.query || '');
  const [results, setResults] = useState([]);
  const [correctedQuery, setCorrectedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [alldata, setAllData] = useState([]);
  const [filters, setFilters] = useState({ year: null, type: null });


  const handleCorrectedQueryClick = (correctedQuery) => {
    setQuery(correctedQuery);
    handleSearch(correctedQuery);
  };

  useEffect(() => {
    const savedQuery = sessionStorage.getItem('lastQuery');
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  const citationCountFilter = () => {
    // Alıntı sayılarını içeren yeni bir dizi oluştur
    const citationCounts = alldata.map(item => {
      return {
        data: item,
        count: parseInt(item.citation_count.split(':')[1].trim())
      };
    });

    // Alıntı sayılarına göre sırala
    citationCounts.sort((a, b) => a.count - b.count);

    // Sıralanmış verileri al
    const sortedData = citationCounts.map(item => item.data);

    // Filtrelenmiş ve sıralanmış sonuçları ayarla
    setResults(sortedData);
  };

  const citationCountFilter2 = () => {
    // Alıntı sayılarını içeren yeni bir dizi oluştur
    const citationCounts = alldata.map(item => {
      return {
        data: item,
        count: parseInt(item.citation_count.split(':')[1].trim())
      };
    });

    // Alıntı sayılarına göre sırala
    citationCounts.sort((a, b) => b.count - a.count);

    // Sıralanmış verileri al
    const sortedData = citationCounts.map(item => item.data);

    // Filtrelenmiş ve sıralanmış sonuçları ayarla
    setResults(sortedData);
  };



  useEffect(() => {
    // Veriyi yükleyen fonksiyon
    async function fetchData() {
      const response = await fetch('http://localhost:3001/get-data');
      const jsonData = await response.json();

      const newData = [];
      for (let i = 0; i < jsonData.length; i++) {
        newData.push(...jsonData[i].articles); // Her makale dizisini düzleştirerek ekle
      }

      setAllData(newData); // Bütün makaleleri alldata'ya ayarla
      setResults(newData); // Bütün makaleleri results'a ayarla
    }

    fetchData();
  }, []);


  const handleSearch = async () => {
    setLoading(true);
    sessionStorage.setItem('lastQuery', query);
    try {
      const response = await fetch('http://localhost:3001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      for (let i = 0; i < data.articles.length; i++) {
        alldata.push(data.articles[i]);
      }
      //console.log(alldata)
      setResults(data.articles);
      setCorrectedQuery(data.corrected_query);
    } catch (error) {
      console.error('Arama sırasında hata oluştu', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleClick = (item) => {
    navigate(`/extracted-text?pdf=${encodeURIComponent(item.pdf_link)}`, { state: { item } });
  };

  const downloadPdf = async (url) => {
    try {
      const response = await fetch('http://localhost:3001/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error('PDF indirilemedi.');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = url.split('/').pop() || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('PDF indirme hatası:', error);
    }
  };

  const handleFilterClick = () => {
    // alldata'nın bir kopyasını oluştur ve sırala
    const sortedData = [...alldata].sort((a, b) => a.publication_year - b.publication_year);
    setResults(sortedData);
  };

  const handleFilter2Click = () => {
    // alldata'nın bir kopyasını oluştur ve sırala
    const sortedData = [...alldata].sort((a, b) => b.publication_year - a.publication_year);
    setResults(sortedData);
  };


  return (
    <Box sx={{ padding: 3, backgroundColor: '#D7E8FA', minHeight: '100vh' }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <img src="https://raw.githubusercontent.com/esinozdmir/logo/main/logo.png" width="200" height="200" />
      </Grid>

      <Grid container spacing={2} justifyContent="center" sx={{ minWidth: "100%" }}>
        <Grid item xs={12} md={6} container justifyContent="center">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            <TextField
              fullWidth
              label="Ara"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onClick={() => setIsFocused(true)} // Tıklama olayını odaklanmış olarak işaretleyin
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(query);
                }
              }}
              sx={{
                borderRadius: '20px',
                flex: '1',
                margin: '0 auto',
                width: '50%',
                maxWidth: '100%',
                marginRight: '10px',
                backgroundColor: isFocused ? '#F6F5F5' : 'transparent',
                border: isFocused ? '1px solid black' : '1px solid black',
                '&:hover': {
                  border: '1px solid black',
                },
              }}
              InputProps={{
                style: {
                  borderRadius: '20px',
                  flex: '1',
                },
                endAdornment: (
                  <SearchIcon
                    onClick={() => handleSearch(query)}
                    sx={{ cursor: 'pointer', display: loading ? 'none' : 'block' }}
                  />
                ),
              }}
            />
            {loading && (
              <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)' }}>
                <CircularProgress size={30} sx={{ ml: "20%", color: "gray", mt: "10%" }} />
              </div>
            )}
          </div>
        </Grid>
      </Grid>

      {correctedQuery && (
        <Typography
          component="div"
          onClick={() => handleCorrectedQueryClick(correctedQuery)}
          style={{ cursor: 'pointer' }}
        >
          Düzeltilmiş sorgu: {correctedQuery}
        </Typography>
      )}

      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        {results.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%', backgroundColor: '#D7E8FA', border: 'none', boxShadow: 'none', }}>

              <CardContent sx={{ position: 'relative', paddingBottom: '16px', minHeight: '205px', backgroundColor: '#fffafa', border: '2.5px solid black', borderRadius: '20px' }}>

                <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="h5"
                    component="div"
                    onClick={() => {
                      console.log("Başlık tıklandı:", item.pdf_link);
                      handleTitleClick(item);
                    }}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {item.title}
                  </Typography>
                  {item.publisher && (
                    <Typography variant="subtitle2" color="text.secondary" sx={{ ml: 1, color: 'grey' }}>
                      - {item.publisher}
                    </Typography>
                  )}
                  {item.publication_year && (
                    <Typography variant="subtitle2" color="text.secondary" sx={{ ml: 'auto', color: 'grey' }}>
                      {item.publication_year}
                    </Typography>
                  )}
                </Typography>


                <Typography color="text.secondary" sx={{ position: 'absolute', bottom: '5px', right: '20px' }}>{item.publication_type}</Typography>
                <Typography color="text.secondary" sx={{ position: 'absolute', bottom: '5px', left: '20px' }}>{`${item.citation_count}`}</Typography>
                <Typography color="text.secondary">{item.author_info}</Typography>
                <Typography sx={{ paddingBottom: '8px' }}>{item.snippet}</Typography>
                <Box display={"flex"} flexDirection={"row"} sx={{ bottom: '5px', left: '10px' }}>
                  {item.pdf_link && (
                    <IconButton size="small" onClick={() => downloadPdf(item.pdf_link)}>
                      <GetAppIcon />
                    </IconButton>
                  )}
                  {item.link && (
                    <IconButton
                      size="small"
                      onClick={() => window.open(item.link, "_blank")}
                      sx={{ ml: 1 }}
                    >
                      <LinkIcon />
                    </IconButton>
                  )}

                </Box>

              </CardContent>



            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        sx={{ position: 'absolute', top: '5px', right: '5px' }}
        onClick={handleFilterClick}
        variant="contained"
        color="primary"
        startIcon={<EventAvailableIcon />}
        endIcon={<KeyboardArrowDownIcon />} // Küçükten büyüğe sıralama için aşağı ok
      >
      </Button>

      <Button
        sx={{ position: 'absolute', top: '30px', right: '5px' }}
        onClick={handleFilter2Click}
        variant="contained"
        color="primary"
        startIcon={<EventAvailableIcon />}
        endIcon={<KeyboardArrowUpIcon />} // Büyükten küçüğe sıralama için yukarı ok
      >
      </Button>


      <Button
        sx={{ position: 'absolute', top: '55px', right: '5px' }}
        onClick={citationCountFilter}
        variant="contained"
        color="primary"
        startIcon={<FormatQuoteIcon />}
        endIcon={<KeyboardArrowDownIcon />} // Küçükten büyüğe sıralama için aşağı ok
      >
      </Button>

      <Button
        sx={{ position: 'absolute', top: '80px', right: '5px' }}
        onClick={citationCountFilter2}
        variant="contained"
        color="primary"
        startIcon={<FormatQuoteIcon />}
        endIcon={<KeyboardArrowUpIcon />} // Büyükten küçüğe sıralama için yukarı ok
      >
      </Button>
    </Box>
  );
}

export default ScholarSearch;
