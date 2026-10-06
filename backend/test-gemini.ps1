$key = (Get-Content "$PSScriptRoot\.env" | Select-String 'GEMINI_API_KEY').ToString() -replace 'GEMINI_API_KEY=',''
$body = '{"contents":[{"parts":[{"text":"Return this exact JSON: {\"hello\":\"world\"}"}]}],"generationConfig":{"responseMimeType":"application/json","temperature":0.2}}'
Write-Host "Testing gemini-3.1-flash-lite with responseMimeType=application/json..."
try {
    $r = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=$key" -Method POST -Body $body -ContentType "application/json"
    Write-Host "SUCCESS"
    $r | ConvertTo-Json -Depth 5
} catch {
    Write-Host "FAIL: $($_.Exception.Message)"
    $_.ErrorDetails.Message
}
