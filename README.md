# PlayGTA5 Enhanced — experimental launcher

A separate community launcher for an **existing [PlayGTA5 installation](https://github.com/alihammoud21/playgta5)**. It adds controller input, selectable performance presets, a cheat-code panel, and a shortcut to the snapshot's existing `env_test` development map. No second 21 GB download is needed.

**Experimental:** automated input/server tests are not hardware gameplay validation. This does not include Michael-McGehee1's source, reproduce his FPS measurements, or promise 200 FPS. This repo is open for contributions; Michael has not agreed to become a collaborator.

## Start here

1. Install and verify the complete game from the main repo. Keep `mirror`, `runtime`, and your browser saves.
2. Download **Code → Download ZIP** from this repo and extract it beside your existing installation.
3. Close the old local server so port 8000 is free. Run the following in this repo's extracted folder, replacing the installation path.

Windows PowerShell (uses the main installation's bundled Python):

```powershell
& 'C:\path\to\PlayGTA5\runtime\python.exe' .\launch.py --install 'C:\path\to\PlayGTA5'
```

Mac Terminal (Python 3.11+):

```sh
python3 launch.py --install '/path/to/PlayGTA5'
```

Open **http://localhost:8000/__enhanced/** in current Chrome or Edge. Keep the server open. Stop it with Ctrl+C. Use the same browser profile, hostname and port as before to access existing saves. A different port is a separate save origin.

The server patches responses in memory; original assets remain unchanged and checksum verification still works. Unsupported page layouts fail explicitly instead of guessing memory offsets. To return to the main launcher, stop this server and run the original `Launch-Local` script.

## What is included

| Feature | Behavior and limits |
| --- | --- |
| Continue / new story | Continue loads the newest save; new story passes `newgame=1` without deleting browser data. |
| Los Santos free roam | Existing sandbox mode. |
| GTA VI dev-map button | Existing `mode=sandbox&map=env_test` level. This is **not the released GTA VI game**; map completeness/rendering are unverified. |
| Controller bridge | Standard browser gamepads mapped to keyboard/mouse input, deadzone, frame-time-scaled camera, release on blur/disconnect. No native analog movement, vibration, or automatic vehicle detection. |
| Cheat panel (F7) | 35 PC code entries sent through the existing text-input ring. Open the in-game cheat console first. Delivery does not establish that the engine accepts a code. Unlock-dependent codes may be unavailable in this snapshot. |
| Performance presets | 540p / 720p / 1080p light, 30/60/uncapped, optional low-quality shadows. |
| Optional engine allocation | `--engine-ram 4` changes the known initial 3 GiB allocation to 4 GiB in the served JS. Experimental; more reserved memory does not guarantee better FPS. |

**Not included:** Michael's custom trainer, a money cheat, arbitrary vehicle spawning, additional GTA Online vehicles, multiplayer, or his 3 GiB streaming-budget patch. Those need actual source and testing. A screenshot is not enough to reproduce them safely.

## Controller controls

Connect your controller, press a button, then click the game once to activate audio and mouse capture. Use a browser that exposes a `standard` mapping. The controller status appears in the launcher and F7 panel.

| Control (Xbox / PlayStation) | On foot | Driving mode |
| --- | --- | --- |
| Left stick | W/A/S/D movement | A/D steering |
| Right stick | Camera while mouse captured | Camera while mouse captured |
| RT / R2 | Fire | Accelerate |
| LT / L2 | Aim | Brake / reverse |
| A / Cross | Sprint | Handbrake |
| B / Circle | Reload | R key |
| X / Square | Jump | Q key |
| Y / Triangle | Enter/exit vehicle | Enter/exit vehicle |
| LB / L1 | Weapon wheel | Weapon wheel |
| RB / R1 | Cover | Horn |
| Left stick press | Stealth | Horn |
| Right stick press | Look behind | Look behind |
| View / Share | Camera view | Camera view |
| Menu / Options | Escape/menu | Escape/menu |
| D-pad | Arrow keys | Arrow keys |
| View+Menu / Share+Options | Switch to driving mode | Switch to on-foot mode |

This is a basic input bridge. Keyboard/mouse remain available for menus, aircraft, and actions not mapped here. Remapped/nonstandard controllers need further work. Press Esc to release the mouse; click the game again before using the right stick. Controller-only audio activation and menu navigation are not claimed.

## Cheats

After the world loads, press **F7**. Click **Open game cheat console**, check that the engine's cheat entry box appears, choose a code, then **Send selected code**. Do not send into an unrelated game text box. The engine decides whether a cheat is available. Keep a clean manual save: cheats can affect achievements/progression in the underlying game.

The catalog covers the familiar PC codes, including health, weapons, wanted level, movement, weather and vehicle codes. It is a reference/input helper, **not “every custom cheat works.”** Code references: [PC Gamer's PC cheats guide](https://www.pcgamer.com/gta-5-cheats/). There is no GTA V money code in that catalog.

## FPS testing

Start at **720p / 60 / shadows off**. If it struggles, choose **540p**, then a **30 FPS cap** for consistent pacing. Only compare uncapped runs after shaders finish preparing, in the same save/location/camera. Record GPU, driver, browser, resolution, preset, FPS and any stalls. A 200 FPS cap/claim cannot make hardware render at 200 FPS; this engine's exposed choices are 30, 60 and uncapped.

The original build already uses its fast script interpreter and suppresses noisy script logs. This launcher exposes existing settings; no new renderer optimization or measured FPS uplift is claimed.

## Development & contributions

```sh
node tests/controller.cjs
node tests/extras.cjs
python3 -m unittest discover -s tests -v
```

See [TESTING.md](TESTING.md) for validation status and the hardware test checklist. Input implementation uses the [standard Gamepad mapping](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/mapping) and the existing snapshot input layout. Send reproducible bugs to this repo; core engine/asset issues belong in the main repo. Please include code/source and test details when proposing Michael-style memory/trainer changes.
