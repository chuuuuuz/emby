// OpenCode Go 用量面板脚本（供 Surge Information Panel 调用）
// 数据源：抓取 opencode.ai 的 Go 页面 HTML，正则解析三个周期的 usagePercent 与 resetInSec
// 凭据从 $argument 读取（模块配置面板填写），本脚本不含任何密钥，可安全公开托管。
// 注意：Surge 面板仅支持纯文本（title/content/style），无进度条富文本。

function parseArgs(s) {
  var out = { id: "", cookie: "" };
  if (!s) return out;
  var parts = String(s).split("&");
  for (var i = 0; i < parts.length; i++) {
    var kv = parts[i].split("=");
    if (kv.length < 2) continue;
    var k = kv[0].trim();
    var v = kv.slice(1).join("=").trim();
    if (k === "WorkspaceID") out.id = v;
    if (k === "AuthCookie") out.cookie = v;
  }
  return out;
}

function normalize(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\\u0022/g, '"');
}

function captureObjectBody(text, field) {
  var esc = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var re = new RegExp('["\']?' + esc + '["\']?\\s*:\\s*(?:\\$R\\[\\d+\\]\\s*=\\s*)?\\{([^{}]*)\\}', "s");
  var m = text.match(re);
  return m ? m[1] : null;
}

function captureNumber(text, field) {
  var esc = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var re = new RegExp('["\']?' + esc + '["\']?\\s*:\\s*"?(-?\\d+(?:\\.\\d+)?)"?');
  var m = text.match(re);
  return m ? parseFloat(m[1]) : null;
}

function fmtReset(sec) {
  if (sec == null) return "—";
  var h = Math.floor(sec / 3600);
  var m = Math.floor((sec % 3600) / 60);
  if (h >= 24) return Math.floor(h / 24) + "天" + (h % 24) + "时";
  return h + "时" + m + "分";
}

var creds = parseArgs($argument);

if (!creds.id || !creds.cookie) {
  $done({
    title: "OpenCode Go 用量",
    content: "未配置凭据：请在模块配置面板填 WorkspaceID 与 AuthCookie（地址栏 /workspace/ 后 wrk_xxx；Cookie 名为 auth）",
    style: "alert"
  });
  return;
}

var url = "https://opencode.ai/workspace/" + creds.id + "/go";
var cookieHeader = creds.cookie.indexOf("auth=") !== -1 ? creds.cookie : ("auth=" + creds.cookie);

$httpClient.get(
  {
    url: url,
    headers: {
      "Cookie": cookieHeader,
      "Accept": "text/html,application/xhtml+xml",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    }
  },
  function (error, response, data) {
    if (error) {
      $done({ title: "OpenCode Go 用量", content: "查询失败：" + error, style: "alert" });
      return;
    }
    var status = response && response.status ? response.status : 0;
    if (status === 401 || status === 403) {
      $done({ title: "OpenCode Go 用量", content: "Cookie 已失效，请在模块配置更新 AuthCookie", style: "alert" });
      return;
    }
    var text = normalize(data || "");
    var labels = { rollingUsage: "5 小时", weeklyUsage: "7 天", monthlyUsage: "月" };
    var windows = ["rollingUsage", "weeklyUsage", "monthlyUsage"];
    var lines = [];
    var allMissing = true;
    for (var i = 0; i < windows.length; i++) {
      var w = windows[i];
      var body = captureObjectBody(text, w);
      var pct = body ? captureNumber(body, "usagePercent") : null;
      var reset = body ? captureNumber(body, "resetInSec") : null;
      if (pct != null) allMissing = false;
      lines.push(labels[w] + "：" + (pct == null ? "—" : pct.toFixed(1) + "%") + "（重置 " + fmtReset(reset) + "）");
    }
    if (allMissing) {
      $done({ title: "OpenCode Go 用量", content: "页面未返回用量数据（可能已登出或结构变化）", style: "alert" });
      return;
    }
    var content = lines.join("\n") + "\n更新 " + new Date().toLocaleString();
    $done({ title: "OpenCode Go 用量", content: content, style: "info" });
  }
);
