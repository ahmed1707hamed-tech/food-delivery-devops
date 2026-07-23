from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.menu import MenuItem
from app.models.restaurants import Restaurant
from app.schemas.menu import MenuItemCreate, MenuItemUpdate, MenuItemResponse
from app.utils.dependencies import get_current_admin_user

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/{restaurant_id}", response_model=List[MenuItemResponse])
def get_menu_items(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return db.query(MenuItem).filter(MenuItem.restaurant_id == restaurant_id).all()

@router.post("", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
def create_menu_item(item: MenuItemCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == item.restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    new_item = MenuItem(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{id}", response_model=MenuItemResponse)
def update_menu_item(id: int, item_update: MenuItemUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    item = db.query(MenuItem).filter(MenuItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    update_data = item_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
        
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    item = db.query(MenuItem).filter(MenuItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db.delete(item)
    db.commit()
    return None
