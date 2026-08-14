from pydantic import BaseModel

class FacultyLogin(BaseModel):
    faculty_id: str
    password: str