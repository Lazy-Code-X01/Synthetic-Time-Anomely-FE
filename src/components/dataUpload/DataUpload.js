import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { toast } from 'react-toastify';

const DataUpload = () => {
  const [fileInfo, setFileInfo] = useState(null);
  const [desiredLength, setDesiredLength] = useState('');
  const [anomalyTimes, setAnomalyTimes] = useState('');

  const validateFile = (file) => {
    const validTypes = ['text/csv', 'text/plain'];
    const validExtensions = ['.csv', '.txt'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    return validTypes.includes(file.type) && validExtensions.includes(fileExtension);
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      toast.error('Only CSV and TXT files are allowed.');
      return;
    }
    const file = acceptedFiles[0];
    if (file && validateFile(file)) {
      setFileInfo({ name: file.name, type: file.type });
    } else {
      toast.error('Only CSV and TXT files are allowed.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.csv, .txt',
    multiple: false,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isValid = validateFile(file);
      if (isValid) {
        setFileInfo({ name: file.name, type: file.type });
      } else {
        toast.error('Only CSV and TXT files are allowed.');
      }
    }
  };

  const handleInitiate = () => {
    // Handle the initiate action here
    console.log({ desiredLength, anomalyTimes });
  };

  return (
    <>
      <Box sx={{ border: '2px dashed lightGrey', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Supported file formats: CSV, TXT
        </Typography>
        <Button
          sx={{
            backgroundColor: '#101723',
            '&:hover': {
              backgroundColor: '#060A10',
            },
          }}
          variant="contained"
          component="label"
        >
          Upload Real World Data
          <input type="file" hidden accept=".csv, .txt" onChange={handleFileChange} />
        </Button>
        <Box {...getRootProps()} sx={{ mt: 2, padding: '20px', border: '2px dashed lightGrey', borderRadius: '10px' }}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography variant="body1">Drop the files here...</Typography>
          ) : fileInfo ? (
            <Typography variant="body1">
              {fileInfo.name} ({fileInfo.type})
            </Typography>
          ) : (
            <Typography variant="body1">Drag & drop some files here, or click to select files</Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ mt: 2, textAlign: 'left' }}>
        <Typography variant="h6" gutterBottom>
          Define Parameters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Desired Length"
              variant="outlined"
              value={desiredLength}
              onChange={(e) => setDesiredLength(e.target.value)}
              sx={{
                // change the focus color
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#101723',
                },
                // the label color
                '& .MuiInputLabel-outlined.Mui-focused': {
                  color: '#101723',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Anomaly Times (spikes, dips)"
              variant="outlined"
              value={anomalyTimes}
              onChange={(e) => setAnomalyTimes(e.target.value)}
              sx={{
                // change the focus color
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#101723',
                },
                // the label color
                '& .MuiInputLabel-outlined.Mui-focused': {
                  color: '#101723',
                },
              }}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#101723',
            '&:hover': {
              backgroundColor: '#060A10',
            },
            mt: 2,
          }}
          onClick={handleInitiate}
        >
          Initiate
        </Button>
      </Box>
    </>
  );
};

export default DataUpload;
