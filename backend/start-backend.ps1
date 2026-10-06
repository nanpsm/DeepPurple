Set-Location $PSScriptRoot
Get-Content ".env" | ForEach-Object {
    if ($_ -match '^([^#][^=]*)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], 'Process')
    }
}
$env:SPRING_PROFILES_ACTIVE = "local"
Write-Host "GEMINI_API_KEY loaded: $($env:GEMINI_API_KEY.Substring(0,10))..."
Write-Host "Profile: $env:SPRING_PROFILES_ACTIVE"
mvn spring-boot:run
