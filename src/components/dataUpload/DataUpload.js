import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const FilePreview = ({ fileInfo, csvData, onDownload }) => {
  return (
    <Box sx={{ padding: '20px', border: '2px solid #101723', borderRadius: '10px', mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        File Preview
      </Typography>
      <Typography variant="body1">
        <strong>File Name:</strong> {fileInfo.name}
      </Typography>
      <Typography variant="body1">
        <strong>File Type:</strong> {fileInfo.type}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#101723',
          '&:hover': {
            backgroundColor: '#060A10',
          },
          mt: 2,
        }}
        onClick={onDownload}
      >
        Download CSV
      </Button>
    </Box>
  );
};

const DataUpload = () => {
  const [fileInfo, setFileInfo] = useState(null);
  const [desiredLength, setDesiredLength] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [csvData, setCsvData] = useState('');

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

  const handleInitiate = async () => {
    if (!fileInfo) {
      toast.error('Please upload a file before initiating.');
      return;
    }

    const file = document.querySelector('input[type="file"]').files[0];
    const formData = new FormData();
    formData.append('new_data', file);

    try {
      // Make a POST request to the API with num_of_samples as a query parameter
      const response = await axios.post(
        `https://timeseriesvae.onrender.com/generate?num_of_samples=${desiredLength}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        const csv = jsonToCSV(response.data.synthetic_data);
        setCsvData(csv);
        setShowPreview(true);

        await saveFileToDatabase(file);
      } else {
        toast.error('Failed to generate synthetic data.');
      }
    } catch (error) {
      toast.error('An error occurred while generating synthetic data.');
    }
  };

  const saveFileToDatabase = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://synthetictimeanomely-be.onrender.com/api/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('File saved successfully.');
      } else {
        toast.error('Failed to save file.');
      }
    } catch (error) {
      toast.error('An error occurred while saving the file.');
    }
  };

  const jsonToCSV = (json) => {
    const keys = Object.keys(json);
    const columns = Object.keys(json[keys[0]]);
    const header = ['Index', ...keys].join(',');
    const rows = columns.map((column) => {
      return [column, ...keys.map((key) => json[key][column])].join(',');
    });

    return [header, ...rows].join('\n');
  };

  const handleDownload = () => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'synthetic_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {!showPreview ? (
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
            <Box
              {...getRootProps()}
              sx={{ mt: 2, padding: '20px', border: '2px dashed lightGrey', borderRadius: '10px' }}
            >
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
                  type="number"
                  variant="outlined"
                  value={desiredLength}
                  onChange={(e) => setDesiredLength(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#101723',
                    },
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
      ) : (
        <FilePreview fileInfo={fileInfo} csvData={csvData} onDownload={handleDownload} />
      )}
    </>
  );
};

export default DataUpload;
