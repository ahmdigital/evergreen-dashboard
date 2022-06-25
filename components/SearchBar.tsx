import React from "react";
import Image from "next/image";
import styles from "../components/treeView.module.css";
import magnifyingGlass from "./images/magnifying-glass.svg";


export default function SearchBar(props: {searchTerm: any, setSearchTerm: any}) {
    //const [searchTerm, setSearchTerm] = useState<string>('')

    return (
            <div className={styles.searchBar}>
                <input className={styles.searchBar} type="text" placeholder="Search Repository..." value={props.searchTerm} onChange={e => props.setSearchTerm(e.target.value)}/>

                <Image alt='Search Icon' src={magnifyingGlass}  width={24} height={26}/>
            </div>

    )
}
