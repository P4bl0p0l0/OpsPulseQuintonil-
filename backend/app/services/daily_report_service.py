from sqlalchemy.orm import Session
from app.models.daily_report import DailyReport


def create_daily_report(db: Session, payload, current_user):
    report = DailyReport(
        restaurant_id=current_user.restaurant_id,
        created_by=current_user.id,
        report_date=payload.report_date,
        shift=payload.shift,
        staff_status=payload.staff_status,
        sales_amount=payload.sales_amount,
        incidents_summary=payload.incidents_summary,
        inventory_issues=payload.inventory_issues,
        maintenance_issues=payload.maintenance_issues,
        cleanliness_status=payload.cleanliness_status,
        day_status=payload.day_status,
        general_comments=payload.general_comments,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_reports_by_user(db: Session, user_id: int):
    return (
        db.query(DailyReport)
        .filter(DailyReport.created_by == user_id)
        .order_by(DailyReport.report_date.desc(), DailyReport.id.desc())
        .all()
    )


def get_reports_by_restaurant(db: Session, restaurant_id: int):
    return (
        db.query(DailyReport)
        .filter(DailyReport.restaurant_id == restaurant_id)
        .order_by(DailyReport.report_date.desc(), DailyReport.id.desc())
        .all()
    )