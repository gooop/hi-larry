#!/bin/bash

# Kill the server.py process
pkill -f server.py

# Wait a moment to ensure it's stopped
sleep 2

# Run boot.sh (adjust path as needed)
cd /home/gavin/server/
./boot.sh
