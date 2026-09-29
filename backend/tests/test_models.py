from sqlmodel import Session, select

from app.database import engine
from app.models import Worker


def test_worker_crud():
    # Setup session
    with Session(engine) as session:
        # Create
        worker = Worker(phone="+1234567890", languages="am,en")
        session.add(worker)
        session.commit()
        session.refresh(worker)

        assert worker.id is not None
        assert worker.phone == "+1234567890"

        # Read
        fetched_worker = session.exec(
            select(Worker).where(Worker.phone == "+1234567890")
        ).first()
        assert fetched_worker is not None
        assert fetched_worker.id == worker.id

        # Delete
        session.delete(fetched_worker)
        session.commit()

        # Verify deletion
        deleted_worker = session.exec(
            select(Worker).where(Worker.phone == "+1234567890")
        ).first()
        assert deleted_worker is None
