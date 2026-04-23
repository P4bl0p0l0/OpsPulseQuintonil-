from sqlalchemy.orm import Session

from app.db.session import Base, engine, SessionLocal
from app.models import Restaurant, User
from app.core.security import hash_password


def init_db():
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        restaurant = db.query(Restaurant).filter(Restaurant.code == "QUINTONIL").first()
        if not restaurant:
            restaurant = Restaurant(
                name="Quintonil",
                code="QUINTONIL",
                city="Ciudad de México",
                is_active=True,
            )
            db.add(restaurant)
            db.commit()
            db.refresh(restaurant)

        admin_user = db.query(User).filter(User.email == "admin@opspulsequintonil.com").first()
        if not admin_user:
            admin_user = User(
                restaurant_id=restaurant.id,
                full_name="Administrador OpsPulse",
                email="admin@opspulsequintonil.com",
                password_hash=hash_password("Admin12345!"),
                role="superadmin",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()

    finally:
        db.close()


if __name__ == "__main__":
    init_db()