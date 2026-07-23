from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.menu import MenuItemResponse

class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    price: float
    menu_item: Optional[MenuItemResponse] = None

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    pass

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: str # Pending, Preparing, On The Way, Delivered

class OrderResponse(OrderBase):
    id: int
    user_id: int
    status: str
    total_price: float
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
