from pydantic import BaseModel, EmailStr


class UserMeResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    restaurant_id: int | None
    is_active: bool


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str
    restaurant_id: int | None = None


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    restaurant_id: int | None
    is_active: bool
    must_change_password: bool

    class Config:
        from_attributes = True