Set-Location $PSScriptRoot
Get-Content ".env" | ForEach-Object {
    if ($_ -match '^([^#][^=]*)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], 'Process')
    }
}
Write-Host "GEMINI_API_KEY loaded: $($env:GEMINI_API_KEY.Substring(0,10))..."
Write-Host "DATABASE_URL: $env:DATABASE_URL"
Write-Host "Profile: (default — Supabase PostgreSQL)"
mvn spring-boot:run
