from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    daily_reports,
    weekly_reports,
    events,
    dashboard,
    users,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(daily_reports.router, prefix="/daily-reports", tags=["daily-reports"])
api_router.include_router(weekly_reports.router, prefix="/weekly-reports", tags=["weekly-reports"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])