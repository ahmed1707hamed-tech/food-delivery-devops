from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database.database import Base

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, index=True, nullable=True)
    rating = Column(Float, default=0.0)
    image_url = Column(String, nullable=True)

    menu_items = relationship("MenuItem", back_populates="restaurant", cascade="all, delete-orphan")
