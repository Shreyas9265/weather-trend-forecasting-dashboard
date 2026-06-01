from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    dataset_loaded: bool


class MessageResponse(BaseModel):
    message: str
