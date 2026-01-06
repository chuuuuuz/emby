<!-- =========================
  Nezha 探针 UI 自定义配置
  - 背景 / 主题 / Logo / 描述
  - UI 美化：毛玻璃 + 流光 + 扫光
  - 功能增强：强制“详情+网络”同时显示
  - 精简：隐藏/删除部分模块与按钮
  - 特效：雨滴 + 底部溅射 + 低频闪电
========================= -->

<script>
  /* ========= Nezha UI 全局配置 ========= */

  // 页面背景图
  window.CustomBackgroundImage = "https://i.111666.best/image/mQpiGKeNyYQPr4GdZZIfoL.jpeg";

  // 移动端页面背景图
  window.CustomMobileBackgroundImage = "https://i.111666.best/image/IKhZuMB1YWgm47yQsetYFS.png";

  // 显示上下行流量（false=不显示）
  window.ShowNetTransfer = false;

  // 固定顶部服务器名称
  window.FixedTopServerName = true;

  // 强制默认颜色主题（dark 或 light）
  window.ForceTheme = "dark";

  // 关闭动画���物插图
  window.DisableAnimatedMan = true;

  // 强制开启网络延迟图表削峰
  window.ForcePeakCutEnabled = true;

  // 使用 SVG 标志
  window.ForceUseSvgFlag = true;

  // 使用自定义 Logo
  window.CustomLogo =
    "https://raw.githubusercontent.com/lige47/QuanX-icon-rule/main/icon/03CNSoft/waixingren.png";

  // 自定义页面描述
  window.CustomDesc = "一些小鸡";
</script>

<style>
  /* ========= 顶部/小标签按钮（a 标签）美化：毛玻璃 + 扫光 ========= */

  a.flex.items-center.gap-1.text-sm.font-medium.opacity-50 {
    background-color: rgba(255, 255, 255, 0.01) !important;
    backdrop-filter: blur(5px) saturate(100%);
    -webkit-backdrop-filter: blur(5px) saturate(100%);
    border-radius: 9999px !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    padding: 6px 12px !important;
    margin-left: 0.5rem !important;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: none !important;
    opacity: 1 !important;
    color: #f0f0f0 !important;
  }

  /* 暗色模式下的 a 标签样式 */
  .dark a.flex.items-center.gap-1.text-sm.font-medium.opacity-50 {
    background-color: rgba(30, 30, 30, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #f0f0f0 !important;
  }

  /* 悬停文字颜色 */
  a.flex.items-center.gap-1.text-sm.font-medium.opacity-50:hover {
    color: #ffffff !important;
  }

  .dark a.flex.items-center.gap-1.text-sm.font-medium.opacity-50:hover {
    color: #ffffff !important;
  }

  /* 倾斜渐变扫光层 */
  a.flex.items-center.gap-1.text-sm.font-medium.opacity-50::after {
    content: "";
    position: absolute;
    top: 0;
    left: -150%;
    width: 100%;
    height: 100%;
    transform: skewX(-30deg);
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 45%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.1) 55%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: left 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  }

  /* hover 扫光 */
  a.flex.items-center.gap-1.text-sm.font-medium.opacity-50:hover::after {
    left: 150%;
  }
</style>

<!-- 流量进度条脚本 -->
<script src="https://cdn.jsdelivr.net/gh/ziwiwiz/nezha-ui@main/traffic-progress.js"></script>

