from fastapi import FastAPI, HTTPException, status, Depends, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional, List, Annotated
from datetime import datetime, timezone, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

load_dotenv()

app = FastAPI(title="GravelMatch API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Dev locale
        "https://*.vercel.app",   # Vercel domains
        os.environ.get("FRONTEND_URL", "*")  # Dominio custom se hai
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
routes_collection = db["routes"]
matches_collection = db["matches"]
messages_collection = db["messages"]
swipes_collection = db["swipes"]
notifications_collection = db["notifications"]

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET")
)

# Security
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Pydantic Models
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    experience_level: Optional[str] = None
    avg_distance: Optional[int] = None
    preferred_zone: Optional[str] = None
    location: Optional[str] = None
    age: Optional[int] = None

class DiscoverFilters(BaseModel):
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    min_distance: Optional[int] = None
    max_distance: Optional[int] = None
    experience_level: Optional[str] = None
    zone: Optional[str] = None

class RouteCreate(BaseModel):
    title: str
    description: Optional[str] = None
    distance: float
    elevation: Optional[int] = None
    difficulty: str
    start_point: dict
    end_point: Optional[dict] = None
    waypoints: Optional[List[dict]] = []
    image_url: Optional[str] = None
    tags: Optional[List[str]] = []

class SwipeAction(BaseModel):
    target_user_id: str
    action: str

class MessageCreate(BaseModel):
    match_id: str
    content: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class NotificationSubscription(BaseModel):
    endpoint: str
    keys: dict

# Helper functions
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "name": user.get("name"),
        "bio": user.get("bio"),
        "profile_picture": user.get("profile_picture"),
        "experience_level": user.get("experience_level"),
        "avg_distance": user.get("avg_distance"),
        "preferred_zone": user.get("preferred_zone"),
        "location": user.get("location"),
        "age": user.get("age"),
        "profile_completed": user.get("profile_completed", False),
        "created_at": user.get("created_at").isoformat() if user.get("created_at") else None
    }

def serialize_route(route: dict) -> dict:
    return {
        "id": str(route["_id"]),
        "title": route.get("title"),
        "description": route.get("description"),
        "distance": route.get("distance"),
        "elevation": route.get("elevation"),
        "difficulty": route.get("difficulty"),
        "start_point": route.get("start_point"),
        "end_point": route.get("end_point"),
        "waypoints": route.get("waypoints", []),
        "image_url": route.get("image_url"),
        "tags": route.get("tags", []),
        "user_id": str(route.get("user_id")),
        "user_name": route.get("user_name"),
        "likes": route.get("likes", 0),
        "created_at": route.get("created_at").isoformat() if route.get("created_at") else None
    }

async def get_current_user(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = users_collection.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Auth Endpoints
@app.post("/api/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = users_collection.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = {
        "email": user_data.email,
        "password": get_password_hash(user_data.password),
        "name": user_data.name,
        "profile_completed": False,
        "created_at": datetime.now(timezone.utc)
    }
    users_collection.insert_one(new_user)
    
    access_token = create_access_token(data={"sub": user_data.email})
    return TokenResponse(access_token=access_token)

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    user = users_collection.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user_data.email})
    return TokenResponse(access_token=access_token)

@app.get("/api/auth/me")
async def get_me(current_user = Depends(get_current_user)):
    return serialize_user(current_user)

# Profile Endpoints
@app.put("/api/profile")
async def update_profile(profile: UserProfile, current_user = Depends(get_current_user)):
    update_data = {k: v for k, v in profile.model_dump().items() if v is not None}
    
    if update_data:
        required_fields = ["experience_level", "avg_distance", "preferred_zone"]
        current_data = {**current_user, **update_data}
        profile_completed = all(current_data.get(f) for f in required_fields)
        update_data["profile_completed"] = profile_completed
        
        users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_data}
        )
    
    updated_user = users_collection.find_one({"_id": current_user["_id"]})
    return serialize_user(updated_user)

