import React, { useEffect, useRef, useState } from 'react'
import styles from './Autofill.module.css'

export default function Autofill(props: { repoNames: any, searchTerm: any, setSearchTerm: any, display: any, setDisplay: any }) {

    // State for suggestions/options
    const [suggestions, setSuggestions] = useState<string[]>(props.repoNames);
    const setSearchVal = (val: string) => {
        props.setSearchTerm(val);
        props.setDisplay(false);
    }

    const wrapperRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)

        return (() => {
            document.removeEventListener("mousedown", handleClickOutside)
        });
    }, []);

    const handleClickOutside = (e) => {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            props.setDisplay(false)
        }
    }

    return (
        <div ref={wrapperRef} >
            <div className={styles.dropdown}>
                {
                    props.display && (
                        <div className={styles.dropdown}>
                            {
                                suggestions.filter((name) => name.indexOf(props.searchTerm.toLowerCase()) > -1).map((repName) => {
                                    return <div className={styles.option} onClick={() => setSearchVal(repName)} key={repName} tabIndex="0">
                                        {repName}
                                    </div>
                                })
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}
