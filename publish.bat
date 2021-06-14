@echo off
set /p msg="Enter git commit message: "
@echo on

cd example
call yarn unlink "@reactiff/midi"
cd..
call yarn unlink

git add .
git commit -m "%msg%"
git push

call npm version patch
call npm publish --access public

yarn deploy

echo
echo Done!
