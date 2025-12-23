# Start SOLVIA Backend Only

Write-Host "🔧 Starting SOLVIA Backend..." -ForegroundColor Cyan
Write-Host ""

Set-Location api

Write-Host "📡 Backend will be available at:" -ForegroundColor Green
Write-Host "  → API: http://localhost:8000" -ForegroundColor White
Write-Host "  → Docs: http://localhost:8000/docs" -ForegroundColor White  
Write-Host "  → WebSocket: ws://localhost:8000/ws/camera" -ForegroundColor White
Write-Host ""

python main.py
