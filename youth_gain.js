/*
更新时间: 2020-12-16 22:06
Github Actions使用方法见[@lxk0301](https://raw.githubusercontent.com/lxk0301/scripts/master/githubAction.md) 使用方法大同小异

中青看点浏览赚任务，手动完成任务，获取请求体，支持boxjs及Github Actions，多请求用"&"分开，支持自动获取请求

https:\/\/ios\.baertt\.com\/v5\/task\/browse_(start|end)\.json url script-request-body youth_gain.js


多个请求体时用'&'号或者换行隔开" ‼️

*/


const $ = new Env("中青看点浏览赚")
const notify = $.isNode() ? require('./sendNotify') : '';
let StartBody = [], EndBody = [], gainscore = Number();
let startArr = [],endArr = [];
let startbodys = $.getdata('youth_start')
let endbodys = $.getdata('youth_end')
if (isGetCookie = typeof $request !==`undefined`) {
   GetCookie();
   $.done()
} 

if ($.isNode()) {
  if (process.env.YOUTH_START && process.env.YOUTH_START.indexOf('&') > -1) {
  StartBody = process.env.YOUTH_START.split('&');
  }else {
  StartBody = process.env.YOUTH_START.split()
  };
   if (process.env.YOUTH_END && process.env.YOUTH_END.indexOf('&') > -1) {
  EndBody = process.env.YOUTH_END.split('&');
  } else {
  EndBody = process.env.YOUTH_END.split()
  }
} else {
  StartBody = $.getdata('youth_start').split('&');
  EndBody = $.getdata('youth_end').split('&');
}
  Object.keys(StartBody).forEach((item) => {
        if (StartBody[item]) {
          startArr.push(StartBody[item])
        } 
    })

  Object.keys(EndBody).forEach((item) => {
        if (EndBody[item]) {
          endArr.push(EndBody[item])
        }
    })
if ($.isNode()) {
      console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
      console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
}
 !(async () => {
  if (!startArr[0]) {
    console.log($.name, '【提示】请把抓包的请求体填入Github 的 Secrets 中，请以&隔开')
    return;
  }
  console.log(`您共提供${startArr.length}次浏览赚任务`)
  for (let i = 0; i < startArr.length; i++) {
    if (startArr[i]) {
      gainStartbody = startArr[i];
      gainEndbody = endArr[i]
      $.index = i + 1;
    console.log(`-------------------------\n\n开始中青看点浏览赚第${$.index}次任务`)
    }
      await GainStart();
 }
   console.log(`-------------------------\n\n中青看点共完成${$.index}次任务，共计获得${gainscore}个青豆，浏览赚任务全部结束`);
   $.msg($.name, `共完成${$.index}次任务`, `共计获得${gainscore}个青豆`)
   if ($.isNode()){
     //await notify.sendNotify($.name，`共完成${$.index}次任务，\n共计获得${gainscore}个青豆`
}
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())

function GainStart() {
    return new Promise((resolve, reject) => {
       let url = {
            url: `https://ios.baertt.com/v5/task/browse_start.json`,
            headers: {
            'User-Agent': 'KDApp/1.7.8 (iPhone; iOS 14.0; Scale/3.00)',
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: gainStartbody
        };
        $.post(url, async(error, response, data) => {
          let startres = JSON.parse(data);
           if(startres.items.comtele_state ==0){
             $.log("任务开始，"+startres.items.banner_id+startres.message)
             await $.wait(10000);
             await GainEnd()
           } else if(startres.items.comtele_state ==1){
             $.log("任务:"+startres.items.banner_id+"已完成，本次跳过")
             await $.wait(2000);
           }
          resolve()
        })
    })
}

function GainEnd() {
    return new Promise((resolve, reject) => {
       let url = {
            url: `https://ios.baertt.com/v5/task/browse_end.json`,
            headers: {
            'User-Agent': 'KDApp/1.7.8 (iPhone; iOS 14.0; Scale/3.00)',
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: gainEndbody
         };
  $.post(url, async(error, response, data) => {
          let endres = JSON.parse(data);
          if(endres.success==true){
            $.log("任务"+endres.items.banner_id+endres.message+"，恭喜获得"+endres.items.score+"个青豆")
            gainscore += Number(endres.items.score)
           } else (
           $.log(endres.message)
           )
          resolve()
        })
    })
}

function GetCookie() {
if ($request && $request.method != 'OPTIONS' && $request.url.match(/\/browse_start\.json/)) {
  const startbodyVal = $request.body;
  if(startbodys){
  if(startbodys.indexOf(startbodyVal)>-1){
     $.msg($.name,'阅读请求重复，本次跳过');
     return
   }else if(startbodys.indexOf(startbodyVal)==-1)
     {
        startbodys  += "&"+startbodyVal 
     } 
   }  else {
        startbodys = $request.body
   } 
     $.setdata(startbodys,'youth_start')
     $.log("看看赚开始请求: "+startbodyVal)
     $.msg($.name,'获取开始请求成功');
   };

if ($request && $request.method != 'OPTIONS' && $request.url.match(/\/browse_end\.json/)) {
  const endbodyVal = $request.body
  if(endbodys){
    if(endbodys.indexOf(endbodyVal)>-1){
      $.msg($.name,'获取任务开始请求重复，本次跳过');
      return
    } else if(endbodys.indexOf(endbodyVal)==-1){
        endbodys += "&"+endbodyVal 
    }
   }else {
        endbodys = $request.body
   }
     $.setdata(endbodys,'youth_end')
     $.log("看看赚结束请求: "+endbodyVal)
     $.msg($.name,'获取任务结束请求成功');
  }
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
