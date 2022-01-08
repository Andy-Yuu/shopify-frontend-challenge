import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, CardHeader, IconButton } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import astronautImg from './resources/astronaut.jpeg';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const initialNumImages = 1;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNASAData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1&thumbs=True`);
      setImages(prevImages => [
        {
          title: res.data[0].title,
          date: res.data[0].date,
          description: res.data[0].explanation,
          imageURL: res.data[0].media_type === "video" ? res.data[0].thumbnail_url : res.data[0].url,
          liked: false,
        },
        ...prevImages,
      ])
    } catch(err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }

  const handleLike = (index) => {
    setImages(prevImages => {
      let newImages = [...prevImages];
      newImages[index].liked = !newImages[index].liked;
      return newImages;
    });
    let prevLikedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
    if(images[index].liked) {
      localStorage.setItem('likedImages', JSON.stringify([images[index], ...prevLikedImages]));
    } else {
      let uniqueDate = images[index].date;
      let newLocalStorageLikedImages = prevLikedImages.filter((image) => image.date !== uniqueDate);
      localStorage.setItem('likedImages', JSON.stringify([...newLocalStorageLikedImages]));
    }
  }

  const handleShare = (index) => {
    navigator.clipboard.writeText(images[index].imageURL);
    toast.success(`Image link of ${images[index].title} copied to clipboard!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      });
  }

  useEffect(() => {
    let prevLikedImages = JSON.parse(localStorage.getItem("likedImages")) || [];
    if (prevLikedImages.length) {
      setImages(prevImages => [...prevImages, ...prevLikedImages]);
    } else {
      for(let x = 0; x < initialNumImages; x++) getNASAData();
    }
  }, []);

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
      <ToastContainer />
      <Typography variant='h3' style={{fontFamily: 'Oleo Script, cursive', textAlign: 'center', margin: '20px 0', wordWrap: 'break-word'}}>
        Spacestagram
      </Typography>
      <LoadingButton
        onClick={getNASAData}
        loading={loading}
        color="secondary"
        variant="contained"
        loadingIndicator="Loading..."
        startIcon={<img src={astronautImg} alt="astronaut" style={{borderRadius: '50%', height: '50px', width: 'auto'}}/>}
        style={{ marginBottom: "20px"}}
      >
        Fetch Random Astronomy Picture of the Day
      </LoadingButton>
      <Grid 
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        style={{ marginBottom: "20px"}}
      >
        {images.map((image, index) => {
          return (
            <Grid item key={index}>
              <Card sx={{ maxWidth: 400, height: 550 }} style={{display: 'flex', flexDirection: 'column'}}>
                <CardHeader 
                  title={<Typography>{image.title}</Typography>}
                  subheader={<Typography>{image.date}</Typography>}
                  avatar={<img style={{height: '40px', width: '40px', borderRadius: '50%'}} src={astronautImg} alt='avatar'/>}
                />
                <CardMedia
                  component="img"
                  image={image.imageURL}
                  alt={image.title}
                  height='250'
                />
                <CardActions>
                  <IconButton onClick={() => handleLike(index)}>
                    {image.liked ? <FavoriteIcon style={{color: 'red'}}/> : <FavoriteBorderIcon/>}
                  </IconButton>
                  <IconButton onClick={() => handleShare(index)}>
                    <SendOutlinedIcon/>
                  </IconButton>
                </CardActions>
                {image.description && (
                  <CardContent sx={{ overflow: 'scroll'}} style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      {image.description}
                    </Typography>
                  </CardContent>
                )}
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </div>
  );
}

export default App;
