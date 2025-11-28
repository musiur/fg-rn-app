# FakirPay APK Build Guide

## Method 1: EAS Build (Cloud Build - Recommended)

### Prerequisites
- Expo account (free at expo.dev)
- Internet connection

### Steps

1. **Login to Expo**
   ```bash
   npx eas login
   ```

2. **Configure EAS Build** (first time only)
   ```bash
   npx eas build:configure
   ```

3. **Build APK**
   ```bash
   npx eas build -p android --profile preview
   ```

4. **Download APK**
   - Wait for build to complete (10-20 minutes)
   - Download link will be provided in terminal
   - Or check your builds at: https://expo.dev/accounts/[your-username]/projects/fakirpay/builds

### Build Profiles

- **Development build**: `npx eas build -p android --profile development`
- **Preview APK**: `npx eas build -p android --profile preview` (recommended for testing)
- **Production**: `npx eas build -p android --profile production` (for Play Store)

---

## Method 2: Local Build (No Expo Account)

### Prerequisites
- Android Studio installed
- Java JDK 17+
- Android SDK

### Steps

1. **Prebuild the native Android project**
   ```bash
   npx expo prebuild --platform android
   ```

2. **Build APK locally**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Find your APK**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Note
This creates an unsigned APK. For production, you need to sign it with a keystore.

---

## Method 3: Development Build (Quick Test)

For quick testing on your device:

1. **Install Expo Go** on your Android device from Play Store

2. **Start development server**
   ```bash
   pnpm start
   ```

3. **Scan QR code** with Expo Go app

**Note:** This is NOT a standalone APK, requires Expo Go app.

---

## Recommended Workflow

1. **For Testing**: Use EAS Build with `--profile preview`
2. **For Distribution**: Use EAS Build with `--profile production`
3. **For Development**: Use Expo Go or development build

---

## Troubleshooting

### "Not logged in"
```bash
npx eas login
```

### "Build failed"
- Check your app.json/app.config.js configuration
- Ensure all dependencies are compatible
- Check EAS build logs for specific errors

### "Need to update app.json"
Add this to your app.json:
```json
{
  "expo": {
    "android": {
      "package": "com.fakirfashion.fakirpay",
      "versionCode": 1
    }
  }
}
```

---

## Current Status

Your app is ready to build! Choose the method that works best for you:
- **Easiest**: EAS Build (Method 1)
- **No account needed**: Local Build (Method 2)
- **Quick test**: Expo Go (Method 3)
