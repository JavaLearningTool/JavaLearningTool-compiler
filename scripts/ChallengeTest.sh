#!/bin/bash

Challenge=$1
TesterFileName=$1"Test"

cd "./sandbox"

# Compile everything
compOut=$(javac -cp .:../challenges/$Challenge:../challenges/tester_lib/build/libs/tester_lib-all.jar:../challenges/shared *.java ../challenges/$Challenge/*.java 2>&1)
if [ $? -ne 0 ]; then
	echo "$compOut"
	cd ..
	rm -r './sandbox';
	exit 1
fi

# run testers
runOut=$(java -cp .:../challenges/$Challenge:../challenges/tester_lib/build/libs/tester_lib-all.jar:../challenges/shared -Djava.security.manager "$TesterFileName" 2>&1)
if [ $? -ne 0 ]; then
	echo "$runOut"
	cd ..
	rm -r './sandbox';
	exit 1
fi

# remove sandbox
cd ..
rm -r './sandbox';

# print results
echo "$runOut"
exit 0