<style>
  /* ========= 全局 UI 美化 ========= */

  /* 隐藏页脚 */
  footer,
  .site-footer {
    display: none !important;
  }

  /* iOS 毛玻璃统一风格：卡片 / 圆角按钮 / 过滤条 / 底部条 */
  [class*="bg-card"],
  button[class*="rounded-full"],
  .ios-glass-filter-bar,
  .bottom-marquee {
    background-color: rgba(255, 255, 255, 0.01) !important;
    backdrop-filter: blur(5px) saturate(100%);
    -webkit-backdrop-filter: blur(5px) saturate(100%);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  /* 暗色模式下玻璃底色与边框 */
  .dark [class*="bg-card"],
  .dark button[class*="rounded-full"],
  .dark .ios-glass-filter-bar,
  .dark .bottom-marquee {
    background-color: rgba(30, 30, 30, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* 过滤条内部选中按钮背景修复 */
  .light .ios-glass-filter-bar div[class*="bg-white"] {
    background-color: rgba(255, 255, 255, 0.5) !important;
  }

  .dark .ios-glass-filter-bar div[class*="bg-neutral-"] {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }

  /* 卡片/按钮/过滤条 hover 扫光 */
  [class*="bg-card"]::after,
  button[class*="rounded-full"]::after,
  .ios-glass-filter-bar::after,
  .bottom-marquee::after {
    content: "";
    position: absolute;
    top: 0;
    left: -150%;
    width: 100%;
    height: 100%;
    transform: skewX(-30deg);
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 45%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.1) 55%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: left 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  }

  [class*="bg-card"]:hover::after,
  button[class*="rounded-full"]:hover::after,
  .ios-glass-filter-bar:hover::after,
  .bottom-marquee:hover::after {
    left: 150%;
  }

  /* 隐藏一些不需要的按钮/入口（按你现有选择器保留原样） */
  [id="radix-:r0:"],
  [id="radix-:r2:"],
  button:has(.lucide-image-minus),
  button.rounded-\[50px\][aria-haspopup="dialog"],
  .server-overview-controls section.flex.items-center.gap-2.w-full.overflow-hidden
    button:nth-child(-n + 3) {
    display: none !important;
  }

  /* 全局文本提亮（按你现有选择器保留原样） */
  .text-xs,
  .text-sm,
  .text-base,
  .text-lg,
  .font-semibold,
  .font-bold,
  .font-medium,
  .text-\[10px\],
  .text-\[10\.5px\],
  .text-\[11px\],
  .text-\[12px\],
  .text-\[13px\] {
    color: #f0f0f0 !important;
  }

  .dark .text-xs,
  .dark .text-sm,
  .dark .text-base,
  .dark .text-lg,
  .dark .font-semibold,
  .dark .font-bold,
  .dark .font-medium,
  .dark .text-\[10px\],
  .dark .text-\[10\.5px\],
  .dark .text-\[11px\],
  .dark .text-\[12px\],
  .dark .text-\[13px\] {
    color: #f0f0f0 !important;
  }

  /* 图表 Y 轴 + tooltip 字色 */
  .recharts-cartesian-axis-tick-value {
    fill: #e0e0e0 !important;
  }

  .dark .recharts-cartesian-axis-tick-value {
    fill: #999999 !important;
  }

  .recharts-tooltip-wrapper .font-medium.text-foreground.tabular-nums {
    color: #999999 !important;
  }

  .dark .recharts-tooltip-wrapper .font-medium.text-foreground.tabular-nums {
    color: #999999 !important;
  }

  .recharts-tooltip-wrapper .font-medium {
    color: #666666 !important;
  }

  .dark .recharts-tooltip-wrapper .font-medium {
    color: #666666 !important;
  }
</style>

<!-- =========================================================
  强制“详情 + 网络”同时加载并显示
  - 隐藏 tab 区块（详情/网络切换）
  - 自动点击一次“网络”触发网络面板加载
  - 强制 div3、div4 同时 display:block
========================================================= -->
<script>
  (() => {
    const selectorTabWrap = "#root .server-info-tab";

    // 仍沿用你当前的 nth-child 定位（不改动）
    const selector3 =
      "#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > div:nth-child(3)";
    const selector4 =
      "#root > div > main > div.mx-auto.w-full.max-w-5xl.px-0.flex.flex-col.gap-4.server-info > div:nth-child(4)";

    let scheduled = false;
    let clickedNet = false;
    let retry = 0;
    const MAX_RETRY = 30;

    // 根据 tab 文本查找按钮（“详情/网络”）
    function getTabByText(text) {
      const wrap = document.querySelector(selectorTabWrap);
      if (!wrap) return null;
      const tabs = wrap.querySelectorAll(".cursor-pointer");
      for (const el of tabs) {
        const label = (el.querySelector("p")?.textContent || el.textContent || "").trim();
        if (label === text) return el;
      }
      return null;
    }

    // 隐藏 tab 的 section（只保留内容区）
    function hideTabSection() {
      const wrap = document.querySelector(selectorTabWrap);
      if (!wrap) return;
      const section = wrap.closest("section");
      if (section) section.style.display = "none";
    }

    // 强制 div3/div4 同时显示
    function forceBothVisible() {
      const div3 = document.querySelector(selector3);
      const div4 = document.querySelector(selector4);
      if (div3) div3.style.display = "block";
      if (div4) div4.style.display = "block";
    }

    // 判断“网络面板是否已加载”（保持你现有判断逻辑）
    function networkSeemsLoaded() {
      const root = document.querySelector("#root");
      if (!root) return false;

      const text = root.innerText || "";
      if (
        text.includes("网络") &&
        (text.includes("上行") || text.includes("下行") || text.includes("延迟") || text.includes("流量"))
      ) {
        return true;
      }

      if (root.querySelector(".recharts-wrapper, svg.recharts-surface, canvas")) {
        return true;
      }

      return false;
    }

    // 触发点击“网络”tab 以加载网络面板
    function clickNetIfNeeded() {
      if (clickedNet && networkSeemsLoaded()) return;
      if (retry >= MAX_RETRY) return;

      const netTab = getTabByText("网络");
      if (netTab) {
        netTab.click();
        clickedNet = true;
        retry++;
      }
    }

    // 判断是否处在 server-info 页面
    function isOnServerInfoPage() {
      return !!document.querySelector("#root .server-info-tab");
    }

    function tick() {
      scheduled = false;

      const nowInPage = isOnServerInfoPage();

      if (nowInPage) {
        hideTabSection();
        clickNetIfNeeded();

        // 给 React 时间渲染，再强制显示
        setTimeout(forceBothVisible, 800);
        forceBothVisible();
      } else {
        // 离开页面：重置，方便下次进入继续生效
        clickedNet = false;
        retry = 0;
      }
    }

    // 监听 root 变化以适配 React 渲染/路由切换
    const root = document.querySelector("#root");
    if (!root) return;

    const ob = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(tick);
    });

    ob.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    tick();
  })();
