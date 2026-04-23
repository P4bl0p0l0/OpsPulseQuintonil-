from fastapi import APIRouter

router = APIRouter()


@router.post("")
def create_weekly_report():
    return {"message": "create weekly report"}


@router.get("")
def list_weekly_reports():
    return {"items": []}