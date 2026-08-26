const https = require('https');

https.get('https://www.apple.com/kr/', (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    const titleRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
    const imgRegex = /(https:\/\/[^\s\"\'\)]+\.(?:jpg|png|jpeg))/gi;
    
    console.log("--- Titles ---");
    let titleMatch;
    let titleCount = 0;
    while ((titleMatch = titleRegex.exec(data)) !== null && titleCount < 20) {
      let clean = titleMatch[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
      console.log(clean);
      titleCount++;
    }

    console.log("--- Image URLs ---");
    let imgMatch;
    let seen = new Set();
    while ((imgMatch = imgRegex.exec(data)) !== null) {
      if (!seen.has(imgMatch[1])) {
        console.log(imgMatch[1]);
        seen.add(imgMatch[1]);
      }
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
