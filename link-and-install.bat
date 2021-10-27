cd example
call yarn unlink "@reactiff/midi"
cd..
call yarn unlink



call yarn link
call yarn install

cd example
call yarn link "@reactiff/midi"
call yarn install

cd..