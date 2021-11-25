#!/bin/bash -e

cd native

rm -rf OwlClient-ios-src.tbz
rm -rf OwlClient-ios.tbz
rm -rf build_temp

find ./ios -name Build -type d -exec rm -rf {} \;

#Package sources
pushd . &> /dev/null
cd ios
tar --exclude-from=.tbzignore -cjf ../OwlClient-ios-src.tbz .
popd &> /dev/null

#Package prebuilt framework
mkdir build_temp
../scripts/build_universal_framework.sh "ios/OwlClient.xcodeproj" "build_temp" &> build_temp/owl_client_log.log
pushd . &> /dev/null
cd build_temp
tar --exclude-from=../ios/.tbzignore -cjf ../OwlClient-ios.tbz .
popd &> /dev/null

rm -fr build_temp