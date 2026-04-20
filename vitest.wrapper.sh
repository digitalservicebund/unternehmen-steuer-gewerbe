#!/bin/bash
# This ensures 1Password resolves the .env before Node even starts
op run --env-file .env -- node "$@"
