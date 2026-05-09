$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $ProjectRoot

$PythonPath = Join-Path $ProjectRoot ".venv\Scripts\python.exe"
if (-not (Test-Path -LiteralPath $PythonPath)) {
    $PythonPath = Join-Path (Split-Path -Parent $ProjectRoot) ".venv\Scripts\python.exe"
}

& $PythonPath manage.py runserver 127.0.0.1:8000 --settings=config.local_sqlite_settings --noreload
