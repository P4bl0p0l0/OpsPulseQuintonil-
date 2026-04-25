from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import create_user, list_users

router = APIRouter()


@router.post("", response_model=UserResponse)
def create_user_endpoint(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("master_admin", "owner", "general_director")
    ),
):
    return create_user(db, payload)


@router.get("", response_model=list[UserResponse])
def list_users_endpoint(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_roles("master_admin", "owner", "general_director")
    ),
):
    return list_users(db)