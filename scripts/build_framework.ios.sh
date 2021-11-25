#!/bin/bash -e

# Ensure Xcode is installed or print a warning message and return.
xcodebuild -version &>/dev/null || { echo "WARNING: Xcode is not installed on this machine. Skipping iOS framework build phase"; exit 0; }

owlRootPath="$(dirname "$(dirname "$0")")"
owlVersion=`node -p "require('${owlRootPath}/package.json').version"`

sha1=`(echo "${owlVersion}" && xcodebuild -version) | shasum | awk '{print $1}' #"${2}"`
owlFrameworkDirPath="$HOME/Library/OwlClient/ios/${sha1}"
owlFrameworkPath="${owlFrameworkDirPath}/OwlClient.framework"

function prepareAndBuildFramework () {
  if [ -d "$owlRootPath"/ios ]; then
    owlSourcePath="${owlRootPath}"/ios
    echo "Dev mode, building from ${owlSourcePath}"
    buildFramework "${owlSourcePath}"
  else
    extractFramework
  fi
}

function extractFramework () {
  echo "Extracting OwlClient framework..."
  mkdir -p "${owlFrameworkDirPath}"
  tar -xjf "${owlRootPath}"/native/OwlClient-ios.tbz -C "${owlFrameworkDirPath}"
}

function buildFramework () {
  owlSourcePath="${1}"
  echo "Building OwlClient.framework from ${owlSourcePath} into ${owlFrameworkDirPath}"
  mkdir -p "${owlFrameworkDirPath}"
  logPath="${owlFrameworkDirPath}"/owl_client_ios.log
  echo "Build log: ${logPath}"
  echo -n "" > "${logPath}"
  "${owlRootPath}"/scripts/build_universal_framework.sh "${owlSourcePath}"/OwlClient.xcodeproj "${owlFrameworkDirPath}" &> "${logPath}" || {
    echo -e "#################################\nError building OwlClient.framework:\n----------------------------------\n"
    cat "${logPath}"
    echo "#################################"
    exit 1
  }
}

function main () {
  if [ -d "${owlFrameworkDirPath}" ]; then
    if [ ! -d "${owlFrameworkPath}" ]; then
      echo "${owlFrameworkDirPath} was found, but could not find OwlClient.framework inside it. This means that the OwlClient framework build process was interrupted.
         deleting ${owlFrameworkDirPath} and trying to rebuild."
      rm -rf "${owlFrameworkDirPath}"
      prepareAndBuildFramework
    else
      echo "OwlClient.framework exists, skipping..."
    fi
  else
    prepareAndBuildFramework
  fi

  echo "Done"
}

main