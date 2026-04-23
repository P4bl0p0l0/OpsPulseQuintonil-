from fastapi import APIRouter

router = APIRouter()


@router.post("/login")
def login():
    return {"message": "login endpoint pending"}


@router.get("/me")
def me():
    return {"message": "me endpoint pending"}