import React from "react";
import Image from "next/image";
import styles from "./SearchBar.module.css";
import magnifyingGlass from "./images/magnifying-glass.svg";
import Autofill from "./Autofill";

export default function SearchBar(props: {
  searchTerm: any;
  setSearchTerm: any;
  repoNames: any
}) {
  return (
    <div className={styles.searchBarWidth}>
      <div className={styles.searchBar}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Search..."
          value={props.searchTerm}
          onChange={(e) => props.setSearchTerm(e.target.value)}
        />
        <Image onClick={() => props.setSearchTerm(props.searchTerm)} alt="Search Icon" src={magnifyingGlass} width={24} height={26} />
      </div>
      <Autofill repoNames={props.repoNames} searchTerm={props.searchTerm} setSearchTerm={props.setSearchTerm}></Autofill>
    </div>
  );
}
