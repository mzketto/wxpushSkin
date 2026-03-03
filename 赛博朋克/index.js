export default {
    async fetch(request, env, ctx) {
      // 从URL参数中获取数据
      const url = new URL(request.url);
      const title = url.searchParams.get('title') || '消息推送';
      const message = url.searchParams.get('message') || '无告警信息';
      const date = url.searchParams.get('date') || '无时间信息';
      const html = `
<!DOCTYPE html>
<html lang="zh-CN" dir="ltr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --neon-cyan: #00f3ff;
            --neon-magenta: #ff00ff;
            --neon-yellow: #ffee00;
            --void-black: #050505;
            --deep-navy: #0a0a12;
            --cyber-gray: #1a1a24;
            --text-white: #e0e0e0;
        }

        body {
            font-family: 'Share Tech Mono', 'Courier New', monospace;
            background: radial-gradient(circle at center, #1a1a24 0%, #050505 100%);
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        /* 网格背景 */
        .grid-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
                linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            perspective: 500px;
            transform-style: preserve-3d;
            z-index: 0;
        }

        .grid-bg::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: linear-gradient(to top, rgba(0, 243, 255, 0.05), transparent);
            transform: perspective(300px) rotateX(60deg);
            transform-origin: bottom;
        }

        /* 扫描线效果 */
        .scanlines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: 100;
            animation: scanline-move 8s linear infinite;
        }

        @keyframes scanline-move {
            0% { background-position: 0 0; }
            100% { background-position: 0 100%; }
        }

        /* 暗角效果 */
        .vignette {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
            pointer-events: none;
            z-index: 99;
        }

        /* 卡片容器 */
        .card {
            width: 90%;
            max-width: 500px;
            background: rgba(10, 10, 16, 0.9);
            position: relative;
            z-index: 1;
            backdrop-filter: blur(10px);
            clip-path: polygon(
                0 10px,
                10px 0,
                calc(100% - 10px) 0,
                100% 10px,
                100% calc(100% - 10px),
                calc(100% - 10px) 100%,
                10px 100%,
                0 calc(100% - 10px)
            );
            animation: card-glitch 0.5s ease-out;
        }

        @keyframes card-glitch {
            0% {
                opacity: 0;
                transform: scale(0.95) translateY(-10px);
                filter: blur(10px);
            }
            20% {
                clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            }
            40% {
                clip-path: polygon(0 45%, 100% 45%, 100% 55%, 0 55%);
                transform: scale(1.02);
            }
            60% {
                clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
                filter: blur(0);
            }
        }

        /* 卡片边框发光 */
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta));
            clip-path: polygon(
                0 10px,
                10px 0,
                calc(100% - 10px) 0,
                100% 10px,
                100% calc(100% - 10px),
                calc(100% - 10px) 100%,
                10px 100%,
                0 calc(100% - 10px)
            );
            z-index: -1;
            animation: border-flicker 3s ease-in-out infinite;
        }

        @keyframes border-flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
            52% { opacity: 0.6; }
            54% { opacity: 1; }
        }

        .card-inner {
            background: rgba(10, 10, 16, 0.95);
            margin: 2px;
            clip-path: polygon(
                0 10px,
                10px 0,
                calc(100% - 10px) 0,
                100% 10px,
                100% calc(100% - 10px),
                calc(100% - 10px) 100%,
                10px 100%,
                0 calc(100% - 10px)
            );
            padding: 30px;
        }

        /* 卡片头部 */
        .card-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(0, 243, 255, 0.3);
            margin-bottom: 25px;
            position: relative;
        }

        /* 技术装饰角标 */
        .card-header::before,
        .card-header::after {
            content: attr(data-decor);
            position: absolute;
            font-size: 10px;
            color: rgba(0, 243, 255, 0.4);
            font-family: 'Share Tech Mono', monospace;
        }

        .card-header::before {
            top: 0;
            left: 0;
        }

        .card-header::after {
            bottom: 0;
            right: 0;
        }

        .card-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 15px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card-icon::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid var(--neon-cyan);
            animation: icon-pulse 2s ease-in-out infinite;
        }

        @keyframes icon-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
        }

        .card-icon svg {
            width: 30px;
            height: 30px;
            fill: var(--neon-cyan);
            filter: drop-shadow(0 0 8px var(--neon-cyan));
        }

        .card-title {
            font-family: 'Orbitron', 'Rajdhani', sans-serif;
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--neon-cyan);
            text-transform: uppercase;
            letter-spacing: 0.15em;
            text-shadow:
                0 0 10px var(--neon-cyan),
                0 0 20px var(--neon-cyan),
                0 0 40px var(--neon-cyan);
            position: relative;
            display: inline-block;
        }

        .card-title::before,
        .card-title::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .card-title::before {
            color: var(--neon-magenta);
            animation: glitch-1 2s infinite linear alternate-reverse;
            clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
        }

        .card-title::after {
            color: var(--neon-yellow);
            animation: glitch-2 3s infinite linear alternate-reverse;
            clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
        }

        @keyframes glitch-1 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
        }

        @keyframes glitch-2 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(2px, -2px); }
            40% { transform: translate(2px, 2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(-2px, 2px); }
        }

        .card-subtitle {
            font-size: 0.7rem;
            color: rgba(255, 0, 255, 0.7);
            font-weight: 400;
            letter-spacing: 0.3em;
            margin-top: 8px;
            text-transform: uppercase;
        }

        /* 卡片主体 */
        .card-body {
            padding: 10px 0;
        }

        .info-item {
            margin-bottom: 22px;
            padding: 18px 20px;
            background: rgba(0, 243, 255, 0.03);
            border-left: 3px solid var(--neon-cyan);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .info-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.1), transparent);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .info-item:last-child {
            margin-bottom: 0;
        }

        .info-item:hover {
            background: rgba(255, 0, 255, 0.05);
            border-left-color: var(--neon-magenta);
            transform: translateX(5px);
        }

        .info-item:hover .info-label {
            color: var(--neon-magenta);
        }

        .info-label {
            font-size: 0.7rem;
            color: rgba(0, 243, 255, 0.7);
            font-weight: 600;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: color 0.3s ease;
        }

        .info-label::before {
            content: '>';
            color: var(--neon-cyan);
            font-weight: 700;
        }

        .info-content {
            font-size: 1rem;
            color: var(--text-white);
            font-weight: 400;
            line-height: 1.6;
            word-break: break-word;
            white-space: pre-line;
        }

        /* 日期特殊样式 */
        .info-item.date-item {
            background: rgba(255, 238, 0, 0.03);
            border-left-color: var(--neon-yellow);
        }

        .info-item.date-item::before {
            background: linear-gradient(90deg, transparent, rgba(255, 238, 0, 0.1), transparent);
        }

        .info-item.date-item:hover {
            border-left-color: var(--neon-yellow);
        }

        .info-item.date-item .info-label {
            color: rgba(255, 238, 0, 0.7);
        }

        .info-item.date-item .info-label::before {
            color: var(--neon-yellow);
        }

        .date-content {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--neon-yellow);
        }

        .date-icon {
            width: 18px;
            height: 18px;
            fill: var(--neon-yellow);
            filter: drop-shadow(0 0 5px var(--neon-yellow));
        }

        /* 底部装饰 */
        .card-footer {
            padding-top: 20px;
            margin-top: 20px;
            border-top: 1px solid rgba(0, 243, 255, 0.2);
            text-align: center;
        }

        .footer-text {
            font-size: 0.65rem;
            color: rgba(0, 243, 255, 0.4);
            letter-spacing: 0.15em;
        }

        .footer-text span {
            color: var(--neon-magenta);
        }

        /* 装饰性代码 */
        .decor-code {
            position: absolute;
            font-size: 9px;
            color: rgba(0, 243, 255, 0.3);
            font-family: 'Share Tech Mono', monospace;
            line-height: 1.4;
            pointer-events: none;
        }

        .decor-code.top-left {
            top: 15px;
            left: 15px;
        }

        .decor-code.bottom-right {
            bottom: 15px;
            right: 15px;
            text-align: right;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            body {
                padding: 12px;
            }

            .card {
                width: 100%;
            }

            .card-inner {
                padding: 20px;
            }

            .card-title {
                font-size: 1.3rem;
            }

            .info-content {
                font-size: 0.9rem;
            }

            .decor-code {
                display: none;
            }
        }

        /* RGB分离效果类 */
        .rgb-split {
            position: relative;
        }

        .rgb-split::before,
        .rgb-split::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
        }

        .rgb-split::before {
            color: red;
            transform: translateX(-2px);
            clip-path: inset(0 50% 0 0);
        }

        .rgb-split::after {
            color: blue;
            transform: translateX(2px);
            clip-path: inset(0 0 0 50%);
        }
    </style>
</head>
<body>
    <div class="grid-bg"></div>
    <div class="scanlines"></div>
    <div class="vignette"></div>

    <div class="card">
        <div class="decor-code top-left" data-decor="SYS.2024.NTF">
            > INIT_SEQ: 0xFA29
            > ENCRYPTION: AES-256
            > CONNECTION: SECURE
        </div>
        <div class="decor-code bottom-right" data-decor="V.2.0.47">
            PROTOCOL: HTTPS/2
            CHANNEL: ENCRYPTED
            TIMESTAMP: SYNC
        </div>

        <div class="card-inner">
            <div class="card-header" data-decor="///">
                <div class="card-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                    </svg>
                </div>
                <h1 class="card-title" id="title" data-text="消息推送">消息推送</h1>
                <p class="card-subtitle">System Notification</p>
            </div>
            <div class="card-body">
                <div class="info-item">
                    <div class="info-label">Message Data</div>
                    <div class="info-content" id="message">无告警信息</div>
                </div>
                <div class="info-item date-item">
                    <div class="info-label">Timestamp</div>
                    <div class="date-content">
                        <svg class="date-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                        </svg>
                        <span class="info-content" id="date">无时间信息</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <p class="footer-text"><span>//</span> AUTO_GENERATED <span>//</span> SYSTEM_NOTIFICATION</p>
            </div>
        </div>
    </div>

    <script>
        function getUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            return {
                title: urlParams.get('title') || '消息推送',
                message: urlParams.get('message') || '无告警信息',
                date: urlParams.get('date') || '无时间信息'
            };
        }

        function fillContent() {
            const params = getUrlParams();
            const titleEl = document.getElementById('title');
            titleEl.textContent = params.title;
            titleEl.setAttribute('data-text', params.title);
            document.getElementById('message').textContent = params.message;
            document.getElementById('date').textContent = params.date;
        }

        window.onload = function() {
            fillContent();
        };
    </script>

</body>
</html>
      `;
      return new Response(html, {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
      });
    },
  };
