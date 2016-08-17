#!/usr/bin/env bash

code=0
testfile=$1
files=$testfile

if [ -z $testfile ]
then
  files=$(ls test/e2e/*_test.js)
fi

for test in $files
do
  node test/e2e/test_helper.js
  casperjs test $test
  ret=$?
  if [ ! $ret == "0" ]; then code=1; fi
done

exit $code
