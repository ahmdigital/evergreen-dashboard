import React, { useState } from "react";
import Image from "next/image";
import styles from "./SearchBar.module.css";
import magnifyingGlass from "./images/magnifying-glass.svg";
import Autofill from "./Autofill";
import debounce from 'lodash.debounce';

export default function SearchBar(props: {
  searchTerm: any;
  setSearchTerm: any;
  repoNames: any
}) {

  const [display, setDisplay] = useState<boolean>(false);

  // Updating the search term state
  const updateSearch = e => props.setSearchTerm(e?.target?.value);

  const debounceOnChange = debounce(updateSearch, 600)

  return (
    <div className={styles.searchBarWidth}>
      <div className={styles.searchBar}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Search..."
          onClick={() => setDisplay(!display)}
          onChange={debounceOnChange}
        />
        <Image onClick={() => props.setSearchTerm(props.searchTerm)} alt="Search Icon" src={magnifyingGlass} width={24} height={26} />
      </div>
      {/* <Autofill repoNames={props.repoNames} searchTerm={props.searchTerm} setSearchTerm={props.setSearchTerm} display={display} setDisplay={setDisplay}></Autofill> */}
    </div>
  );
}
