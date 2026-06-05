$out = "_backup.txt"
$header = @"
================================================================
  SONHEICOM — BACKUP COMPLETO
================================================================
"@
$header | Out-File -FilePath $out -Encoding utf8

Get-ChildItem -Recurse -File | Where-Object {
    $_.FullName -notmatch '\\\.git\\' -and
    $_.Name -ne "_backup.txt" -and
    $_.Name -ne "backup.bat" -and
    $_.Extension -match '\.(html|css|js|json|md|txt|bat|py|ts|jsx|tsx|env|gitignore)$'
} | ForEach-Object {
    $rel = $_.FullName.Replace((Get-Location).Path + "\", "")
    "`n================================================================" | Add-Content $out
    "  ARQUIVO: $rel" | Add-Content $out
    "================================================================" | Add-Content $out
    Get-Content $_.FullName -ErrorAction SilentlyContinue | Add-Content $out
}

Write-Host "Backup gerado em $out"