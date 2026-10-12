# Validation

Automated checks cover controller deadzones and mappings, simultaneous keyboard/controller input, blur/disconnect release, camera delta timing, cheat input bounds, launcher mode URLs, in-memory patches, and HTTP isolation headers. The server is tested against the downloaded `full-game-v1` snapshot.

**Still needs hardware validation:** Xbox and PlayStation controllers over USB/Bluetooth, driving and menus, individual cheat effects/unlocks, save/resume after completing the prologue, Mac GPU rendering, `env_test` world rendering, and measured FPS. Browser automation was unavailable in the maintenance session; do not treat static or simulated tests as a rendered game test.

For each result record OS, GPU/driver, browser version, controller/model/connection, mode, quality/FPS/shadow settings, exact steps and first error. Use a manual clean save before testing cheats. Keep the same browser origin when checking save persistence.
