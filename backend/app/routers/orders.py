from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.orders import Order, OrderItem
from app.models.menu import MenuItem
from app.models.users import User
from app.schemas.orders import OrderCreate, OrderResponse, OrderUpdate
from app.utils.dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.is_admin:
        return db.query(Order).all()
    return db.query(Order).filter(Order.user_id == current_user.id).all()

@router.get("/{id}", response_model=OrderResponse)
def get_order(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
        
    return order

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_price = 0.0
    order_items = []
    
    for item in order_data.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item {item.menu_item_id} not found")
            
        total_price += menu_item.price * item.quantity
        order_items.append(OrderItem(
            menu_item_id=menu_item.id,
            quantity=item.quantity,
            price=menu_item.price
        ))
        
    new_order = Order(
        user_id=current_user.id,
        total_price=total_price,
        status="Pending",
        items=order_items
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.put("/{id}", response_model=OrderResponse)
def update_order_status(id: int, order_update: OrderUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin_user)):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.status = order_update.status
    db.commit()
    db.refresh(order)
    return order
