# Installation

1. Download the ZIP file from [GitHub](https://github.com/AndreasArvidsson/clippy/releases/latest).
    - [Windows](https://github.com/AndreasArvidsson/clippy/releases/latest/download/Clippy-Windows.zip)
    - [Linux](https://github.com/AndreasArvidsson/clippy/releases/latest/download/Clippy-Linux.zip)
    - [macOS](https://github.com/AndreasArvidsson/clippy/releases/latest/download/Clippy-macOS.zip)
2. Extract the ZIP file.
3. Run the Clippy executable (e.g. `Clippy.exe`).

## Opening Clippy on Windows

Windows may show a **Windows protected your PC** warning because Microsoft Defender SmartScreen does not recognize Clippy. If you trust the download:

1. Open the extracted application folder and double-click `Clippy.exe`.
2. If the **Windows protected your PC** warning appears, click **More info**.
3. Check that the app shown is `Clippy.exe`, then click **Run anyway**.

If **Run anyway** is unavailable, your device's security settings may prevent you from allowing the app. On a managed device, contact your administrator. See [Microsoft's SmartScreen documentation](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation) for more information.

## Opening Clippy on macOS

Clippy is not notarized by Apple, so macOS may block it on first launch. If you trust the download, you can allow Clippy using [Apple's instructions](https://support.apple.com/en-au/102445):

1. Try opening `Clippy.app` once, then dismiss the warning.
2. Open **System Settings → Privacy & Security**.
3. Scroll down to the message about Clippy and click **Open Anyway**.
4. Click **Open** when the confirmation appears.

macOS saves an exception for Clippy, so you can open it normally afterward. If macOS reports that the app is damaged or will harm your computer, see the separate guidance for those alerts in Apple's article.

## SHA-256 checksums

Use these checksums to verify that your downloaded ZIP file matches the release.

- [Windows](https://github.com/AndreasArvidsson/clippy/releases/latest/download/Clippy-Windows.zip.sha256)
- [Linux](https://github.com/AndreasArvidsson/clippy/releases/latest/download/Clippy-Linux.zip.sha256)
- [macOS](https://github.com/AndreasArvidsson/clippy/releases/latest/download/Clippy-macOS.zip.sha256)

## Uninstallation

1. Close Clippy.
2. Delete the application folder that you extracted from the ZIP file. On macOS, delete `Clippy.app` if you moved it to Applications.
3. Optionally remove Clippy's cache and settings folder. Note that this will remove stored clipboard items:
    - Windows: `%APPDATA%\Clippy`.
    - macOS: `~/Library/Application Support/Clippy`.
    - Linux: `$XDG_CONFIG_HOME/Clippy`, or `~/.config/Clippy` if `XDG_CONFIG_HOME` is unset.