</script>

<style>
  /* ========= 隐藏“CPU/Mem/Disk/Process/TCP/UDP/Upload/Download”这一排 ========= */
  #root .mb-2.flex.flex-wrap.items-center.gap-4:has(span.text-\[10px\].text-muted-foreground) {
    display: none !important;
  }
</style>

<!-- 删除 “👋 概览” 标题（仅删这一项） -->
<script>
  (() => {
    function removeOverviewTitle() {
      const targets = document.querySelectorAll("p.text-base.font-semibold");
      for (const p of targets) {
        if (p.textContent.trim() === "👋 概览") {
          p.remove();
          return true;
        }
      }
      return false;
    }

    // 先尝试一次
    if (removeOverviewTitle()) return;

    // React 重渲染兜底
    const root = document.querySelector("#root");
    if (!root) return;

    const ob = new MutationObserver(() => {
      removeOverviewTitle();
    });

    ob.observe(root, { childList: true, subtree: true });
  })();
</script>

<!-- 标记“当前时间”模块：只给这一行加 class（避免误伤其他 flex 行） -->
<script>
  (() => {
    function markCurrentTimeRow() {
      const ps = document.querySelectorAll("#root p.text-sm.font-medium.opacity-50");
      for (const p of ps) {
        if ((p.textContent || "").trim() === "当前时间") {
          const row = p.closest(".flex.items-center.gap-1");
          if (row && !row.classList.contains("nezha-current-time")) {
            row.classList.add("nezha-current-time");
          }
        }
      }
    }

    markCurrentTimeRow();

    const root = document.querySelector("#root");
    if (!root) return;

    const ob = new MutationObserver(() => markCurrentTimeRow());
    ob.observe(root, { childList: true, subtree: true });
  })();
