#!/usr/bin/env bash

git pull
source venv/bin/activate
pip install -r requirements.txt
cd frontend && npm ci && npm run build && cd ..
nohup python3 server.py > log.txt &
