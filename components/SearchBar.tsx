import React from "react";
import styles from "./SearchBar.module.css";
import debounce from 'lodash.debounce';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Customising the table styling using ThemeProvider
const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          fontWeight: "var(--font-weight-semibolder)",
          fontSize: "var(--font-size-large)",
          fontFamily: 'var(--primary-font-family)',
        }
      }
    },
  }
})

export default function SearchBar(props: {
  searchTerm: any;
  setSearchTerm: any;
  repoNames: any
}) {

  // Updating the searchTerm state
  const handleChange = (event, value) => {
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
      <div className={styles.searchBarWidth}>
        <Autocomplete fullWidth={true} freeSolo options={props.repoNames} renderInput={(params) => <TextField {...params} label="Search" />} onChange={debounceOnChange} />
      </div>
    </ThemeProvider>
  );
}