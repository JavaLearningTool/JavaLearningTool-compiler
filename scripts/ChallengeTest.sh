#!/bin/bash

Challenge=$1
FileName=$1"Test"

cd "./sandbox"

# Copy over the tester
copyOut=$(cp -a "../challenges/$Challenge/." ./ 2>&1)
if [ $? -ne 0 ]; then
	echo "Problem Copying: $copyOut"
	rm -r './sandbox';
	exit 1
fi

# Compile everything
compOut=$(javac -cp .:../challenges/tester_lib/build/libs/tester_lib.jar:../challenges/shared *.java 2>&1)
if [ $? -ne 0 ]; then
	echo "$compOut"
	cd ..
	rm -r './sandbox';
	exit 1
fi

# run testers
runOut=$(java -cp .:../challenges/tester_lib/build/libs/tester_lib.jar:../challenges/shared -Djava.security.manager -Djava.security.policy==../java.policy "$FileName" 2>&1)
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