#!/bin/zsh

# Make sure to make this script executable: chmod +x ci_post_xcodebuild.sh

# 1. Download Firebase CLI binary (if not present)
if [ ! -f "/tmp/firebase" ]; then
  echo "Downloading Firebase CLI binary to /tmp..."
  curl -Lo /tmp/firebase https://firebase.tools/bin/macos/latest
  chmod +x /tmp/firebase
fi

# 2. Find the IPA
IPA_PATH=""
if [ -d "$CI_APP_STORE_SIGNED_APP_PATH" ]; then
  IPA_PATH=$(find "$CI_APP_STORE_SIGNED_APP_PATH" -name "*.ipa" | head -n 1)
elif [ -d "$CI_AD_HOC_SIGNED_APP_PATH" ]; then
  IPA_PATH=$(find "$CI_AD_HOC_SIGNED_APP_PATH" -name "*.ipa" | head -n 1)
fi

# 3. Distribute to Firebase
if [ -n "$IPA_PATH" ] && [ -f "$IPA_PATH" ]; then
  echo "Uploading IPA to Firebase App Distribution: $IPA_PATH"
  /tmp/firebase appdistribution:distribute "$IPA_PATH" \
    --app "$FIREBASE_APP_ID" \
    --token "$FIREBASE_CLI_TOKEN" \
    --release-notes "Build $CI_BUILD_NUMBER ($CI_COMMIT) via Xcode Cloud"
else
  echo "❌ Error: Could not locate signed IPA file for distribution."
  exit 1
fi
