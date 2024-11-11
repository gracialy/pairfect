from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def get_photoPair():
    return {"id": 1,
            "image": "hyunjin.jpg",
            "keywords": ["hyunjin", "boyfriend"]
            }