import styles from './SearchBar.module.css';
import { searchExpressionContext, booksContext, filtersContext } from '../contexts';
import { useContext, useEffect } from 'react';

function SearchBar() {
    const [searchExpression, setSearchExpression] = useContext(searchExpressionContext);
    const [books, setBooks] = useContext(booksContext);
    const [appliedFilters, setAppliedFilters] = useContext(filtersContext);

    const handleSearchChange = (event)=>{
        setSearchExpression(event.target.value);
    }

    const getMatchingBooks = async() =>{
        const type = appliedFilters[0]
        const availability = appliedFilters[1]
        const language = appliedFilters[2]
        try{
            const matchingBooksRes = await fetch(`http://127.0.0.1:8000/api/books?type=${type}&availability=${availability}&language=${language}`)

            if (!matchingBooksRes.ok){
                throw new Error("Error accessing backend server")
            }

            const data = await matchingBooksRes.json();
            
            if (!searchExpression.trim()){
                setBooks(data);
                return
            }

            const regex = new RegExp(searchExpression, 'i');
            const filteredBooks = data.filter(book => {
                const title = book[1];
                const author = book[2];
                return regex.test(title) || regex.test(author)
            });
            setBooks(filteredBooks);
        }
        catch(err){
            console.log("ERROR GETTING MATCHING BOOKS", err)
        }
    }

    return (
        <div className={styles.container}>
            <input type="text" placeholder='Search for Book Title or Author Name' onChange={handleSearchChange}/>
            <button onClick={getMatchingBooks}>Search</button>
        </div>
    )
}

export default SearchBar