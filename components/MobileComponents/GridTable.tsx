import { Grid, Typography } from '@mui/material';
import { ProcessedDependencyData } from '../../hooks/useProcessDependencyData';
import { Box } from '@mui/system';
import { GridRow } from './MobileGridComponents/GridRow';

const tableHeaderTextSX = {
  fontWeight: 'var(--font-weight-semibolder)',
  fontSize: 'var(--font-size-large)',
  fontFamily: 'var(--primary-font-family)',
  backgroundColor: 'var(--table-cell-background)',
  color: 'var(--colour-font)',
  marginTop: '1rem',
  lineHeight: '3rem',
  borderColor: 'var(--table-cell-border)',
  borderWidth: '0.2rem',
};

type GridTableProps = {
  rows: ProcessedDependencyData;
  emptyRows: boolean;
  searchTerm: string;
  tableRows: ProcessedDependencyData;
};

export function GridTable(props: GridTableProps) {
  return (
    <Box>
      <Grid container>
        <Grid item xs="auto">
          <Typography
            sx={{
              width: {
                xs: '96px',
                sm: '76px',
              },
              paddingLeft: {
                xs: '0px',
                sm: '20px',
              },
              ...tableHeaderTextSX,
            }}
          >
            status&nbsp;
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography sx={tableHeaderTextSX}>name</Typography>
        </Grid>
        <Grid item xs sx={{ display: { xs: 'none', md: 'initial' } }}>
          <Typography sx={tableHeaderTextSX}>repository</Typography>
        </Grid>
        <Grid item xs="auto" md={2}>
          <Typography sx={tableHeaderTextSX}>version</Typography>
        </Grid>
        <Grid item md={2} sx={{ display: { xs: 'none', md: 'initial' } }}>
          <Typography sx={tableHeaderTextSX}>last push</Typography>
        </Grid>
      </Grid>

      <hr style={{ backgroundColor: 'black', height: '4px', border: 'none' }} />

      {props.rows?.map((row, index) => (
        <GridRow row={row} key={index} />
      ))}
      {props.emptyRows && (
        <div>
          <p>organisation has 0 repositories</p>
        </div>
      )}
      {props.searchTerm !== '' && props.rows.length === 0 && (
        <div>
          <p>No search results found</p>
        </div>
      )}
    </Box>
  );
}
