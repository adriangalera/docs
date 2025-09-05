---
slug: /tooling/powershell
pagination_next: null
pagination_prev: null
---

Download reference: https://gist.github.com/HarmJ0y/bb48307ffa663256e239

## Base64 encode

```powershell
[Convert]::ToBase64String((Get-Content -path "C:\Windows\system32\drivers\etc\hosts" -Encoding byte))
```

## Calculate MD5 hash
```powershell
Get-FileHash "C:\Windows\system32\drivers\etc\hosts" -Algorithm MD5 | select Hash
```

## Alternative to grep
```ps1
Select-String -Path "file.txt" -Pattern "searchTerm"
```

## Alternative to wc -l
```ps1
Get-Content file.txt | Measure-Object -Line
```