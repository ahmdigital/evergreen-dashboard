import React from 'react'
import styles from './Autofill.module.css'

export default function Autofill(props: { repoNames: any, searchTerm: any, setSearchTerm: any }) {
    return (
        <div className={styles.dropdown}>
            {
                props.repoNames.filter((repName) => {
                    const queryTerm = props.searchTerm.toLowerCase();
                    const repNameSmall = repName.toLowerCase();
                    return (
                        queryTerm &&
                        repNameSmall.includes(queryTerm) &&
                        repNameSmall !== queryTerm
                    );
                }).slice(0, 6).map((repName) => (
                    <div onClick={() => props.setSearchTerm(repName)} key={repName} className={styles.dropdownRow}>{repName}</div>
                ))
            }
        </div>
    )
}
