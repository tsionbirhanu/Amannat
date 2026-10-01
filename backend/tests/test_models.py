import random

from sqlmodel import Session, select

from app.database import engine
from app.models import Worker


def test_worker_crud():
    # Random phone so leftover rows from earlier runs can't collide on the unique index
    phone = f"+{random.randint(1000000000, 9999999999)}"

    # Setup session
    with Session(engine) as session:
        # Create
        worker = Worker(phone=phone, languages="am,en")
        session.add(worker)
        session.commit()
        session.refresh(worker)

        assert worker.id is not None
        assert worker.phone == phone

        # Read
        fetched_worker = session.exec(
            select(Worker).where(Worker.phone == phone)
        ).first()
        assert fetched_worker is not None
        assert fetched_worker.id == worker.id

        # Delete
        session.delete(fetched_worker)
        session.commit()

        # Verify deletion
        deleted_worker = session.exec(
            select(Worker).where(Worker.phone == phone)
        ).first()
        assert deleted_worker is None
