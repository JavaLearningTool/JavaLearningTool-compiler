#!/bin/bash

Challenge=$1
FileName=$1"Test"
copyOut=$(cp "./challenges/$Challenge/$FileName.java" ./sandbox 2>&1)
if [ $? -ne 0 ]; then
	echo "Problem Copying: $copyOut"
	rm -r './sandbox';
	exit 1
fi

cd "./sandbox"

compOut=$(javac -cp .:../challenges/util:../challenges/shared *.java 2>&1)
if [ $? -ne 0 ]; then
	echo "$compOut"
	cd ..
	rm -r './sandbox';
	exit 1
fi
runOut=$(java -cp .:../challenges/util:../challenges/shared -Djava.security.manager -Djava.security.policy==../java.policy "$FileName" 2>&1)
if [ $? -ne 0 ]; then
	echo "$runOut"
	cd ..
	rm -r './sandbox';
	exit 1
fi

cd ..
rm -r './sandbox';

echo "$runOut"
exit 0