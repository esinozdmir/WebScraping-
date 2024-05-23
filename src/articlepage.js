import React, { useEffect, useState } from 'react';
import { Container, Paper } from '@mui/material';
import { TextField, Button, Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import { IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { v4 as uuidv4 } from 'uuid';

function ExtractedTextPage() {
  const [loading, setLoading] = useState(true);
  const [extractedText, setExtractedText] = useState('');
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [httpLinks, setHttpLinks] = useState('');
  const [alldata, setAlldata] = useState([]); // alldata state'i tanımlandı
  const [results, setResults] = useState([]); // setResults state'i tanımlandı
  const [doi, setDoi] = useState('');


  useEffect(() => {
    if (location.state && location.state.item) {
      setItem(location.state.item);
    }

    const extractHttpLinks = (text) => {
      const parts = text.split(' ');
      const httpLinks = parts.filter(part => part.startsWith('http://'));
      return httpLinks.join('\t\t\t\t\t\t\t');
    };

    const fetchExtractedText = async () => {
      const pdfLink = new URLSearchParams(location.search).get('pdf');
      if (pdfLink) {
        try {
          const response = await fetch('http://127.0.0.1:5000/extract-text', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: pdfLink }),
          });
          if (!response.ok) {
            throw new Error('Metin çıkarma hatası');
          }
          const text = await response.text();
          setExtractedText(text);
          setHttpLinks(extractHttpLinks(text))
          console.log(httpLinks);
        } catch (error) {
          console.error('PDF metin çıkarma hatası:', error);
        }
      }
      setLoading(false);
    };

    const generatedDoi = `10.1000/${uuidv4()}`;
    setDoi(generatedDoi);

    fetchExtractedText();
  }, [location]);


  if (loading) {
    return (
      <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="100%" style={{ marginTop: '2rem', alignItems: 'center', justifyContent: 'center' }}>
      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2, marginBottom: 5, minWidth: '100%' }}>
        <Grid item xs={12} md={0}>
          <Card sx={{ height: '100%', border: 'none', boxShadow: 'none', }}>

            <CardContent sx={{ position: 'relative', paddingBottom: '5px', minHeight: '', backgroundColor: '#fffafa', border: '2.5px solid black', borderRadius: '20px' }}>

              <Box display="flex" alignItems="center" justifyContent="center" height={"10vh"}>
                <Typography
                  variant="h3"
                  component="div"
                  align="center">
                  {item.title}
                </Typography>
              </Box>

              <Typography color="text.secondary">{item.author_info}</Typography>
              <Typography sx={{ paddingBottom: '8px' }}>{item.snippet}</Typography>
              <Box display={"flex"} flexDirection={"row"} sx={{ bottom: '5px', left: '10px' }}>
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
              <Typography color="text.secondary" sx={{ bottom: '0px', left: '20px' }}>{`${item.citation_count}`}</Typography>
              <Typography color="text.secondary" sx={{ bottom: '5px', right: '20px' }}>{item.publication_type}</Typography>
              <Typography color="text.secondary" sx={{ bottom: '5px', right: '20px' }}>{httpLinks}</Typography>
              <Typography color="text.secondary">DOI: {doi}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Paper elevation={4} style={{ padding: '2rem', width: '95%', alignContent: 'center', borderRadius: '20px' }}>
        <Typography variant="body1" component="p" style={{ whiteSpace: 'pre-line' }}>
          {extractedText}
        </Typography>
      </Paper>
    </Container>
  );
}

export default ExtractedTextPage;
