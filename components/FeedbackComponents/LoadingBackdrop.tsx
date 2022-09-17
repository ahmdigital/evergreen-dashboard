import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import styles from "../../styles/LoadingBackdrop.module.css";
import { blue } from '@mui/material/colors';


// personalised linear progress bar
/* 
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));
*/
// backdrop for when app is updating data
/* 
export default function LoadingBackdrop(props: {
    open: boolean;
}) {
  return (
    <div>
      <Backdrop
        sx={{ 
          color: '#fff',
          // change opacity and colour of backdrop here:
          backgroundColor: 'rgb(68, 68, 68, 0.98)',
          textAlign: 'center',
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
        open={props.open}
      >
        <Box sx={{ width: '80%' , alignItems: 'center'}}>
            <BorderLinearProgress/>
            <p>Fetching Latest Updates...</p>
        </Box>
      </Backdrop>
    </div>
  );
}
*/

export default function LoadingBackdrop(props: {
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
        <Box sx={{ width: '80%' , alignItems: 'flex', padding: '1rem'}}>
            <CircularProgress 

              sx={{
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
