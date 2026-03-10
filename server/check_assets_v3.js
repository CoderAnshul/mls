
const http = require('http');

http.get('http://localhost:5000/api/home-assets', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const assets = JSON.parse(data);
            console.log('--- ALL HOME ASSETS ---');
            assets.forEach(a => {
                console.log(`Key: ${a.key}`);
                console.log(`Value Length: ${a.value?.length || 0}`);
                if (Array.isArray(a.value)) {
                    a.value.forEach((v, i) => {
                        console.log(`  [${i}] title: ${v.title}, image: ${v.image?.substring(0, 50)}...`);
                    });
                }
                console.log('---');
            });
        } catch (e) {
            console.error('Parse error:', e.message);
            console.log('Raw data:', data.substring(0, 200));
        }
    });
}).on('error', (err) => {
    console.error('Fetch error:', err.message);
});
