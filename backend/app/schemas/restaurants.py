from pydantic import BaseModel
from typing import Optional

class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    rating: Optional[float] = 0.0
    image_url: Optional[str] = None

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    rating: Optional[float] = None
    image_url: Optional[str] = None

class RestaurantResponse(RestaurantBase):
    id: int

    class Config:
        from_attributes = True
