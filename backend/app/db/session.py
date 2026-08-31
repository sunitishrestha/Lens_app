# asynchronous(donot do in same time) connection between your Python application and PostgreSQL database using SQLAlchemy.
# Engine = manages database connections
# Session = used to perform(Execute queries) database operations
#SQLAlchemy actually give you--->Core, ORM
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@db:5432/lens_db"

engine = create_async_engine(DATABASE_URL, echo=True)  #creates your asynchronous SQLAlchemy engine.
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with async_session() as session:
        yield session

