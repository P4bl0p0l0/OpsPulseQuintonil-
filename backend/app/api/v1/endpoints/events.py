from fastapi import APIRouter

router = APIRouter()


@router.post("")
def create_event():
    return {"message": "create event"}


@router.get("")
def list_events():
    return {"items": []}