</script>

<style>
  /* ========= 当前时间模块：删除“当前时间”+ 居中 + 毛玻璃胶囊 ========= */

  /* 当前时间行：居中容器 */
  #root .nezha-current-time {
    width: 100% !important;
    justify-content: center !important;
    align-items: center !important;
    margin: clamp(10px, 2.2vw, 18px) 0 clamp(12px, 2.8vw, 22px) !important;
  }

  /* 删除“当前时间”文字 */
  #root .nezha-current-time > p {
    display: none !important;
  }

  /* 时间胶囊：包裹数字 */
  #root .nezha-current-time > div {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: clamp(6px, 1.2vw, 14px) !important;

    padding: clamp(10px, 1.6vw, 16px) clamp(14px, 2.6vw, 26px) !important;
    border-radius: 9999px !important;

    background: rgba(255, 255, 255, 0.06) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;

    backdrop-filter: blur(12px) saturate(140%) !important;
    -webkit-backdrop-filter: blur(12px) saturate(140%) !important;

    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
  }

  /* 暗色模式下时间胶囊适配 */
  .dark #root .nezha-current-time > div {
    background: rgba(20, 20, 20, 0.35) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  }

  /* 时间数字：自适应字号（手机~桌面） */
  #root .nezha-current-time [data-issues-count-animation] {
    font-size: clamp(2.4rem, 6vw, 4.2rem) !important;
    font-weight: 700 !important;
    line-height: 1 !important;
    letter-spacing: 0.08em;

    color: #fff !important;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.35), 0 0 24px rgba(120, 180, 255, 0.22);
  }

  /* 冒号：跟随自适应 */
  #root .nezha-current-time span.mb-px {
    font-size: clamp(2.1rem, 5vw, 3.8rem) !important;
    margin: 0 clamp(4px, 0.9vw, 10px) !important;
    opacity: 0.75 !important;
    color: #fff !important;
  }

  /* 数字位宽固定：减少动画抖动 */
  #root .nezha-current-time .min-w-\[0\.6em\] {
    min-width: 1.25em !important;
  }
</style>

<style>
  /* ========= 当前时间胶囊：流光边框 + 悬停扫光（仅此模块） ========= */

  /* 胶囊承载伪元素 */
  #root .nezha-current-time > div {
    position: relative !important;
    overflow: hidden !important;
  }

  /* 1) 常驻流光边框 */
  #root .nezha-current-time > div::before {
    content: "";
    position: absolute;
    inset: -2px; /* 边框厚度 */
    border-radius: 9999px;
    padding: 2px;
    background: linear-gradient(
      120deg,
      rgba(87, 166, 255, 0),
      rgba(87, 166, 255, 0.55),
      rgba(124, 92, 255, 0.55),
      rgba(53, 208, 127, 0.45),
      rgba(87, 166, 255, 0)
    );

    /* 只显示边框，不覆盖内容 */
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;

    opacity: 0.75;
    filter: blur(0.2px);
    pointer-events: none;
    z-index: 0;

    animation: nezhaBorderFlow 4s linear infinite;
  }

  /* 边框流动动画 */
  @keyframes nezhaBorderFlow {
    0% {
      transform: translateX(-20%);
    }
    100% {
      transform: translateX(20%);
    }
  }

  /* 内容始终在最上层 */
  #root .nezha-current-time > div > * {
    position: relative;
    z-index: 2;
  }

  /* 2) 悬停扫光：倾斜渐变光带 */
  #root .nezha-current-time > div::after {
    content: "";
    position: absolute;
    top: 0;
    left: -160%;
    width: 120%;
    height: 100%;
    transform: skewX(-28deg);
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 45%,
      rgba(255, 255, 255, 0.18) 50%,
      rgba(255, 255, 255, 0.1) 55%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: left 0.65s cubic-bezier(0.25, 1, 0.5, 1);
    pointer-events: none;
    z-index: 1;
  }

  /* hover 触发扫光 */
  #root .nezha-current-time > div:hover::after {
    left: 160%;
  }

  /* hover 时边框更亮 */
  #root .nezha-current-time > div:hover::before {
    opacity: 0.95;
  }

  /* 移���端无 hover：关闭扫光避免误触 */
  @media (hover: none) {
    #root .nezha-current-time > div::after {
      display: none !important;
    }
  }
