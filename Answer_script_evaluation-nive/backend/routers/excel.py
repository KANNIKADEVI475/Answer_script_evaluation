from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from services.excel_service import export_excel

router = APIRouter(
    prefix="/excel",
    tags=["Excel"]
)


@router.get("/download")
def download_excel():

    excel = export_excel()

    return StreamingResponse(

        excel,

        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        headers={
            "Content-Disposition":
            "attachment; filename=Student_Section_Wise_Marks.xlsx"
        }

    )