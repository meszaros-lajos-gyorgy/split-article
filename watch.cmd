@echo off

rem rollem is not building when watch is started, we trigger that manually
rem https://github.com/bahmutov/rollem/issues/28
call npm run build

start "static rebuild system" npm run buildWatch
start "watching examples" npm run examplesWatch
