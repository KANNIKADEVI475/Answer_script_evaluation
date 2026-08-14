from pydantic import BaseModel

class Faculty(BaseModel):
    faculty_id: str
    password: str