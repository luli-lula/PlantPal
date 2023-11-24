import React, { useState } from 'react';
import { recognizeImage } from './components/openai';
import { Typography, Grid, Paper, IconButton, Toolbar, Card, CardContent, TextField } from '@mui/material';

import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';


function App() {
  const [imageData, setImageData] = useState(null);
  const [result, setResult] = useState(null);
  const [userApiKey, setUserApiKey] = useState(''); // New state variable for user API key


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result.split(',')[1];
      // TODO: compress the image to a fixed size

      setImageData(base64Image)
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImageData(null);
    document.getElementById('image-upload').value = null;
    setResult(null); // Add this line to delete card content
  };

  const handleRecognition = async () => {
    const cache = false
    let response = true

    console.log(cache)

    if (!cache) {
      response = await recognizeImage(imageData, userApiKey);// Use userApiKey here
    }

    if (response) {
      let content = `{
        "name": "Lily of the Valley",
        "latinName": "Convallaria majalis",
        "description": "Lily of the Valley is a perennial plant with sweetly scented, bell-shaped white flowers hanging from a thin stem, paired with oblong to lance-shaped green leaves. It is known for its fragrant blossoms and commonly found in temperate forests. Despite its delicate appearance, it is a hardy plant that spreads to form extensive ground cover." 
      }`

      if (!cache) {
        content = response.data.choices[0].message.content;
      }
      console.log(content)

      // TODO: check if the content is json, if not, parse json.

      let image_resp_content = JSON.parse(content);
      setResult(image_resp_content);
    }
  };

  return (
    <div>
      {/* This is the header  */}
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', bgcolor: 'success.main' }}>
        <Typography variant="h4" sx={{ color: 'common.white' }}>PlantPal</Typography>
      </Toolbar>

      {/* This is image upload section */}
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center', position: 'relative', marginTop: '20px' }}>
            <Grid item>
              <Box
                sx={{
                  width: 'auto',
                  height: 300,
                  border: '2px dashed green',
                  marginBottom: '1rem',
                  padding: '10px',
                  position: 'relative',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => document.getElementById('image-upload').click()}
              >

                {/* This is image display */}
                {imageData ? (
                  <img
                    src={`data:image/jpeg;base64,${imageData}`}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <Typography variant="body1">Click to upload your image</Typography>
                )}
                
                <input
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />

                {/* This is image delete button */}
                {imageData && (
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteImage();
                    }}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      zIndex: 1,
                      backgroundColor: 'white',
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Box>
            </Grid>

            {/* This is user API key input section */}
            <Grid item>
              <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                  <TextField
                    type="password"
                    label="API Key"
                    value={userApiKey}
                    onChange={(e) => setUserApiKey(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <IconButton color="primary" aria-label="recognize" component="span" onClick={handleRecognition}>
                    <SearchIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>

            {/* <Grid item>
              <Grid container justifyContent="center" spacing={2}>
                <Grid item>

                  <IconButton color="primary" aria-label="recognize" component="span" onClick={handleRecognition}>
                    <SearchIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid> */}
          </Paper>

          {/* This is image recognization result section */}
          {result && (
            <Card sx={{ maxWidth: '100%' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {result.name ? result.name : 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {result.latinName ? result.latinName : 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.description ? result.description : 'Unknown'}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

    </div>
  );
}
export default App;
