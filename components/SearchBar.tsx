import React from "react";
import Image from "next/image";
import styles from "./SearchBar.module.css";
import magnifyingGlass from "./images/magnifying-glass.svg";
import debounce from 'lodash.debounce';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";

export default function SearchBar(props: {
  searchTerm: any;
  setSearchTerm: any;
  repoNames: any
}) {

  // Updating the search term state
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
    <div className={styles.searchBarWidth}>
      <Autocomplete freeSolo options={props.repoNames} renderInput={(params) => <TextField {...params} label="Search" />} onChange={debounceOnChange} />
    </div>
  );
}