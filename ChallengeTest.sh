Challenge=$1
FileName=$1"Test"
copyOut=$(cp "./challenges/$Challenge/$FileName.java" ./sandbox 2>&1)
if [ $? -ne 0 ]; then
	echo "Problem Copying: $copyOut"
	cd ..
	rm -r './sandbox';
	exit 0
fi

cd "./sandbox"

compOut=$(javac -cp .:../challenges/util *.java 2>&1)
if [ $? -ne 0 ]; then
	echo "$compOut"
	cd ..
	rm -r './sandbox';
	exit 0
fi
runOut=$(java -cp .:../challenges/util "$FileName" 2>&1)
if [ $? -ne 0 ]; then
	echo "$runOut"
	cd ..
	rm -r './sandbox';
	exit 0
fi

cd ..
rm -r './sandbox';

echo "$runOut"
exit 0