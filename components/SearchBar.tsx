import React, { useState } from "react";
import Image from "next/image";
import styles from "./SearchBar.module.css";
import magnifyingGlass from "./images/magnifying-glass.svg";
import Autofill from "./Autofill";
import debounce from 'lodash.debounce';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from "@mui/material";

export default function SearchBar(props: {
  searchTerm: any;
  setSearchTerm: any;
  repoNames: any
}) {
  // Updating the search term state
  const handleChange = (event, value: string) => {
    props.setSearchTerm(value);
  console.log('Printing OnChange Value', value)
  console.log('Printing setSearchTerm Value', props.searchTerm)}


  // const debounceOnChange = debounce(handleChange, 0)

  return (
    <div className={styles.searchBarWidth}>
      <Autocomplete freeSolo options={props.repoNames} renderInput={(params) => <TextField {...params} label="Search"/>} onChange={handleChange} />
    </div>
  );
}

