from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.restaurants import Restaurant
from app.schemas.restaurants import RestaurantCreate, RestaurantUpdate, RestaurantResponse
from app.utils.dependencies import get_current_admin_user

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])

@router.get("", response_model=List[RestaurantResponse])
def get_restaurants(db: Session = Depends(get_db)):
    return db.query(Restaurant).all()

@router.get("/{id}", response_model=RestaurantResponse)
def get_restaurant(id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@router.post("", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
def create_restaurant(restaurant: RestaurantCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    new_restaurant = Restaurant(**restaurant.model_dump())
    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)
    return new_restaurant

@router.put("/{id}", response_model=RestaurantResponse)
def update_restaurant(id: int, restaurant_update: RestaurantUpdate, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    update_data = restaurant_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(restaurant, key, value)
        
    db.commit()
    db.refresh(restaurant)
    return restaurant

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_restaurant(id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    db.delete(restaurant)
    db.commit()
    return None
