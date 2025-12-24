# Start SOLVIA Backend Only

Write-Host "[Backend] Starting SOLVIA Backend..." -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment is already activated
if ($env:VIRTUAL_ENV) {
    Write-Host "[Info] Virtual environment already activated!" -ForegroundColor Green
} else {
    # Activate virtual environment
    Write-Host "[Backend] Activating virtual environment..." -ForegroundColor Yellow
    $venvPath = Join-Path $PSScriptRoot ".venv\Scripts\Activate.ps1"
    
    if (Test-Path $venvPath) {
        & $venvPath
        Write-Host "[Success] Virtual environment activated!" -ForegroundColor Green
    } else {
        Write-Host "[Error] Virtual environment not found at: $venvPath" -ForegroundColor Red
        Write-Host "[Info] Run: python -m venv .venv" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""

Set-Location api

Write-Host "Backend will be available at:" -ForegroundColor Green
Write-Host "  - API: http://localhost:8000" -ForegroundColor White
Write-Host "  - Docs: http://localhost:8000/docs" -ForegroundColor White  
Write-Host "  - WebSocket: ws://localhost:8000/ws/camera" -ForegroundColor White
Write-Host ""

python main.py
