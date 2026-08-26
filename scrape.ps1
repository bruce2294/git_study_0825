$response = Invoke-WebRequest -Uri 'https://www.apple.com/kr/'
$html = $response.Content
$titles = [regex]::Matches($html, '<h[23][^>]*>(.*?)</h[23]>', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value -replace '<[^>]+>', '' } | Select-Object -First 20
Write-Output "--- Titles ---"
$titles
$images = [regex]::Matches($html, '(https://[^\s""''\)]+\.(?:jpg|png|jpeg))', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique | Select-Object -First 20
Write-Output "--- Image URLs ---"
$images
