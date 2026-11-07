from sqlmodel import Session, create_engine

from app.config import DATABASE_URL

# Neon closes idle connections, and hosts like Render's free plan sleep between
# requests. pool_pre_ping checks a pooled connection before use (reconnecting if
# it was dropped) and pool_recycle retires connections before Neon times them out.
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True, pool_recycle=300)


def get_session():
    with Session(engine) as session:
        yield session
