from fastapi import FastAPI, HTTPException
from app.services.database import getBooks, issue_book, get_issued_books_for_user, return_book, get_all_issued_books, add_book, remove_book
from fastapi.middleware.cors import CORSMiddleware
from app.routes.authRoutes import router as auth_router
import pandas as pd
from fastapi.responses import StreamingResponse
import io

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
    
@app.get("/api/admin/issued-books", tags=["Admin"])
async def get_all_issues():
    try:
        issues = get_all_issued_books()
        return [{"user_name": i[0], "user_email": i[1], "book_title": i[2], "book_author": i[3]} for i in issues]
    except Exception:
        raise HTTPException(status_code=500, detail="Could not fetch issued books.")

@app.get("/api/admin/issued-books/download", tags=["Admin"])
async def download_issues_report():
    try:
        issues = get_all_issued_books()
        df = pd.DataFrame(issues, columns=["User Name", "User Email", "Book Title", "Author"])
        
        output = io.BytesIO()
        writer = pd.ExcelWriter(output, engine='openpyxl')
        df.to_excel(writer, index=False, sheet_name='Issued Books')
        writer.close()
        output.seek(0)

        headers = {
            'Content-Disposition': 'attachment; filename="issued_books_report.xlsx"'
        }
        return StreamingResponse(output, headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {e}")

@app.post("/api/admin/books", tags=["Admin"])
async def create_book(book_data: dict):
    try:
        result = add_book(
            title=book_data.get("title"),
            author=book_data.get("author"),
            book_type=book_data.get("type", "Unknown"),
            language=book_data.get("language", "English"),
            total_copies=book_data.get("total_copies", 1)
        )
        return result
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to add book.")

@app.delete("/api/admin/books/{book_id}", tags=["Admin"])
async def delete_book(book_id: int):
    try:
        return remove_book(book_id)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to remove book.")