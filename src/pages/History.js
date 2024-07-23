import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { toast } from 'react-toastify';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [historyData, setHistoryData] = useState([
    { id: 1, name: 'data1.csv', date: '2024-07-12', size: '15KB' },
    { id: 2, name: 'data2.txt', date: '2024-07-10', size: '10KB' },
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    toast.success(`File with id ${id} deleted successfully`);
  };

  const handleDownload = (id) => {
    toast.info(`Viewing details for file with id ${id}`);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        History
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon position="start" />,
          }}
          sx={{
            width: 400,
            // change the focus color
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#101723',
            },
          }}
        />
        {/* <Button variant="contained" color="primary">
          Filter Options
        </Button> */}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Size</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData
              .filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.date}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDownload(file.id)}>
                      <CloudDownloadIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(file.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default History;