# Image Upload Endpoint
@app.post("/api/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = Query(default="gravelmatch"),
    current_user = Depends(get_current_user)
):
    """Upload image to Cloudinary"""
    try:
        # Read file content
        contents = await file.read()
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            contents,
            folder=folder,
            resource_type="image",
            transformation=[
                {"width": 1200, "height": 1200, "crop": "limit"},
                {"quality": "auto:good"},
                {"fetch_format": "auto"}
            ]
        )
        
        return {
            "success": True,
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "width": result.get("width"),
            "height": result.get("height")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/api/upload/profile-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """Upload and set profile picture"""
    try:
        contents = await file.read()
        
        result = cloudinary.uploader.upload(
            contents,
            folder="gravelmatch/profiles",
            resource_type="image",
            transformation=[
                {"width": 500, "height": 500, "crop": "fill", "gravity": "face"},
                {"quality": "auto:good"},
                {"fetch_format": "auto"}
            ]
        )
        
        # Update user profile
        users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"profile_picture": result["secure_url"]}}
        )
        
        return {
            "success": True,
            "url": result["secure_url"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# Routes Endpoints
@app.post("/api/routes")
async def create_route(route_data: RouteCreate, current_user = Depends(get_current_user)):
    new_route = {
        **route_data.model_dump(),
        "user_id": current_user["_id"],
        "user_name": current_user.get("name"),
        "likes": 0,
        "created_at": datetime.now(timezone.utc)
    }
    result = routes_collection.insert_one(new_route)
    new_route["_id"] = result.inserted_id
    return serialize_route(new_route)

@app.get("/api/routes")
async def get_routes(
    difficulty: Optional[str] = None,
    min_distance: Optional[float] = None,
    max_distance: Optional[float] = None,
    limit: int = Query(default=20, le=100)
):
    query = {}
    if difficulty:
        query["difficulty"] = difficulty
    if min_distance is not None:
        query["distance"] = {"$gte": min_distance}
    if max_distance is not None:
        if "distance" in query:
            query["distance"]["$lte"] = max_distance
        else:
            query["distance"] = {"$lte": max_distance}
    
    routes = routes_collection.find(query).sort("created_at", -1).limit(limit)
    return [serialize_route(r) for r in routes]

@app.get("/api/routes/{route_id}")
async def get_route(route_id: str):
    route = routes_collection.find_one({"_id": ObjectId(route_id)})
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return serialize_route(route)

@app.get("/api/routes/user/me")
async def get_my_routes(current_user = Depends(get_current_user)):
    routes = routes_collection.find({"user_id": current_user["_id"]}).sort("created_at", -1)
    return [serialize_route(r) for r in routes]

@app.post("/api/routes/{route_id}/like")
async def like_route(route_id: str, current_user = Depends(get_current_user)):
    routes_collection.update_one(
        {"_id": ObjectId(route_id)},
        {"$inc": {"likes": 1}}
    )
    return {"success": True}

# Discovery/Matching Endpoints with Advanced Filters
@app.get("/api/discover")
async def discover_users(
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
    min_distance: Optional[int] = None,
    max_distance: Optional[int] = None,
    experience_level: Optional[str] = None,
    zone: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """Discover users with advanced filters"""
    # Get users this user has already swiped on
    swiped = swipes_collection.find({"user_id": current_user["_id"]})
    swiped_ids = [s["target_user_id"] for s in swiped]
    swiped_ids.append(current_user["_id"])
    
    # Base query
    query = {
        "_id": {"$nin": swiped_ids},
        "profile_completed": True
    }
    
    # Age filter
    if min_age is not None:
        query["age"] = {"$gte": min_age}
    if max_age is not None:
        if "age" in query:
            query["age"]["$lte"] = max_age
        else:
            query["age"] = {"$lte": max_age}
    
    # Distance filter (avg_distance preference)
    if min_distance is not None:
        query["avg_distance"] = {"$gte": min_distance}
    if max_distance is not None:
        if "avg_distance" in query:
            query["avg_distance"]["$lte"] = max_distance
        else:
            query["avg_distance"] = {"$lte": max_distance}
    
    # Experience level filter
    if experience_level:
        query["experience_level"] = experience_level
    elif current_user.get("experience_level"):
        # Default: match similar levels
        levels = {
            "beginner": ["beginner", "intermediate"],
            "intermediate": ["beginner", "intermediate", "expert"],
            "expert": ["intermediate", "expert"]
        }
        query["experience_level"] = {"$in": levels.get(current_user["experience_level"], [])}
    
    # Zone filter
    if zone:
        query["preferred_zone"] = zone
    
    users = users_collection.find(query).limit(20)
    return [serialize_user(u) for u in users]

@app.post("/api/swipe")
async def swipe(action: SwipeAction, current_user = Depends(get_current_user)):
    target_id = ObjectId(action.target_user_id)
    
    # Record swipe
    swipes_collection.insert_one({
        "user_id": current_user["_id"],
        "target_user_id": target_id,
        "action": action.action,
        "created_at": datetime.now(timezone.utc)
    })
    
    # Check for match if liked
    match = False
    match_id = None
    if action.action == "like":
        reverse_swipe = swipes_collection.find_one({
            "user_id": target_id,
            "target_user_id": current_user["_id"],
            "action": "like"
        })
        
        if reverse_swipe:
            # It's a match!
            match_doc = {
                "users": [current_user["_id"], target_id],
                "created_at": datetime.now(timezone.utc)
            }
            result = matches_collection.insert_one(match_doc)
            match = True
            match_id = str(result.inserted_id)
            
            # Create notification for both users
            target_user = users_collection.find_one({"_id": target_id})
            notifications_collection.insert_many([
                {
                    "user_id": current_user["_id"],
                    "type": "match",
                    "title": "Nuovo Match!",
                    "body": f"Tu e {target_user.get('name', 'un rider')} vi siete piaciuti!",
                    "data": {"match_id": match_id},
                    "read": False,
                    "created_at": datetime.now(timezone.utc)
                },
                {
                    "user_id": target_id,
                    "type": "match",
                    "title": "Nuovo Match!",
                    "body": f"Tu e {current_user.get('name', 'un rider')} vi siete piaciuti!",
                    "data": {"match_id": match_id},
                    "read": False,
                    "created_at": datetime.now(timezone.utc)
                }
            ])
    
    return {"success": True, "match": match, "match_id": match_id}

# Matches Endpoints
@app.get("/api/matches")
async def get_matches(current_user = Depends(get_current_user)):
    matches = matches_collection.find({"users": current_user["_id"]})
    result = []
    
    for m in matches:
        other_user_id = [u for u in m["users"] if u != current_user["_id"]][0]
        other_user = users_collection.find_one({"_id": other_user_id})
        
        last_msg = messages_collection.find_one(
            {"match_id": m["_id"]},
            sort=[("created_at", -1)]
        )
        
        result.append({
            "id": str(m["_id"]),
            "user": serialize_user(other_user) if other_user else None,
            "last_message": {
                "content": last_msg["content"],
                "created_at": last_msg["created_at"].isoformat(),
                "sender_id": str(last_msg["sender_id"])
            } if last_msg else None,
            "created_at": m["created_at"].isoformat()
        })
    
    return result

# Chat Endpoints
@app.get("/api/chat/{match_id}")
async def get_messages(match_id: str, current_user = Depends(get_current_user)):
    match = matches_collection.find_one({"_id": ObjectId(match_id)})
    if not match or current_user["_id"] not in match["users"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    messages = messages_collection.find({"match_id": ObjectId(match_id)}).sort("created_at", 1)
    
    return [{
        "id": str(msg["_id"]),
        "content": msg["content"],
        "sender_id": str(msg["sender_id"]),
        "is_mine": msg["sender_id"] == current_user["_id"],
        "created_at": msg["created_at"].isoformat()
    } for msg in messages]

@app.post("/api/chat")
async def send_message(msg: MessageCreate, current_user = Depends(get_current_user)):
    match = matches_collection.find_one({"_id": ObjectId(msg.match_id)})
    if not match or current_user["_id"] not in match["users"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    new_msg = {
        "match_id": ObjectId(msg.match_id),
        "sender_id": current_user["_id"],
        "content": msg.content,
        "created_at": datetime.now(timezone.utc)
    }
    result = messages_collection.insert_one(new_msg)
    
    # Create notification for recipient
    other_user_id = [u for u in match["users"] if u != current_user["_id"]][0]
    notifications_collection.insert_one({
        "user_id": other_user_id,
        "type": "message",
        "title": f"Nuovo messaggio da {current_user.get('name', 'un rider')}",
        "body": msg.content[:50] + ("..." if len(msg.content) > 50 else ""),
        "data": {"match_id": msg.match_id},
        "read": False,
        "created_at": datetime.now(timezone.utc)
    })
    
    return {
        "id": str(result.inserted_id),
        "content": msg.content,
        "sender_id": str(current_user["_id"]),
        "is_mine": True,
        "created_at": new_msg["created_at"].isoformat()
    }

# Notifications Endpoints
@app.get("/api/notifications")
async def get_notifications(
    unread_only: bool = False,
    limit: int = Query(default=20, le=100),
    current_user = Depends(get_current_user)
):
    """Get user notifications"""
    query = {"user_id": current_user["_id"]}
    if unread_only:
        query["read"] = False
    
    notifications = notifications_collection.find(query).sort("created_at", -1).limit(limit)
    
    return [{
        "id": str(n["_id"]),
        "type": n["type"],
        "title": n["title"],
        "body": n["body"],
        "data": n.get("data", {}),
        "read": n["read"],
        "created_at": n["created_at"].isoformat()
    } for n in notifications]

@app.get("/api/notifications/unread-count")
async def get_unread_count(current_user = Depends(get_current_user)):
    """Get count of unread notifications"""
    count = notifications_collection.count_documents({
        "user_id": current_user["_id"],
        "read": False
    })
    return {"count": count}

@app.put("/api/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user = Depends(get_current_user)):
    """Mark notification as read"""
    notifications_collection.update_one(
        {"_id": ObjectId(notification_id), "user_id": current_user["_id"]},
        {"$set": {"read": True}}
    )
    return {"success": True}

@app.put("/api/notifications/read-all")
async def mark_all_notifications_read(current_user = Depends(get_current_user)):
    """Mark all notifications as read"""
    notifications_collection.update_many(
        {"user_id": current_user["_id"], "read": False},
        {"$set": {"read": True}}
    )
    return {"success": True}

# AI Suggestions Endpoint
@app.get("/api/ai/route-suggestions")
async def get_ai_route_suggestions(current_user = Depends(get_current_user)):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    user_level = current_user.get("experience_level", "intermediate")
    user_distance = current_user.get("avg_distance", 50)
    user_zone = current_user.get("preferred_zone", "")
    
    try:
        chat = LlmChat(
            api_key=os.environ.get("EMERGENT_LLM_KEY"),
            session_id=f"route_suggestions_{str(current_user['_id'])}",
            system_message="Sei un esperto di gravel cycling. Fornisci suggerimenti personalizzati per percorsi in base al profilo dell'utente. Rispondi in italiano con 3 suggerimenti brevi e pratici."
        ).with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(
            text=f"Suggerisci 3 tipi di percorsi gravel per un ciclista con livello {user_level}, che preferisce percorsi di circa {user_distance}km nella zona {user_zone}. Includi difficoltà, terreno consigliato e consigli."
        )
        
        response = await chat.send_message(user_message)
        return {"suggestions": response}
    except Exception as e:
        return {"suggestions": f"Suggerimenti non disponibili al momento. Errore: {str(e)}"}

@app.get("/api/ai/match-tips")
async def get_ai_match_tips(target_user_id: str, current_user = Depends(get_current_user)):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    target = users_collection.find_one({"_id": ObjectId(target_user_id)})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        chat = LlmChat(
            api_key=os.environ.get("EMERGENT_LLM_KEY"),
            session_id=f"match_tips_{str(current_user['_id'])}_{target_user_id}",
            system_message="Sei un esperto di ciclismo e connessioni sociali. Suggerisci spunti di conversazione basati sui profili dei ciclisti. Rispondi in italiano, brevemente."
        ).with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(
            text=f"Utente 1: livello {current_user.get('experience_level', 'N/A')}, distanza media {current_user.get('avg_distance', 'N/A')}km, zona {current_user.get('preferred_zone', 'N/A')}. Utente 2: livello {target.get('experience_level', 'N/A')}, distanza media {target.get('avg_distance', 'N/A')}km, zona {target.get('preferred_zone', 'N/A')}. Suggerisci 2 spunti di conversazione per rompere il ghiaccio."
        )
        
        response = await chat.send_message(user_message)
        return {"tips": response}
    except Exception as e:
        return {"tips": f"Suggerimenti non disponibili. Errore: {str(e)}"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "app": "GravelMatch API", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
