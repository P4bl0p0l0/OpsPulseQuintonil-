from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.schemas.daily_report import DailyReportCreate, DailyReportResponse
from app.services.daily_report_service import (
    create_daily_report,
    get_reports_by_restaurant,
    get_reports_by_user,
)

router = APIRouter()


@router.post("", response_model=DailyReportResponse)
def create_daily_report_endpoint(
    payload: DailyReportCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_daily_report(db, payload, current_user)


@router.get("/me", response_model=list[DailyReportResponse])
def list_my_daily_reports(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_reports_by_user(db, current_user.id)


@router.get("", response_model=list[DailyReportResponse])
def list_daily_reports(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_reports_by_restaurant(db, current_user.restaurant_id)