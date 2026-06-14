from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from fastapi import Depends, HTTPException

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, "your_secret_key", algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")
