import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';


// personalised linear progress bar
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

// backdrop for when app is updating data
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
