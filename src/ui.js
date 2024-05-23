import React from 'react';
import { Card, CardContent, Typography, Divider, Box } from '@mui/material';
import { styled } from '@mui/system';

const RootCard = styled(Card)({
    maxWidth: 1000,
    maxHeight: 400,
    margin: '10px auto',
    backgroundColor: '#e0ffff', // Dış arka plan rengi
  });

  const InfoBox = styled(Box)({

    marginBottom: '5px', // Boşlukları azalttık
    padding: '5px', // Padding'i azalttık
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: 'fit-content',
    height: 'fit-content',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });
  
  const Title = styled(Typography)({
    fontSize: 5, // Başlık yazı boyutunu küçülttük
  });

  const InfoItem = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  });

const Yayin = ({ data }) => {
  return (
    <RootCard>
      <CardContent>
       
        <InfoBox>
          <InfoItem>
            <Typography variant="body1">{data.yayinId}</Typography>
            <Box marginLeft={2} />
          </InfoItem>
          <Typography variant="body1">{data.yayinAdi}</Typography>
        </InfoBox>

        <InfoBox >
        <InfoItem>
          <Typography variant="body1">{data.yazarlar}</Typography>
          <Box marginLeft={2} />
          </InfoItem>
        </InfoBox>

        <InfoBox >
        <InfoItem>
          <Typography variant="body1">{data.ozet}</Typography>
          </InfoItem>
        </InfoBox>

        <InfoBox bgcolor="#f0f0f0">
          <Typography variant="body1">{data.yayinTuru}</Typography>
        </InfoBox>
        <InfoBox bgcolor="#f5f5f5">
          <Typography variant="body1">{data.yayimlanmaTarihi}</Typography>
        </InfoBox>
        <InfoBox bgcolor="#f0f0f0">
          <Typography variant="body1">{data.yayinciAdi}</Typography>
        </InfoBox>
        <InfoBox bgcolor="#f5f5f5">
          <Typography variant="body1">{data.anahtarKelimelerAramaMotoru}</Typography>
        </InfoBox>
        <InfoBox bgcolor="#f0f0f0">
          <Typography variant="body1">{data.anahtarKelimelerMakale}</Typography>
        </InfoBox>
        
        <InfoBox bgcolor="#f0f0f0">
        <Divider />
        {data.referanslar && (
        <>
        {data.referanslar.map((referans, index) => (
        <InfoBox key={index} bgcolor={index % 2 === 0 ? '#f0f0f0' : '#f5f5f5'}>
          <Typography variant="body1">
            <a href={referans.url}>{referans.baslik}</a>
          </Typography>
        </InfoBox>
        ))}
        </>
        )}
</InfoBox>

        <InfoBox bgcolor="#f0f0f0">
          <Typography variant="body1">{data.alintiSayisi}</Typography>
        </InfoBox>
        {data.doiNumarasi && (
          <InfoBox bgcolor="#f5f5f5">
            <Typography variant="body1">
              <a href={`https://doi.org/${data.doiNumarasi}`}>{data.doiNumarasi}</a>
            </Typography>
          </InfoBox>
        )}
        {data.url && (
          <InfoBox bgcolor="#f0f0f0">
            <Typography variant="body1">
              <a href={data.url}>{data.url}</a>
            </Typography>
          </InfoBox>
        )}
      </CardContent>
    </RootCard>
  );
};

export default Yayin;
