from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.auth.services import get_google_user_info, create_access_token
from app.services.database import addUser

class AuthCode(BaseModel):
    code: str

router = APIRouter()

@router.post("/google/callback")
async def google_callback(auth_code: AuthCode):
    try:
        code = auth_code.code
        user_info = await get_google_user_info(code)

        user_email = user_info.get("email")
        user_name = user_info.get("name")

        if not user_email:
            raise HTTPException(status_code=400, detail="Email not found in Google profile")

        addUser(name=user_name, email=user_email)
        access_token = create_access_token(data={"sub": user_email})
        
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": user_info
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")