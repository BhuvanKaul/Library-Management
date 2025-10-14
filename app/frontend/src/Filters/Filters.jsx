import styles from './Filters.module.css';
import { filtersContext } from '../contexts';
import { useContext } from 'react';

function Filters() {
    const [appliedFilters, setAppliedFilters] = useContext(filtersContext);
    
    const handleTypeChange = (event) => {
        setAppliedFilters(prevFilters => 
            prevFilters.map((filter, index) => 
                index === 0 ? event.target.value : filter
            )
        );
    };

    const handleAvilabilityChange = (event)=>{
        setAppliedFilters(prevFilters => 
            prevFilters.map((filter, index)=>
                index === 1? event.target.value : filter
            )
        );
    };

    const handleLangChange = (event)=>{
        setAppliedFilters(prevFilters => 
            prevFilters.map((filter, index)=>
                index === 2? event.target.value : filter
            )
        );
    };

    return (
        <div className={styles.container}>
            <h2>Filters</h2>

            <div className={styles.filterList}>

                <div className={styles.filterGroup}>
                    <label htmlFor="bookType">Type</label>
                    <select name="BookType" id="bookType" onChange={handleTypeChange}>
                        <option value="all">All Types</option>
                        <option value="educational">Educational</option>
                        <option value="novel">Novel</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="bookAvailable">Availability</label>
                    <select name="BookAvailable" id="bookAvailable" onChange={handleAvilabilityChange}>
                        <option value="all">All Books</option>
                        <option value="yes">Available Only</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="bookLanguage">Language</label>
                    <select name="BookLanguage" id="bookLanguage" onChange={handleLangChange}>
                        <option value="all">All Languages</option>
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                    </select>
                </div>

            </div>
        </div>
    )
}

export default Filters
