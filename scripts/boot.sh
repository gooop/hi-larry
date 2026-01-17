#!/usr/bin/env bash

git pull
cd ../backend
source venv/bin/activate
pip install -r requirements.txt
cd ../frontend && npm ci && npm run build && cd ../backend
nohup python3 server.py > log.txt &
