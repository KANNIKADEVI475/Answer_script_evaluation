from sqlalchemy import Column, Integer, String, DateTime
from database.database import Base
from datetime import datetime
from sqlalchemy import Text


class Evaluation(Base):

    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)

    student_name = Column(String)

    register_number = Column(String)

    filename = Column(String)

    total_marks = Column(String)      

    evaluation_data = Column(Text)
    uploaded_at = Column(DateTime, default=datetime.utcnow)