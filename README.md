# MeyAudioPlayer (MAP) — build package

Music & audio player. **Owner / Developer: Kamil.** Version 1.0.

This package builds three files from one app:

| File | What it is |
|---|---|
| `MeyAudioPlayer-Setup-1.0.0.exe` | Windows installer (Start-menu + desktop shortcut, uninstaller, opens .mp3/.m4a/.wav/.ogg/.flac files) |
| `MeyAudioPlayer-1.0.0-portable.exe` | Single Windows .exe, runs without installing |
| `MeyAudioPlayer-1.0.apk` | Android app (Android 7.0 and newer) |

```
app/index.html        <- the player itself (edit this one; builds copy it)
desktop/              <- Windows version (Electron)
android/              <- Android version (WebView app, opens in Android Studio)
icons/                <- MAP logo (SVG + 1024 px PNG)
.github/workflows/    <- cloud build script for GitHub Actions
```

---

## Option A — Build everything in the cloud with GitHub (easiest, free)

No software to install. GitHub builds the .exe, the installer and the .apk for you.

1. Sign in at github.com and create a **new repository** (e.g. `MeyAudioPlayer`). It can be private.
2. On the empty repository page click **uploading an existing file**, then drag in **everything inside this folder** and click **Commit changes**.
   - Check that the `.github/workflows/build.yml` file arrived. Some computers hide folders starting with a dot. If it is missing, click **Add file → Create new file**, type the name `.github/workflows/build.yml`, paste in the contents of that file from this package, and commit.
3. Open the **Actions** tab. The build "Build MeyAudioPlayer" starts by itself (or click **Run workflow**). It takes about 5–10 minutes.
4. When it shows a green tick, open the run and scroll to **Artifacts**:
   - **MeyAudioPlayer-Windows** → contains the installer and the portable .exe
   - **MeyAudioPlayer-Android** → contains the .apk
5. Optional: to publish the files as a downloadable **Release**, create a tag named `v1.0.0` (Releases → Draft a new release → choose tag `v1.0.0` → Publish). The build attaches all three files to it.

## Option B — Build on your own Windows PC

### Windows .exe and installer
1. Install **Node.js 20 or newer** from https://nodejs.org (LTS).
2. Double-click `desktop\build-windows.bat`.
3. The `desktop\dist` folder opens with the installer and the portable .exe.

To try the app without building: in the `desktop` folder run `npm install` then `npm start`.

### Android .apk
1. Install **Android Studio** from https://developer.android.com/studio.
2. **File → Open** and choose the `android` folder. Let it finish syncing.
3. **Build → Build App Bundle(s) / APK(s) → Build APK(s)**. Click **locate** to find the .apk.
4. Copy the .apk to your phone and open it (allow "Install unknown apps" when asked).

---

## Notes

- **Windows SmartScreen** may say "Windows protected your PC" because the .exe is not code-signed. Click **More info → Run anyway**. Removing this warning needs a paid code-signing certificate.
- **Android signing:** without your own key, the APK is signed with a debug key. It installs fine, but each cloud build may use a different debug key, so to install a newer build you might need to uninstall the old one first. To publish on Google Play, or to update without uninstalling, create your own key once:
  ```
  keytool -genkeypair -v -keystore map-release.jks -alias map -keyalg RSA -keysize 2048 -validity 10000
  ```
  Keep `map-release.jks` and its password safe and **never upload it to the repository**. In GitHub go to **Settings → Secrets and variables → Actions** and add:
  `MAP_KEYSTORE_BASE64` (the file encoded with `base64`), `MAP_KEYSTORE_PASSWORD`, `MAP_KEY_ALIAS` (`map`), `MAP_KEY_PASSWORD`.
- **Your music stays on your device.** Songs must be added again after the app restarts; playlist names, volume, order and dark mode are remembered.
- On Android, pressing Back sends the player to the background so music keeps playing. Use **Add files** to pick songs (folder picking is a desktop-only feature).
- To change the version, edit `"version"` in `desktop/package.json` and `versionCode` / `versionName` in `android/app/build.gradle`.

© 2026 Kamil. All rights reserved.
