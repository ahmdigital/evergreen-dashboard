import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import styles from "../../styles/LoadingSnackbar.module.css";


// loading snackbar that appears on data refresh
export default function LoadingSnackbar(props: {
    open: boolean;
}) {
  return (
    <div className={styles.snackbar}>
      <Snackbar
      open={props.open}
      sx={{ 
        backgroundColor: 'rgb(59,93,214)',
        borderRadius: 4,
        width: 350,
        alignItems: 'flex-end',
        boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)'
      }}
      >
        <Box sx={{ width: '100%' , display: 'flex', padding: '1rem'}}>
            <CircularProgress 

              sx={{
                padding: '0.5rem',
                color: (theme) =>
                  theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
              }}
              size={40}
              thickness={5}
            />
            <p className={styles.p}>Fetching Latest Updates...</p>
        </Box>
      </Snackbar>
    </div>
  );
}
