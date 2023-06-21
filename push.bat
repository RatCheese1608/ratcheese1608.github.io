@echo off

set "commsg=new update or something idk"
if not "%1" == "" set "commsg=%~1"

git add .
rem git reset -- ./push.bat
git commit -m "%commsg%"
git push -u origin master