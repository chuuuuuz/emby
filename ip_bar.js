(function () {
  const style = document.createElement("style");
  style.textContent = `
    #ip-bar {
      position: fixed;
      left: 50%;
      bottom: 12px;
      transform: translateX(-50%);
      z-index: 9999;
      transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease;
      opacity: 1;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #ip-bar.ip-hide {
      transform: translate(-50%, 150%);
      opacity: 0;
      pointer-events: none;
    }

    /* ===== 完全对齐 Nezha 毛玻璃参数 ===== */
    .ip-inner {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 9px 16px;
      border-radius: 999px;

      background: rgba(17, 25, 40, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(14px) saturate(160%);
      -webkit-backdrop-filter: blur(14px) saturate(160%);

      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.28),
        0 0 0 1px rgba(255, 255, 255, 0.06) inset;

      overflow: hidden;
      transform: translateZ(0);
    }

    /* ===== 流光边框：完全同步动画参数 ===== */
    .ip-inner::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 999px;
      padding: 1.5px;

      background: linear-gradient(
        120deg,
        rgba(255,255,255,0.22),
        rgba(120,170,255,0.35),
        rgba(255,255,255,0.22)
      );
      background-size: 300% 300%;
      animation: nezhaBorderFlow 10s linear infinite;

      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;

      pointer-events: none;
      opacity: 0.9;
    }

    /* ===== Hover 扫光：同款节奏 ===== */
    .ip-inner::after {
      content: "";
      position: absolute;
      top: -50%;
      left: -60%;
      width: 60%;
      height: 200%;
      transform: rotate(20deg);

      background: linear-gradient(
        to right,
        rgba(255,255,255,0),
        rgba(255,255,255,0.18),
        rgba(255,255,255,0)
      );
      opacity: 0;
      transition: opacity .25s ease;
      pointer-events: none;
    }
    .ip-inner:hover::after {
      opacity: 1;
      animation: ipSweep 1.1s ease;
    }
    @keyframes ipSweep {
      0%   { left: -80%; }
      100% { left: 140%; }
    }

    /* ===== 小蓝光状态点（统一冷色调）===== */
    .ip-icon {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      flex-shrink: 0;

      background: rgba(130, 190, 255, 0.85);
      box-shadow:
        0 0 0 2px rgba(255,255,255,0.18),
        0 0 14px rgba(130,190,255,0.55);
    }

    .ip-text {
      font-size: 13.5px;
      white-space: nowrap;
      font-weight: 600;
      letter-spacing: 0.2px;
      color: rgba(255,255,255,0.92);
      text-shadow: 0 2px 10px rgba(0,0,0,0.25);
    }

    @media (max-width: 600px) {
      .ip-inner { padding: 7px 12px; gap: 8px; }
      .ip-text { font-size: 12px; }
    }
  `;
  document.head.appendChild(style);

  /* ===== 下面逻辑保持不变 ===== */

  function isIPv4(ip) {
    return ip && ip.includes(".") && !ip.includes(":");
  }

  function getFromIpapi() {
    return fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => ({
        ip: d.ip || "",
        country: d.country_name || "",
        city: d.city || ""
      }));
  }

  function getFromIpinfo() {
    return fetch("https://ipinfo.io/json")
      .then(r => r.json())
      .then(d => ({
        ip: d.ip || "",
        country: d.country || "",
        city: d.city || d.region || ""
      }));
  }

  function createBar() {
    if (document.getElementById("ip-bar")) return;
    const bar = document.createElement("div");
    bar.id = "ip-bar";
    bar.innerHTML = `
      <div class="ip-inner">
        <div class="ip-icon"></div>
        <div class="ip-text"><span id="ip-val">Loading...</span></div>
      </div>`;
    document.body.appendChild(bar);
  }

  function init() {
    createBar();
    const el = document.getElementById("ip-val");

    getFromIpapi()
      .catch(getFromIpinfo)
      .then(res => {
        const ip = res.ip || "";
        const country = res.country || "";
        const city = res.city || "";
        const loc = (country && city && country !== city)
          ? `${country} · ${city}`
          : (country || city);

        if (isIPv4(ip))
          el.textContent = loc ? `Your IP: ${ip} — ${loc}` : `Your IP: ${ip}`;
        else
          el.textContent = loc ? `IPv6 network — ${loc}` : `IPv6 network`;
      })
      .catch(() => el.textContent = "Failed to get IP");

    let lastScrollTop = 0;
    window.addEventListener("scroll", function() {
      const bar = document.getElementById("ip-bar");
      if (!bar) return;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 50) {
        bar.classList.add("ip-hide");
      } else {
        bar.classList.remove("ip-hide");
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
