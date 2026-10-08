Get-Content "$PSScriptRoot\.env" | Where-Object { $_ -match '^[^#].*=.*' } | ForEach-Object {
    $k, $v = $_ -split '=', 2
    [System.Environment]::SetEnvironmentVariable($k.Trim(), $v.Trim())
}
& mvn spring-boot:run