</style>

<!-- 删除 Search 搜索按钮（仅删 title=Search 且 sr-only 为 Search 的按钮） -->
<script>
  (() => {
    function removeSearchButton() {
      const buttons = document.querySelectorAll('#root button[title="Search"]');
      for (const btn of buttons) {
        const sr = btn.querySelector("span.sr-only");
        if (sr && sr.textContent.trim() === "Search") {
          btn.remove();
          return true;
        }
      }
      return false;
    }

    if (removeSearchButton()) return;

    const root = document.querySelector("#root");
    if (!root) return;

    let scheduled = false;
    const ob = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        removeSearchButton();
      });
    });

    ob.observe(root, { childList: true, subtree: true });
  })();
</script>

<!-- =========================================================
  背景特效：雨滴 + 底部溅射 + 低频闪电（无雾版）
  - Canvas fixed 覆盖全屏，但 pointer-events:none 不阻挡操作
  - 移动端自动降低雨滴数量与溅射概率
========================================================= -->
<script>
  (() => {
    /* ========= 配置 ========= */
    const CONFIG = {
      // 雨滴参数
      rainCount: 170,
      rainSpeed: 12,
      rainLength: 18,
      rainThickness: 1.15,
      rainOpacity: 0.38,
      rainColor: "180,200,255",

      // 溅射参数
      splashChance: 0.55,
      splashLife: 18,
      splashMaxRadius: 14,
      splashLineWidth: 1.1,
      splashOpacity: 0.35,

      // 闪电参数（低频）
      lightningEnabled: true,
      lightningMinMs: 60000,
      lightningMaxMs: 120000,
      lightningFlashCount: [1, 2],
      lightningOpacity: 0.16,
      lightningDurationMs: 160,
    };

    /* ========= Canvas 初始化 ========= */
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.id = "nezha-rain-canvas";

    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      zIndex: "0",
      pointerEvents: "none",
    });

    document.body.appendChild(canvas);

    let dpr = 1;

    // 根据 DPR 设置 canvas 清晰度
    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    /* ========= 雨滴 ========= */
    let drops = [];

    // 初始化雨滴集合
    function initRain() {
      drops = [];
      for (let i = 0; i < CONFIG.rainCount; i++) {
        drops.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speed: CONFIG.rainSpeed + Math.random() * 6,
          length: CONFIG.rainLength + Math.random() * 10,
        });
      }
    }

    initRain();

    /* ========= 溅射 ========= */
    const splashes = [];

    // 落地生成水花（概率触发）
    function spawnSplash(x, y) {
      if (Math.random() > CONFIG.splashChance) return;

      const count = Math.random() < 0.6 ? 1 : 2;
      for (let i = 0; i < count; i++) {
        splashes.push({
          x: x + (Math.random() - 0.5) * 10,
          y,
          life: CONFIG.splashLife,
          maxLife: CONFIG.splashLife,
          radius: 2 + Math.random() * 2,
          maxRadius: CONFIG.splashMaxRadius * (0.7 + Math.random() * 0.6),
          tilt: (Math.random() - 0.5) * 0.9,
        });
      }
    }

    // 绘制水花
    function drawSplashes() {
      ctx.lineWidth = CONFIG.splashLineWidth;

      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.life--;

        const t = 1 - s.life / s.maxLife;
        const radius = s.radius + (s.maxRadius - s.radius) * t;
        const alpha = CONFIG.splashOpacity * (1 - t);

        ctx.strokeStyle = `rgba(${CONFIG.rainColor}, ${alpha})`;
        ctx.beginPath();

        const start = Math.PI * (1.05 + s.tilt);
        const end = Math.PI * (1.95 + s.tilt);
        ctx.arc(s.x, s.y, radius, start, end);
        ctx.stroke();

        // 小水花刺
        if (t < 0.55) {
          ctx.beginPath();
          ctx.moveTo(s.x - radius * 0.35, s.y - 1);
          ctx.lineTo(s.x - radius * 0.55, s.y - 6);
          ctx.moveTo(s.x + radius * 0.35, s.y - 1);
          ctx.lineTo(s.x + radius * 0.55, s.y - 6);
          ctx.stroke();
        }

        if (s.life <= 0) splashes.splice(i, 1);
      }
    }

    /* ========= 绘制雨滴 ========= */
    function drawRain() {
      ctx.strokeStyle = `rgba(${CONFIG.rainColor}, ${CONFIG.rainOpacity})`;
      ctx.lineWidth = CONFIG.rainThickness;
      ctx.lineCap = "round";

      const h = window.innerHeight;
      const w = window.innerWidth;

      for (const d of drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;

        // 落到底部：溅射 + 复位到顶部
        if (d.y > h) {
          spawnSplash(d.x, h - 2);
          d.y = -d.length;
          d.x = Math.random() * w;
        }
      }
    }

    /* ========= 闪电 ========= */
    let lightningAlpha = 0;
    let nextLightningAt = 0;
    let flashing = false;
    let flashLeft = 0;

    // 生成随机数
    function rand(a, b) {
      return a + Math.random() * (b - a);
    }

    // 安排下一次闪电时间
    function scheduleLightning(now) {
      nextLightningAt = now + rand(CONFIG.lightningMinMs, CONFIG.lightningMaxMs);
    }
    scheduleLightning(Date.now());

    // 更新闪电状态（低频闪烁）
    function updateLightning(now) {
      if (!CONFIG.lightningEnabled) return;

      if (!flashing && now >= nextLightningAt) {
        flashLeft = Math.floor(rand(CONFIG.lightningFlashCount[0], CONFIG.lightningFlashCount[1] + 1));
        flashing = true;
        scheduleLightning(now);
      }

      if (flashing && lightningAlpha <= 0.001) {
        lightningAlpha = CONFIG.lightningOpacity;
        setTimeout(() => {
          lightningAlpha = 0;
          flashLeft--;
          if (flashLeft <= 0) flashing = false;
        }, CONFIG.lightningDurationMs);
      }
    }

    // 叠加闪电白光
    function drawLightning() {
      if (lightningAlpha <= 0) return;
      ctx.fillStyle = `rgba(255,255,255, ${lightningAlpha})`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    /* ========= 主循环 ========= */
    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      drawRain();
      drawSplashes();
      drawLightning();

      updateLightning(Date.now());
      requestAnimationFrame(animate);
    }
    animate();

    /* ========= 暗色模式增强 ========= */
    if (document.documentElement.classList.contains("dark")) {
      CONFIG.rainOpacity = 0.45;
      CONFIG.lightningOpacity = 0.18;
    }

    /* ========= 移动端降级 ========= */
    if (window.innerWidth < 768) {
      CONFIG.rainCount = Math.floor(CONFIG.rainCount * 0.6);
      CONFIG.splashChance = 0.35;
      initRain();
    }
  })();
</script>
