import urllib.request
import re

url = 'https://www.apple.com/kr/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    
    # Extract h2 and h3
    print("--- Titles ---")
    titles = re.findall(r'<h[23][^>]*>(.*?)</h[23]>', html, re.DOTALL | re.IGNORECASE)
    for t in titles[:20]:
        clean = re.sub(r'<[^>]+>', '', t).strip()
        clean = re.sub(r'\s+', ' ', clean)
        print(clean)
        
    print("--- Image URLs ---")
    images = re.findall(r'(https://[^\s\"\'\)]+\.(?:jpg|png|jpeg))', html, re.IGNORECASE)
    seen = set()
    for img in images:
        if img not in seen:
            print(img)
            seen.add(img)
except Exception as e:
    print(e)
