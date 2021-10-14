#!bin/sh

FILE="node_modules/better-sqlite3/build/Release/.forge-meta"
if [[ -f $FILE ]];then
	echo "$FILE exists"
else
	mkdir node_modules/better-sqlite3/build
	mkdir node_modules/better-sqlite3/build/Release/
	tar -xvf build/prebuild_betterSqlite3.tar.gz -C node_modules/better-sqlite3/build/Release/
fi

