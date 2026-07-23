from pydantic import BaseModel
from typing import Optional

class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    image_url: Optional[str] = None

class MenuItemCreate(MenuItemBase):
    restaurant_id: int

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None

class MenuItemResponse(MenuItemBase):
    id: int
    restaurant_id: int

    class Config:
        from_attributes = True
