#!/bin/bash

# Build script for Chrome Web Store submission
# Creates a clean production package

set -e

EXTENSION_DIR="/Users/abhinavbajaj/Documents/zonein-extension"
BUILD_DIR="${EXTENSION_DIR}/build"
VERSION=$(grep '"version"' "${EXTENSION_DIR}/manifest.json" | cut -d'"' -f4)

echo "Building ZoneIn Extension v${VERSION} for Chrome Web Store..."

# Clean previous build
if [ -d "$BUILD_DIR" ]; then
    echo "Cleaning previous build..."
    rm -rf "$BUILD_DIR"
fi

# Create build directory
mkdir -p "$BUILD_DIR"

# Copy essential files
echo "Copying files..."
cp "${EXTENSION_DIR}/manifest.json" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/background.js" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/content.js" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/rules-engine.js" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/transport.js" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/rules.json" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/popup.html" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/popup.js" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/popup.css" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/options.html" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/options.js" "$BUILD_DIR/"
cp "${EXTENSION_DIR}/options.css" "$BUILD_DIR/"

# Copy icons directory
cp -r "${EXTENSION_DIR}/icons" "$BUILD_DIR/"

# Create ZIP file
ZIP_NAME="zonein-extension-v${VERSION}.zip"
cd "$BUILD_DIR"
zip -r "../${ZIP_NAME}" . > /dev/null
cd "$EXTENSION_DIR"

echo ""
echo "✅ Build complete!"
echo "📦 Package created: ${ZIP_NAME}"
echo ""
echo "Next steps:"
echo "1. Review the package: unzip -l ${ZIP_NAME}"
echo "2. Test by loading unpacked from the build/ directory"
echo "3. Upload ${ZIP_NAME} to Chrome Web Store"
echo ""
