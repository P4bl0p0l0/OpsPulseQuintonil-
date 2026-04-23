from fastapi import APIRouter

router = APIRouter()


@router.post("")
def create_daily_report():
    return {"message": "create daily report"}


@router.get("")
def list_daily_reports():
    return {"items": []}