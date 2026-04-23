from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.sql import func
from app.db.session import Base


class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_date = Column(Date, nullable=False)
    shift = Column(String(50), nullable=True)
    staff_status = Column(String(50), nullable=True)
    sales_amount = Column(Numeric(12, 2), nullable=True)
    incidents_summary = Column(Text, nullable=True)
    inventory_issues = Column(Text, nullable=True)
    maintenance_issues = Column(Text, nullable=True)
    cleanliness_status = Column(String(50), nullable=True)
    day_status = Column(String(20), nullable=False)
    general_comments = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())