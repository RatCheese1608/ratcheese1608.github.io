@echo off

set "commmsg=new update or something idk"
if "%1" == "" set "commmsg=%~1"

git add . && git commit -m "commmsg" && git push -u origin master