from fastapi import Depends, FastAPI, HTTPException, Header, status
from jwt import decode
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlite3 import IntegrityError
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT
from api.database import Base, SessionLocal, engine
from api.models import TaskModel, UserModel
from api.schemas import TaskBase, TokenResponse, UserLoginSchema, UserRegister

# Create database tables
Base.metadata.create_all(engine)

# Create FastAPI instance
app = FastAPI()

# Allow CORS
origins = ["http://localhost:3000"]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a passlib CryptContext instance
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_session():
    """
    Create a session instance
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def verify_password(plain_password, hashed_password):
    """
    Verify a plain password against a stored hash.
    """
    print("Plain"+plain_password)
    print("Hashed"+hashed_password)
    print(pwd_context.verify(plain_password, hashed_password))
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """
    Hash a password for storing.
    """
    return pwd_context.hash(password)


@app.get("/tasks",  tags=["tasks"])
async def get_tasks(session: Session = Depends(get_session)) -> dict:
    """
    Get all tasks
    """
    tasks = session.query(TaskModel).all()
    return {"results": tasks, "message": "Tasks found successfully", "total": len(tasks)}


@app.get("/tasks/{id}", tags=["tasks"])
async def read_task(id: int, session: Session = Depends(get_session)):
    """
    Get a task by id
    """
    task = session.query(TaskModel).get(id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"results": task, "message": "Task found successfully"}


@app.post("/tasks", status_code=status.HTTP_201_CREATED, tags=["tasks"])
async def create_task(task: TaskBase, session: Session = Depends(get_session)):
    """
    Create a new task
    """
    try:
        task_created = TaskModel(
            title=task.title, description=task.description, done=task.done,
            user_id=task.user_id
        )
        session.add(task_created)
        session.commit()
        session.refresh(task_created)
        print(task_created)
        return {"message": "Task created successfully"}
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(
            status_code=400, detail="Error creating task: " + str(e))
    except Exception as e:
        session.rollback()
        print("Error creating task:", e)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.put("/tasks/{id}", tags=["tasks"])
async def update_task(id: int, task: TaskBase, session: Session = Depends(get_session)):
    """
    Update a task by id
    """
    task_retrieved = session.query(TaskModel).get(id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task_data = task.dict(exclude_unset=True)
    for key, value in task_data.items():
        setattr(task_retrieved, key, value)

    session.commit()
    session.refresh(task_retrieved)

    return {"results": task_retrieved, "message": "Task updated successfully"}


@app.delete("/tasks/{id}", tags=["tasks"])
async def delete_task(id: int, session: Session = Depends(get_session)):
    """
    Delete a task by id
    """
    task = session.query(TaskModel).get(id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()

    return {"message": "Task deleted successfully"}


@app.post("/signup", tags=["auth"], status_code=status.HTTP_201_CREATED, response_model=None)
async def signup(user: UserRegister, session: Session = Depends(get_session)) -> dict:
    """
    Register a new user
    """
    db_user = session.query(UserModel).filter_by(email=user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    user.password = get_password_hash(user.password)
    new_user = UserModel(name=user.name, email=user.email,
                         password=user.password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return signJWT(user.email)


@app.post("/login", tags=["auth"], response_model=TokenResponse)
async def login(userRequest: UserLoginSchema, session: Session = Depends(get_session)):
    """
    Login a user
    """
    print(userRequest.email, userRequest.password)
    user = session.query(UserModel).filter_by(email=userRequest.email).first()
    if not user or not verify_password(userRequest.password, user.password):
        raise HTTPException(
            status_code=401, detail="Incorrect email or password")
    return signJWT(user.email)
