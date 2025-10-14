from fastapi import FastAPI, HTTPException
from app.services.database import getBooks, issue_book, get_issued_books_for_user, return_book
from fastapi.middleware.cors import CORSMiddleware
from app.routes.authRoutes import router as auth_router

app = FastAPI()

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"]
)

app.include_router(auth_router, prefix="/api/auth")

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

@app.post('/api/issues')
async def create_issue(issue_data: dict):
    try:
        book_id = issue_data.get("book_id")
        user_email = issue_data.get("user_email")

        if not book_id or not user_email:
            raise HTTPException(
                status_code=422,
                detail="Missing 'book_id' or 'user_email' in request body."
            )

        result = issue_book(
            book_id=book_id, 
            user_email=user_email
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=409,
            detail="Could not issue book. It may already be issued to this user."
        )
    
@app.get('/api/issues')
async def get_issued_books(user_email: str):
    try:
        books = get_issued_books_for_user(user_email)
        return [{"book_id": b[0], "name": b[1], "author": b[2]} for b in books]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch issued books.")

@app.delete('/api/issues')
async def process_return(return_data: dict):
    try:
        book_id = return_data.get("book_id")
        user_email = return_data.get("user_email")
        if not book_id or not user_email:
            raise HTTPException(status_code=422, detail="Missing data.")
        
        result = return_book(book_id=book_id, user_email=user_email)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An internal server error occurred.")