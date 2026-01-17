#!/bin/bash

pkill -f server.py
sleep 2
cd /home/gavin/server/scripts
./boot.sh
