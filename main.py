from fastapi import FastAPI, HTTPException
from app.services.database import getBooks
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"]
)

@app.get('/api/books')
def requestBooks(type='all', availability='all', language='all'):
    try:
        books = getBooks(type, availability, language)
        return books
    except ConnectionError:
        raise HTTPException(
            status_code=503,
        )
    except Exception:
        raise HTTPException(
            status_code=500
        )

