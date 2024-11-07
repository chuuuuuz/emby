const $ = new Env("微博超话");

//可自定参数👇
$.time = 1000; //签到间隔默认1s
$.delete_cookie = false; //如果需要清除Cookie请改为true，清除后改为false
$.msg_max_num = 30; //自定义超话页面数量
$.check_first = true; //true为先检查签到状态，再签到；false则为直接签到

//debug选项
const debugurl = false;
const debugstatus = false;
const debugcheckin = false;

if ($.getdata("wb_delete_cookie") != undefined) {
  if (
    $.getdata("wb_delete_cookie") == true ||
    $.getdata("wb_delete_cookie") == "true"
  )
    $.delete_cookie = true;
  else $.delete_cookie = false;
}
if ($.getdata("wb_msg_max_num") != undefined) {
  if ($.getdata("wb_msg_max_num") != "")
    $.msg_max_num = $.getdata("wb_msg_max_num") * 1;
}
if ($.getdata("wb_request_time") != undefined) {
  if ($.getdata("wb_request_time") != "")
    $.time = $.getdata("wb_request_time") * 1;
}
if ($.getdata("wb_check_first") != undefined) {
  if (
    $.getdata("wb_check_first") == true ||
    $.getdata("wb_check_first") == "true"
  )
    $.check_first = true;
  else $.check_first = false;
}

const tokenurl = "evil_tokenurl";
const tokencheckinurl = "evil_tokencheckinurl";
const tokenheaders = "evil_tokenheaders";
const tokensinceurl = "evil_tokensinceurl";
const tokensinceheaders = "evil_tokensinceheaders";
const tokencheckinheaders = "evil_tokencheckinheaders";
var allnumber;
var pagenumber;
var listurl = $.getdata(tokenurl);
var listheaders = $.getdata(tokenheaders);
var checkinurl = $.getdata(tokencheckinurl);
var checkinheaders = $.getdata(tokencheckinheaders);
var sinceurl = $.getdata(tokensinceurl);
var sinceheaders = $.getdata(tokensinceheaders);
$.message = [];
$.name_list = [];
$.id_list = [];
$.sign_status = [];
$.sinceinserturl = [];
$.successNum = 0;
$.failNum = 0;
$.stopNum = 0;

