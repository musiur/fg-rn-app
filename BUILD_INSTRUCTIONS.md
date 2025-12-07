# Build Instructions for Android APK

This project is configured to build an Android APK using Expo Application Services (EAS).

## Prerequisites

1.  **EAS CLI**: Ensure `eas-cli` is installed (it is usually installed via `npx`).
2.  **Expo Account**: You need an Expo account to build the app.

## Steps to Build

1.  **Login to EAS**:
    If you haven't logged in recently, run:
    ```bash
    npx eas login
    ```

2.  **Run the Build Command**:
    To generate an APK (installable on Android devices), run:
    ```bash
    npx eas build -p android --profile production-apk
    ```

3.  **Follow the Prompts**:
    -   If this is your first time building, EAS will ask to generate a Keystore. Select **Yes** to let EAS handle it for you.
    -   Wait for the build to complete.

4.  **Download the APK**:
    -   Once the build is finished, a link to download the `.apk` file will be provided in the terminal.
    -   You can also find the build in your Expo dashboard.

## Configuration

The build configuration is located in `eas.json`:

```json
"production-apk": {
  "android": {
    "buildType": "apk"
  }
}
```
