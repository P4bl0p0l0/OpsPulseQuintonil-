from fastapi import APIRouter

router = APIRouter()


@router.get("/manager")
def manager_dashboard():
    return {
        "report_pending": True,
        "open_events": 0,
        "pending_tasks": 0,
    }


@router.get("/executive")
def executive_dashboard():
    return {
        "restaurants": [],
        "kpi_scores": [],
        "alerts": [],
    }