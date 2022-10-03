import React from "react";
import debounce from 'lodash.debounce';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Customising the table styling using ThemeProvider
const theme = createTheme({
  typography: {
    fontFamily: 'var(--primary-font-family)',
    fontWeightRegular: 'var(--font-weight-semibold)',
  },
})

export default function SearchBar(props: {
  searchTerm: any;
  setSearchTerm: any;
  repoNames: any
}) {

  // Updating the searchTerm state
  const handleChange = (event: any, value: any) => {
    if (!value) {
      props.setSearchTerm('')
    } else {
      props.setSearchTerm(value)
    }
  }

  // Using debounce to delay invoking handleChange function, this ensures there is no lag/(freeze) when clearing the search bar
  const debounceOnChange = debounce(handleChange, 100)

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Autocomplete fullWidth={true} freeSolo options={props.repoNames} renderInput={(params) => <TextField {...params} label="Search" />} onChange={debounceOnChange} />
      </div>
    </ThemeProvider>
  );
}
