from pydantic import BaseModel, EmailStr


class UserMeResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    restaurant_id: int | None
    is_active: bool