$ErrorActionPreference = 'Stop'
try {
    $gameFolderInput = (Read-Host 'Existing PlayGTA5 folder (contains mirror and runtime)').Trim().Trim('"')
    $gameFolder = (Resolve-Path -LiteralPath $gameFolderInput).Path
    $gamePython = Join-Path $gameFolder 'runtime\python.exe'
    if (-not (Test-Path -LiteralPath $gamePython -PathType Leaf)) {
        throw 'Bundled Python not found. Complete the main Windows installation first.'
    }
    & $gamePython (Join-Path $PSScriptRoot 'launch.py') --install $gameFolder
    exit $LASTEXITCODE
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
