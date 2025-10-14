import styles from './Home.module.css'
import Filters from '../Filters/Filters'
import SearchBar from '../SearchBar/SearchBar'
import BookList from '../BookList/BookList'
import { useState, useEffect } from 'react'
import {booksContext, filtersContext, searchExpressionContext} from '../contexts.js'

function Home() {

    const [books, setBooks] = useState([]);
    const [appliedFilters, setAppliedFilters] = useState(['all', 'all', 'all']);
    const [searchExpression, setSearchExpression] = useState('')

    useEffect(()=>{
        const loadPage = async()=>{
            try{
                const allBooksRes = await fetch(`http://127.0.0.1:8000/api/books`)

                if (!allBooksRes.ok){
                    throw new Error("Error accessing backend server")
                }

                const data = await allBooksRes.json();
                setBooks(data);
            }
            catch(err){
                console.log("ERROR IN LOADING BOOKS, ", err);
            }
        }

        loadPage();
    }, [])

    return (
        <>
            <div className={styles.header}>
                <h1>Library Management System</h1>
            </div>

            <div className={styles.content}>
                <filtersContext.Provider value={[appliedFilters, setAppliedFilters]}>
                    <Filters />
                </filtersContext.Provider>

                <div className={styles.books}>

                    <booksContext.Provider value={[books, setBooks]}>

                        <searchExpressionContext.Provider value={[searchExpression, setSearchExpression]}>
                        <filtersContext.Provider value={[appliedFilters, setAppliedFilters]}>
                            <SearchBar />
                        </filtersContext.Provider>
                        </searchExpressionContext.Provider>

                            <BookList />

                    </booksContext.Provider>
                    
                </div>
            </div>
        </>
    )
}

export default Home