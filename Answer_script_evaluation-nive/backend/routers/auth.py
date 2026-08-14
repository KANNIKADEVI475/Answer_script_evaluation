from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.get("/")
def auth():
    return {
        "message": "Authentication Module"
    }