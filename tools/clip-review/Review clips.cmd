@echo off
rem Double-click this to review the latest batch of clips.
rem The first run needs --video-dir once; after that it is remembered.
cd /d "%~dp0"
where node >nul 2>nul || (
  echo Node is not installed, or not on PATH.
  echo Install it from https://nodejs.org and double-click this again.
  pause
  exit /b 1
)
node bin\review.mjs %*
if errorlevel 1 pause
