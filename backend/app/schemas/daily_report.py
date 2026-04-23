from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel


class DailyReportCreate(BaseModel):
    report_date: date
    shift: str | None = None
    staff_status: str | None = None
    sales_amount: Decimal | None = None
    incidents_summary: str | None = None
    inventory_issues: str | None = None
    maintenance_issues: str | None = None
    cleanliness_status: str | None = None
    day_status: str
    general_comments: str | None = None


class DailyReportResponse(BaseModel):
    id: int
    restaurant_id: int
    created_by: int
    report_date: date
    shift: str | None
    staff_status: str | None
    sales_amount: Decimal | None
    incidents_summary: str | None
    inventory_issues: str | None
    maintenance_issues: str | None
    cleanliness_status: str | None
    day_status: str
    general_comments: str | None
    submitted_at: datetime | None

    class Config:
        from_attributes = True