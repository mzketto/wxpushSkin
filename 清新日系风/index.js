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
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: "Noto Sans JP", "Noto Serif JP", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
            background: linear-gradient(135deg, #faf8f5 0%, #f5f0eb 50%, #eef2f0 100%);
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        /* 樱花飘落背景 */
        .sakura-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }

        .sakura {
            position: absolute;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #ffb7c5 0%, #ff8fa3 70%, transparent 100%);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            opacity: 0.6;
            animation: fall linear infinite;
        }

        .sakura:nth-child(1) { left: 10%; animation-duration: 15s; animation-delay: 0s; }
        .sakura:nth-child(2) { left: 25%; animation-duration: 18s; animation-delay: 2s; }
        .sakura:nth-child(3) { left: 40%; animation-duration: 14s; animation-delay: 4s; }
        .sakura:nth-child(4) { left: 55%; animation-duration: 16s; animation-delay: 1s; }
        .sakura:nth-child(5) { left: 70%; animation-duration: 17s; animation-delay: 3s; }
        .sakura:nth-child(6) { left: 85%; animation-duration: 15s; animation-delay: 5s; }
        .sakura:nth-child(7) { left: 5%; animation-duration: 19s; animation-delay: 6s; }
        .sakura:nth-child(8) { left: 95%; animation-duration: 13s; animation-delay: 7s; }

        @keyframes fall {
            0% {
                transform: translateY(-10vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            90% {
                opacity: 0.4;
            }
            100% {
                transform: translateY(110vh) rotate(360deg);
                opacity: 0;
            }
        }

        /* 纸纹质感背景 */
        .paper-texture {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
            z-index: -1;
        }

        .card {
            width: 90%;
            max-width: 600px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 24px;
            box-shadow:
                0 4px 24px rgba(149, 157, 165, 0.1),
                0 1px 3px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.8);
            position: relative;
            z-index: 1;
            overflow: hidden;
            backdrop-filter: blur(10px);
        }

        /* 和纸风格顶部装饰 */
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg,
                #ffb7c5 0%,
                #ffd4e0 25%,
                #c5e8e3 50%,
                #b8d4e8 75%,
                #ffb7c5 100%
            );
            background-size: 200% 100%;
            animation: gradient-flow 8s ease infinite;
        }

        @keyframes gradient-flow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .card-header {
            padding: 32px 32px 24px;
            text-align: center;
            border-bottom: 1px solid rgba(200, 180, 170, 0.2);
            background: linear-gradient(180deg, rgba(255, 248, 245, 0.5) 0%, transparent 100%);
        }

        .card-icon {
            width: 56px;
            height: 56px;
            margin: 0 auto 16px;
            background: linear-gradient(135deg, #ffb7c5 0%, #ffd4e0 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(255, 183, 197, 0.4);
        }

        .card-icon svg {
            width: 28px;
            height: 28px;
            fill: white;
        }

        .card-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #5d4e4a;
            letter-spacing: 0.1em;
            margin-bottom: 4px;
        }

        .card-subtitle {
            font-size: 0.85rem;
            color: #a89890;
            font-weight: 300;
            letter-spacing: 0.05em;
        }

        .card-body {
            padding: 28px 32px 32px;
        }

        .info-item {
            margin-bottom: 24px;
            padding: 20px 24px;
            background: linear-gradient(135deg, #faf8f5 0%, #f5f0eb 100%);
            border-radius: 16px;
            border: 1px solid rgba(200, 180, 170, 0.15);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .info-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #ffb7c5 0%, #c5e8e3 100%);
            border-radius: 4px 0 0 4px;
            opacity: 0.8;
        }

        .info-item:last-child {
            margin-bottom: 0;
        }

        .info-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(149, 157, 165, 0.12);
            border-color: rgba(255, 183, 197, 0.3);
        }

        .info-label {
            font-size: 0.8rem;
            color: #b8a898;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .info-label::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffb7c5 0%, #c5e8e3 100%);
        }

        .info-content {
            font-size: 1.1rem;
            color: #5d4e4a;
            font-weight: 400;
            line-height: 1.7;
            word-break: break-word;
            white-space: pre-line;
        }

        /* 日期特殊样式 */
        .info-item.date-item {
            background: linear-gradient(135deg, #f0f7f5 0%, #e8f4f1 100%);
        }

        .info-item.date-item::before {
            background: linear-gradient(180deg, #c5e8e3 0%, #b8d4e8 100%);
        }

        .date-content {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #6b8e8a;
        }

        .date-icon {
            width: 20px;
            height: 20px;
            fill: #a8c5bf;
        }

        /* 底部装饰 */
        .card-footer {
            padding: 20px 32px;
            text-align: center;
            border-top: 1px solid rgba(200, 180, 170, 0.15);
            background: linear-gradient(0deg, rgba(255, 248, 245, 0.3) 0%, transparent 100%);
        }

        .footer-text {
            font-size: 0.75rem;
            color: #c8beb4;
            letter-spacing: 0.1em;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            body {
                padding: 16px;
            }

            .card {
                width: 100%;
                border-radius: 20px;
            }

            .card-header {
                padding: 24px 24px 20px;
            }

            .card-icon {
                width: 48px;
                height: 48px;
                margin-bottom: 12px;
            }

            .card-icon svg {
                width: 24px;
                height: 24px;
            }

            .card-title {
                font-size: 1.25rem;
            }

            .card-body {
                padding: 20px 24px 24px;
            }

            .info-item {
                padding: 16px 20px;
                margin-bottom: 16px;
            }

            .info-content {
                font-size: 1rem;
            }
        }

        /* 淡入动画 */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .card {
            animation: fadeInUp 0.6s ease-out;
        }

        .info-item:nth-child(1) {
            animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .info-item:nth-child(2) {
            animation: fadeInUp 0.6s ease-out 0.35s both;
        }
    </style>
</head>
<body>
    <div class="sakura-bg">
        <div class="sakura"></div>
        <div class="sakura"></div>
        <div class="sakura"></div>
        <div class="sakura"></div>
        <div class="sakura"></div>
        <div class="sakura"></div>
        <div class="sakura"></div>
        <div class="sakura"></div>
    </div>
    <div class="paper-texture"></div>

    <div class="card">
        <div class="card-header">
            <div class="card-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                </svg>
            </div>
            <h1 class="card-title" id="title">消息推送</h1>
            <p class="card-subtitle">Notification</p>
        </div>
        <div class="card-body">
            <div class="info-item">
                <div class="info-label">通知内容</div>
                <div class="info-content" id="message">无告警信息</div>
            </div>
            <div class="info-item date-item">
                <div class="info-label">时间</div>
                <div class="date-content">
                    <svg class="date-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                    </svg>
                    <span class="info-content" id="date">无时间信息</span>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <p class="footer-text">均由系统自动发送 · System Automated</p>
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
            document.getElementById('title').textContent = params.title;
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
