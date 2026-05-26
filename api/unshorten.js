export default async function handler(req, res) {
    // 允許跨網域存取 (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: '缺少網址參數' });
    }

    try {
        // 使用 fetch 發送請求，並設定 redirect: 'manual' 攔截 302 跳轉
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'manual',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // 撈出酷澎伺服器回傳的跳轉目標 (Location)
        const targetUrl = response.headers.get('location');

        if (targetUrl) {
            return res.status(200).json({ longUrl: targetUrl });
        } else {
            // 如果沒有跳轉，代表它本來就是長網址
            return res.status(200).json({ longUrl: url });
        }
    } catch (error) {
        return res.status(500).json({ error: '解析短網址失敗：' + error.message });
    }
}