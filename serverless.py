from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import sys
import os

# Add api directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))

from api.server import app as fastapi_app

# Mangum handler for Vercel Serverless
handler = Mangum(fastapi_app, lifespan="off")