!(async () => {
  if ($.delete_cookie) {
    deletecookie();
    $.msg(
      "微博超话",
      "✅Cookie清除成功",
      "请将脚本内deletecookie改为false，按照流程重新获取Cookie。"
    );
    return;
  }
  if ($.check_first) {
    if (
      listurl == undefined ||
      listheaders == undefined ||
      checkinurl == undefined ||
      checkinheaders == undefined ||
      sinceurl == undefined ||
      sinceheaders == undefined ||
      listurl == "" ||
      listheaders == "" ||
      checkinurl == "" ||
      checkinheaders == "" ||
      sinceurl == "" ||
      sinceheaders == ""
    ) {
      $.msg(
        `微博超话`,
        "🚫检测到没有cookie或者cookie不完整",
        "请认真阅读配置流程，并重新获取cookie。"
      );
      return;
    }
  } else {
    if (
      listurl == undefined ||
      listheaders == undefined ||
      checkinurl == undefined ||
      checkinheaders == undefined ||
      listurl == "" ||
      listheaders == "" ||
      checkinurl == "" ||
      checkinheaders == ""
    ) {
      $.msg(
        `微博超话`,
        "🚫检测到没有cookie或者cookie不完整",
        "请认真阅读配置流程，并重新获取cookie。"
      );
      return;
    }
  }
  await getnumber();
  if ($.check_first) {
    var firsturl = sinceurl.replace(
      new RegExp("&since_id=.*?&moduleID"),
      "&moduleID"
    );
    $.sinceinserturl.push(firsturl);
    for (var i = 0; i <= pagenumber - 2; i++) {
      await geturl(i);
    }
    for (i = 0; i < pagenumber; i++) {
      await getSignStatus(i);
    }
    for (i in $.name_list) {
      await checkin($.id_list[i], $.name_list[i], $.sign_status[i]);
      $.wait($.time);
      if ($.stopNum != 0) {
        deletecookie();
        $.msg("微博超话", "🚨检测到Cookie失效，脚本已自动停止并清除Cookie");
        console.log("🚨检测到Cookie失效，脚本已自动停止并清除Cookie");
        return;
      }
    }
  } else {
    for (i = 1; i <= pagenumber; i++) {
      await getid(i);
    }
    for (i in $.name_list) {
      await checkin($.id_list[i], $.name_list[i], false);
      $.wait($.time);
      if ($.stopNum != 0) {
        deletecookie();
        $.msg("微博超话", "🚨检测到Cookie失效，脚本已自动停止并清除Cookie");
        console.log("🚨检测到Cookie失效，脚本已自动停止并清除Cookie");
        return;
      }
    }
  }
  output();
})()
  .catch((e) => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function deletecookie() {
  $.setdata("", tokenurl);
  $.setdata("", tokenheaders);
  $.setdata("", tokencheckinurl);
  $.setdata("", tokencheckinheaders);
  $.setdata("", tokensinceurl);
  $.setdata("", tokensinceheaders);
}

function output() {
  $.this_msg = ``;
  for (var i = 0; i < $.message.length; ++i) {
    if (i && i % $.msg_max_num == 0) {
      $.msg(
        `${$.name}: 成功${$.successNum}个，失败${$.failNum}个`,
        `当前第${Math.ceil(i / $.msg_max_num)}页 ，共${Math.ceil(
          $.message.length / $.msg_max_num
        )}页`,
        $.this_msg
      );
      $.this_msg = "";
    }
    $.this_msg += `${$.message[i]}\n`;
  }
  if ($.message.length % $.msg_max_num != 0) {
    $.msg(
      `${$.name}: 成功${$.successNum}个，失败${$.failNum}个`,
      `当前第${Math.ceil(i / $.msg_max_num)}页 ，共${Math.ceil(
        $.message.length / $.msg_max_num
      )}页`,
      $.this_msg
    );
  }
}

function getnumber() {
  console.log($.name + "  正在刷新链接");
  var idrequest = {
    url: listurl,
    header: listheaders,
  };
  return new Promise((resolve) => {
    try {
      $.get(idrequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 418) {
          console.log(`太频繁啦，获取超话信息失败，请稍后再试。`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.cardlistInfo.total == undefined ||
            obj.cardlistInfo.total == null
          ) {
            $.msg(
              $.name,
              "🚨获取超话页数出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            $.log(JSON.stringify(obj));
            $.pagenumber = 0;
            resolve();
            return;
          }
          if (debugurl) console.log(JSON.stringify(obj));
          allnumber = obj.cardlistInfo.total;
          console.log(
            "当前已关注超话" +
              allnumber +
              "个(数量存在延迟，仅参考，以签到执行为准)"
          );
          pagenumber = Math.ceil(allnumber / 20);
          resolve();
        } else {
          console.log("请将以下内容发送给作者\n");
          console.log(JSON.stringify(response));
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(JSON.stringify(e));
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function geturl(i) {
  var j = i + 2;
  var getlisturl = listurl.replace(
    new RegExp("&page=.*?&"),
    "&page=" + j + "&"
  );
  if (debugurl) console.log(getlisturl);
  var idrequest = {
    url: getlisturl,
    header: listheaders,
  };
  return new Promise((resolve) => {
    try {
      $.get(idrequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 418) {
          console.log(`太频繁啦，获取超话信息失败，请稍后再试。`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.cards[0] == undefined ||
            obj.cards[0] == null
          ) {
            $.msg(
              $.name,
              "🚨获取超话URL出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            $.log(JSON.stringify(obj));
            resolve();
            return;
          }
          var group = obj.cards[0]["card_group"];
          if (group == undefined) return;
          var insertid = group[0].scheme.slice(33, 71);
          if (debugurl) console.log(insertid);
          var inserturl = sinceurl
            .replace(
              new RegExp("follow%22%3A%221022%3A.*?%22"),
              "follow%22%3A%221022%3A" + insertid + "%22"
            )
            .replace(new RegExp("page%22%3A.*?%7D"), "page%22%3A" + j + "%7D");
          $.sinceinserturl.push(inserturl);
          if (debugurl) console.log($.sinceinserturl);
          resolve();
        } else {
          console.log("请将以下内容发送给作者\n");
          console.log(JSON.stringify(response));
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(JSON.stringify(e));
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function getSignStatus(i) {
  $.log(`正在获取第${i + 1}页签到状态`);
  if (debugstatus) console.log("第" + i + "个 " + $.sinceinserturl[i]);
  var sincerequest = {
    url: $.sinceinserturl[i],
    header: sinceheaders,
  };
  return new Promise((resolve) => {
    try {
      $.get(sincerequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 418) {
          $.message.push(`太频繁啦，获取第${i}页超话及签到状态失败`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.cards[0] == undefined ||
            obj.cards[0] == null
          ) {
            $.msg(
              $.name,
              "🚨获取签到状态出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            $.log(JSON.stringify(obj));
            resolve();
            return;
          }
          var group = obj.cards[0]["card_group"];
          for (var j = 0; j < group.length; j++) {
            var name = group[j]["title_sub"];
            if (name == undefined) {
              continue;
            }
            $.name_list.push(name);
            var status = group[j].buttons[0].name;
            if (status == "签到") {
              console.log(`${name} 未签到`);
              $.sign_status.push(false);
            } else {
              console.log(`${name} 已签到`);
              $.sign_status.push(true);
            }
            var id = group[j].scheme.slice(33, 71);
            $.id_list.push(id);
          }
          if (debugstatus) {
            console.log($.name_list);
            console.log($.sign_status);
            console.log($.id_list);
          }
          resolve();
        } else {
          console.log("请将以下内容发送给作者\n");
          console.log(JSON.stringify(response));
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(JSON.stringify(e));
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

//获取超话签到id
function getid(page) {
  $.log(`正在获取第${page}页超话id`);
  var getlisturl = listurl.replace(
    new RegExp("&page=.*?&"),
    "&page=" + page + "&"
  );
  var idrequest = {
    url: getlisturl,
    header: listheaders,
  };
  return new Promise((resolve) => {
    try {
      $.get(idrequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 418) {
          $.message.push(`太频繁啦，获取第${i}页超话及签到状态失败`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.cards[0] == undefined ||
            obj.cards[0] == null
          ) {
            $.msg(
              $.name,
              "🚨获取超话ID出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            $.log(JSON.stringify(obj));
            resolve();
            return;
          }
          var group = obj.cards[0]["card_group"];
          var number = group.length;
          for (var i = 0; i < number; i++) {
            var name = group[i]["title_sub"];
            $.name_list.push(name);
            var id = group[i].scheme.slice(33, 71);
            $.id_list.push(id);
            if (debugstatus) {
              console.log(name);
              console.log(id);
            }
          }
          resolve();
        } else {
          console.log("请将以下内容发送给作者\n");
          console.log(JSON.stringify(response));
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(JSON.stringify(e));
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

//签到
function checkin(id, name, isSign = false) {
  var idname = name.replace(/超话/, "");
  if (isSign == true) {
    $.successNum += 1;
    $.message.push(`【${idname}】：✨今天已签到`);
    console.log(`【${idname}】执行签到：跳过`);
    return;
  }
  var sendcheckinurl = checkinurl
    .replace(new RegExp("&fid=.*?&"), "&fid=" + id + "&")
    .replace(new RegExp("pageid%3D.*?%26"), "pageid%3D" + id + "%26");
  var checkinrequest = {
    url: sendcheckinurl,
    header: checkinheaders,
  };
  return new Promise((resolve) => {
    try {
      $.get(checkinrequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (debugcheckin) console.log(JSON.stringify(response));
        if (response.statusCode == 418) {
          $.failNum += 1;
          $.message.push(`【${idname}】：太频繁啦，请稍后再试`);
          console.log(`【${idname}】执行签到：太频繁啦，请稍后再试`);
        } else if (response.statusCode == 511) {
          $.failNum += 1;
          $.message.push(`【${idname}】：需要身份验证，请稍后再试`);
          console.log(`【${idname}】执行签到：需要身份验证，请稍后再试`);
        } else if (response.statusCode == 502) {
          $.failNum += 1;
          $.message.push(`【${idname}】：无效响应，请稍后再试`);
          console.log(`【${idname}】执行签到：无效响应，请稍后再试`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.result == null ||
            obj.result == undefined
          ) {
            $.stopNum += 1;
            $.msg(
              $.name,
              "🚨签到出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            $.log(JSON.stringify(obj));
            resolve();
            return;
          }
          if (debugcheckin) console.log(JSON.stringify(obj));
          var result = obj.result;
          if (debugcheckin) console.log(JSON.stringify(result));
          if (result == 1 || result == 382004) {
            $.successNum += 1;
          } else {
            $.failNum += 1;
          }
          if (result == 1) {
            $.message.push(`【${idname}】：✅${obj.button.name}`);
            console.log(`【${idname}】执行签到：${obj.button.name}`);
          } else if (result == 382004) {
            $.message.push(`【${idname}】：✨今天已签到`);
            console.log(`【${idname}】执行签到：${obj.error_msg}`);
          } else if (result == 388000) {
            $.message.push(`【${idname}】：需要拼图验证⚠️`);
            console.log(`【${idname}】执行签到：需要拼图验证⚠️`);
            if (debugcheckin) console.log(response);
          } else if (result == 382010) {
            $.message.push(`【${idname}】：超话不存在⚠️`);
            console.log(`【${idname}】执行签到：超话不存在⚠️`);
            if (debugcheckin) console.log(response);
          } else if (result == 201001) {
            $.message.push(`【${idname}】：获取超时，请稍后重试⚠️`);
            console.log(`【${idname}】执行签到：获取超时，请稍后重试⚠️`);
            if (debugcheckin) console.log(response);
          } else if (obj["errno"] == -100) {
            $.stopNum += 1;
            $.message.push(`【${idname}】：签到失败，请重新签到获取Cookie⚠️`);
            console.log(
              `【${idname}】执行签到：签到失败，请重新签到获取Cookie⚠️\n${response}`
            );
            if (debugcheckin) console.log(JSON.stringify(response));
          } else {
            $.message.push(`【${idname}】：未知错误⚠️`);
            console.log(`【${idname}】执行签到：未知错误⚠️`);
            console.log("请将以下内容发送给作者\n");
            console.log(JSON.stringify(response));
          }
          resolve();
        } else {
          $.failNum += 1;
          console.log("请将以下内容发送给作者\n");
          console.log(JSON.stringify(response));
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(JSON.stringify(e));
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

//From chavyleung's Env.js
function Env(name, opts) {
  class Http {
    constructor(env) {
      this.env = env;
    }

    send(opts, method = "GET") {
      opts = typeof opts === "string" ? { url: opts } : opts;
      let sender = this.get;
      if (method === "POST") {
        sender = this.post;
      }
      return new Promise((resolve, reject) => {
        sender.call(this, opts, (err, resp, body) => {
          if (err) reject(err);
          else resolve(resp);
        });
      });
    }

    get(opts) {
      return this.send.call(this.env, opts);
    }

    post(opts) {
      return this.send.call(this.env, opts, "POST");
    }
  }

  return new (class {
    constructor(name, opts) {
      this.name = name;
      this.http = new Http(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = false;
      this.isNeedRewrite = false;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, opts);
      this.log("", `🔔${this.name}, 开始!`);
    }

    isNode() {
      return "undefined" !== typeof module && !!module.exports;
    }

    isQuanX() {
      return "undefined" !== typeof $task;
    }

    isSurge() {
      return "undefined" !== typeof $httpClient && "undefined" === typeof $loon;
    }

    isLoon() {
      return "undefined" !== typeof $loon;
    }

    toObj(str, defaultValue = null) {
      try {
        return JSON.parse(str);
      } catch {
        return defaultValue;
      }
    }

    toStr(obj, defaultValue = null) {
      try {
        return JSON.stringify(obj);
      } catch {
        return defaultValue;
      }
    }

    getjson(key, defaultValue) {
      let json = defaultValue;
      const val = this.getdata(key);
      if (val) {
        try {
          json = JSON.parse(this.getdata(key));
        } catch {}
      }
      return json;
    }

    setjson(val, key) {
      try {
        return this.setdata(JSON.stringify(val), key);
      } catch {
        return false;
      }
    }

    getScript(url) {
      return new Promise((resolve) => {
        this.get({ url }, (err, resp, body) => resolve(body));
      });
    }

    runScript(script, runOpts) {
      return new Promise((resolve) => {
        let httpapi = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        httpapi = httpapi ? httpapi.replace(/\n/g, "").trim() : httpapi;
        let httpapi_timeout = this.getdata(
          "@chavy_boxjs_userCfgs.httpapi_timeout"
        );
        httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20;
        httpapi_timeout =
          runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout;
        const [key, addr] = httpapi.split("@");
        const opts = {
          url: `http://${addr}/v1/scripting/evaluate`,
          body: {
            script_text: script,
            mock_type: "cron",
            timeout: httpapi_timeout,
          },
          headers: { "X-Key": key, Accept: "*/*" },
        };
        this.post(opts, (err, resp, body) => resolve(body));
      }).catch((e) => this.logErr(e));
    }

    loaddata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const curDirDataFilePath = this.path.resolve(this.dataFile);
        const rootDirDataFilePath = this.path.resolve(
          process.cwd(),
          this.dataFile
        );
        const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
        const isRootDirDataFile =
          !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
        if (isCurDirDataFile || isRootDirDataFile) {
          const datPath = isCurDirDataFile
            ? curDirDataFilePath
            : rootDirDataFilePath;
          try {
            return JSON.parse(this.fs.readFileSync(datPath));
          } catch (e) {
            return {};
          }
        } else return {};
      } else return {};
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const curDirDataFilePath = this.path.resolve(this.dataFile);
        const rootDirDataFilePath = this.path.resolve(
          process.cwd(),
          this.dataFile
        );
        const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
        const isRootDirDataFile =
          !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
        const jsondata = JSON.stringify(this.data);
        if (isCurDirDataFile) {
          this.fs.writeFileSync(curDirDataFilePath, jsondata);
        } else if (isRootDirDataFile) {
          this.fs.writeFileSync(rootDirDataFilePath, jsondata);
        } else {
          this.fs.writeFileSync(curDirDataFilePath, jsondata);
        }
      }
    }

    lodash_get(source, path, defaultValue = undefined) {
      const paths = path.replace(/\[(\d+)\]/g, ".$1").split(".");
      let result = source;
      for (const p of paths) {
        result = Object(result)[p];
        if (result === undefined) {
          return defaultValue;
        }
      }
      return result;
    }

    lodash_set(obj, path, value) {
      if (Object(obj) !== obj) return obj;
      if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];
      path
        .slice(0, -1)
        .reduce(
          (a, c, i) =>
            Object(a[c]) === a[c]
              ? a[c]
              : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
          obj
        )[path[path.length - 1]] = value;
      return obj;
    }

    getdata(key) {
      let val = this.getval(key);
      // 如果以 @
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key);
        const objval = objkey ? this.getval(objkey) : "";
        if (objval) {
          try {
            const objedval = JSON.parse(objval);
            val = objedval ? this.lodash_get(objedval, paths, "") : val;
          } catch (e) {
            val = "";
          }
        }
      }
      return val;
    }

    setdata(val, key) {
      let issuc = false;
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key);
        const objdat = this.getval(objkey);
        const objval = objkey
          ? objdat === "null"
            ? null
            : objdat || "{}"
          : "{}";
        try {
          const objedval = JSON.parse(objval);
          this.lodash_set(objedval, paths, val);
          issuc = this.setval(JSON.stringify(objedval), objkey);
        } catch (e) {
          const objedval = {};
          this.lodash_set(objedval, paths, val);
          issuc = this.setval(JSON.stringify(objedval), objkey);
        }
      } else {
        issuc = this.setval(val, key);
      }
      return issuc;
    }

    getval(key) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.read(key);
      } else if (this.isQuanX()) {
        return $prefs.valueForKey(key);
      } else if (this.isNode()) {
        this.data = this.loaddata();
        return this.data[key];
      } else {
        return (this.data && this.data[key]) || null;
      }
    }

    setval(val, key) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.write(val, key);
      } else if (this.isQuanX()) {
        return $prefs.setValueForKey(val, key);
      } else if (this.isNode()) {
        this.data = this.loaddata();
        this.data[key] = val;
        this.writedata();
        return true;
      } else {
        return (this.data && this.data[key]) || null;
      }
    }

    initGotEnv(opts) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      if (opts) {
        opts.headers = opts.headers ? opts.headers : {};
        if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
          opts.cookieJar = this.ckjar;
        }
      }
    }

    get(opts, callback = () => {}) {
      if (opts.headers) {
        delete opts.headers["Content-Type"];
        delete opts.headers["Content-Length"];
      }
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          opts.headers = opts.headers || {};
          Object.assign(opts.headers, { "X-Surge-Skip-Scripting": false });
        }
        $httpClient.get(opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body;
            resp.statusCode = resp.status;
          }
          callback(err, resp, body);
        });
      } else if (this.isQuanX()) {
        if (this.isNeedRewrite) {
          opts.opts = opts.opts || {};
          Object.assign(opts.opts, { hints: false });
        }
        $task.fetch(opts).then(
          (resp) => {
            const { statusCode: status, statusCode, headers, body } = resp;
            callback(null, { status, statusCode, headers, body }, body);
          },
          (err) => callback(err)
        );
      } else if (this.isNode()) {
        this.initGotEnv(opts);
        this.got(opts)
          .on("redirect", (resp, nextOpts) => {
            try {
              if (resp.headers["set-cookie"]) {
                const ck = resp.headers["set-cookie"]
                  .map(this.cktough.Cookie.parse)
                  .toString();
                if (ck) {
                  this.ckjar.setCookieSync(ck, null);
                }
                nextOpts.cookieJar = this.ckjar;
              }
            } catch (e) {
              this.logErr(e);
            }
            // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
          })
          .then(
            (resp) => {
              const { statusCode: status, statusCode, headers, body } = resp;
              callback(null, { status, statusCode, headers, body }, body);
            },
            (err) => {
              const { message: error, response: resp } = err;
              callback(error, resp, resp && resp.body);
            }
          );
      }
    }

    post(opts, callback = () => {}) {
      // 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
      if (opts.body && opts.headers && !opts.headers["Content-Type"]) {
        opts.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
      if (opts.headers) delete opts.headers["Content-Length"];
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          opts.headers = opts.headers || {};
          Object.assign(opts.headers, { "X-Surge-Skip-Scripting": false });
        }
        $httpClient.post(opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body;
            resp.statusCode = resp.status;
          }
          callback(err, resp, body);
        });
      } else if (this.isQuanX()) {
        opts.method = "POST";
        if (this.isNeedRewrite) {
          opts.opts = opts.opts || {};
          Object.assign(opts.opts, { hints: false });
        }
        $task.fetch(opts).then(
          (resp) => {
            const { statusCode: status, statusCode, headers, body } = resp;
            callback(null, { status, statusCode, headers, body }, body);
          },
          (err) => callback(err)
        );
      } else if (this.isNode()) {
        this.initGotEnv(opts);
        const { url, ..._opts } = opts;
        this.got.post(url, _opts).then(
          (resp) => {
            const { statusCode: status, statusCode, headers, body } = resp;
            callback(null, { status, statusCode, headers, body }, body);
          },
          (err) => {
            const { message: error, response: resp } = err;
            callback(error, resp, resp && resp.body);
          }
        );
      }
    }
    /**
     *
     * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
     *    :$.time('yyyyMMddHHmmssS')
     *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
     *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
     * @param {string} fmt 格式化参数
     * @param {number} 可选: 根据指定时间戳返回格式化日期
     *
     */
    time(fmt, ts = null) {
      const date = ts ? new Date(ts) : new Date();
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "H+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    }

    /**
     * 系统通知
     *
     * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
     *
     * 示例:
     * $.msg(title, subt, desc, 'twitter://')
     * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     *
     * @param {*} title 标题
     * @param {*} subt 副标题
     * @param {*} desc 通知详情
     * @param {*} opts 通知参数
     *
     */
    msg(title = name, subt = "", desc = "", opts) {
      const toEnvOpts = (rawopts) => {
        if (!rawopts) return rawopts;
        if (typeof rawopts === "string") {
          if (this.isLoon()) return rawopts;
          else if (this.isQuanX()) return { "open-url": rawopts };
          else if (this.isSurge()) return { url: rawopts };
          else return undefined;
        } else if (typeof rawopts === "object") {
          if (this.isLoon()) {
            let openUrl = rawopts.openUrl || rawopts.url || rawopts["open-url"];
            let mediaUrl = rawopts.mediaUrl || rawopts["media-url"];
            return { openUrl, mediaUrl };
          } else if (this.isQuanX()) {
            let openUrl = rawopts["open-url"] || rawopts.url || rawopts.openUrl;
            let mediaUrl = rawopts["media-url"] || rawopts.mediaUrl;
            return { "open-url": openUrl, "media-url": mediaUrl };
          } else if (this.isSurge()) {
            let openUrl = rawopts.url || rawopts.openUrl || rawopts["open-url"];
            return { url: openUrl };
          }
        } else {
          return undefined;
        }
      };
      if (!this.isMute) {
        if (this.isSurge() || this.isLoon()) {
          $notification.post(title, subt, desc, toEnvOpts(opts));
        } else if (this.isQuanX()) {
          $notify(title, subt, desc, toEnvOpts(opts));
        }
      }
      if (!this.isMuteLog) {
        let logs = ["", "==============📣系统通知📣=============="];
        logs.push(title);
        subt ? logs.push(subt) : "";
        desc ? logs.push(desc) : "";
        console.log(logs.join("\n"));
        this.logs = this.logs.concat(logs);
      }
    }

    log(...logs) {
      if (logs.length > 0) {
        this.logs = [...this.logs, ...logs];
      }
      console.log(logs.join(this.logSeparator));
    }

    logErr(err, msg) {
      const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      if (!isPrintSack) {
        this.log("", `❗️${this.name}, 错误!`, err);
      } else {
        this.log("", `❗️${this.name}, 错误!`, err.stack);
      }
    }

    wait(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    done(val = {}) {
      const endTime = new Date().getTime();
      const costTime = (endTime - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${costTime} 秒`);
      this.log();
      if (this.isSurge() || this.isQuanX() || this.isLoon()) {
        $done(val);
      }
    }
  })(name, opts);
}