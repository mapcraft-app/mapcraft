#!bin/sh

FILE="node_modules/better-sqlite3/build/Release/better_sqlite3.node"
if [[ "$OSTYPE" == "darwin" ]];then
	if [[ -f $FILE ]];then
		echo "$FILE exists"
	else
		mkdir node_modules/better-sqlite3/build
		mkdir node_modules/better-sqlite3/build/Release/
		tar -xvf build/bettersqlite_darwin.tar.gz -C node_modules/better-sqlite3/build/Release/
	fi
else
	if [[ -f $FILE ]];then
		echo "$FILE exists"
	else
		mkdir node_modules/better-sqlite3/build
		mkdir node_modules/better-sqlite3/build/Release/
		tar -xvf build/bettersqlite_linux.tar.gz -C node_modules/better-sqlite3/build/Release/
	fi
fi

