import React from "react";
import Image from "next/image";
import styles from "../components/treeView.module.css";
import magnifyingGlass from "./images/magnifying-glass.svg";


export default function SearchBar() {
    return (
            <div className={styles.searchBar}>
                <input type="text" placeholder="Search Repository..." />
                <Image src={magnifyingGlass}  width={24} height={26}/>
                
            </div>

    
    )
}