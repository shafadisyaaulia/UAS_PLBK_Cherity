# Start SOLVIA Frontend Only

Write-Host "🌐 Starting SOLVIA Frontend..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure backend is running at http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend will be available at:" -ForegroundColor Green
Write-Host "  → http://localhost:3000" -ForegroundColor White
Write-Host ""

npm run dev
