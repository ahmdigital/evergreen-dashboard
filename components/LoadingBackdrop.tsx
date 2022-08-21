import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

export default function LoadingBackdrop(props: {
    open: boolean;
}) {
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.open}
      >
        <Box sx={{ width: '80%' }}>
            <p>Updating Dashboard...</p>
            <LinearProgress />
        </Box>
      </Backdrop>
    </div>
  );
}
