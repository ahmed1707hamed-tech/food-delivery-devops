from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.users import User
from app.schemas.users import UserResponse, UserUpdate
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("", response_model=UserResponse)
def update_profile(user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.address is not None:
        current_user.address = user_update.address
    if user_update.phone is not None:
        current_user.phone = user_update.phone
    if user_update.email is not None:
        current_user.email = user_update.email
    
    # We won't update password here for simplicity, but could be added
    
    db.commit()
    db.refresh(current_user)
    return current_user
