from fastapi import APIRouter
from schemas.faculty_schema import FacultyLogin
from services.faculty_service import authenticate

router = APIRouter(
    prefix="/faculty",
    tags=["Faculty"]
)


@router.post("/login")
def login(data: FacultyLogin):

    if authenticate(data.faculty_id, data.password):

        return {
            "status": "success",
            "message": "Login Successful"
        }

    return {
        "status": "failed",
        "message": "Invalid Credentials"
    }