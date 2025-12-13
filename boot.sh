#!/usr/bin/env bash

git pull
source venv/bin/activate
nohup python3 server.py > log.txt &
