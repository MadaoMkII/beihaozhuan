webpackJsonp([4],{"0Y+T":function(t,e){},4:function(t,e,s){s("j1ja"),t.exports=s("OF61")},G026:function(t,e){},OF61:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=s("7+uW"),a={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var i=s("VU/8")({name:"App",data:function(){return{path:"",tabs:!1}}},a,!1,function(t){s("oCOH")},null,null).exports,o=s("/ocq"),r=(s("VN0c"),s("mtWM")),c=s.n(r),l={name:"MissionSignIn",data:function(){return{showPop:!1,showSignInStatusBtn:!1,active:1,tel_number:"",needRegister:!1,errorTips:"",count:"",oneLight:!1,threeLight:!1,fiveLight:!1,activeClass:[{c_xz:!1},{c_xz:!1},{c_xz:!1},{c_xz:!1},{c_xz:!1}]}},created:function(){this.showStep()},methods:{signPop:function(){this.showPop=!0},closeSignPop:function(){this.showPop=!1},signIn:function(){var t=this.tel_number,e=this;c.a.get("https://www.beihaozhuan.com/user/signIn?tel_number="+t).then(function(t){console.log(t.data);var s=t.data;404==s.code?(console.log("找不到这个用户，去注册"),e.errorTips="当前账号未注册，请先去注册",e.needRegister=!0):0==s.code?(console.log("签到成功"),e.count=s.data.count,e.showSignInStatusBtn=!0,e.showPop=!1,e.showStep()):201==s.code&&(console.log("今天已经签到了"),e.count=s.data.count,e.showSignInStatusBtn=!0,e.showPop=!1,e.showStep())}).catch(function(t){console.log(t)})},showStep:function(){for(var t=this.count,e=0;e<t;e++)this.activeClass[e].c_xz=!0;1==t||2==t?this.oneLight=!0:3==t||4==t?(this.oneLight=!0,this.threeLight=!0):5==t&&(this.oneLight=!0,this.threeLight=!0,this.fiveLight=!0)},goRegister:function(){window.open("https://www.beihaozhuan.com","_self")}}},u={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"topImg"}),t._v(" "),t.showSignInStatusBtn?s("div",{staticClass:"signBtn"},[s("div",{staticClass:"signStatus"},[t._v("已签到")]),t._v(" "),s("div",{staticClass:"signCount"},[t._v("累计"+t._s(t.count)+"天")])]):s("div",{staticClass:"signBtn signInNormal",on:{click:function(e){return t.signPop()}}}),t._v(" "),s("div",{staticClass:"q_tb_div"},[s("div",{staticClass:"q_tb_box"},[s("span",{staticClass:"s_l",class:{c_xz:t.activeClass[0].c_xz}},[s("i"),t._v("一天")]),t._v(" "),s("em"),t._v(" "),s("span",{class:{c_xz:t.activeClass[1].c_xz}},[s("i"),t._v("二天")]),t._v(" "),s("em"),t._v(" "),s("span",{class:{c_xz:t.activeClass[2].c_xz}},[s("i"),t._v("三天")]),t._v(" "),s("em"),t._v(" "),s("span",{class:{c_xz:t.activeClass[3].c_xz}},[s("i"),t._v("四天")]),t._v(" "),s("em"),t._v(" "),s("span",{staticClass:"s_r",class:{c_xz:t.activeClass[4].c_xz}},[s("i"),t._v("五天")])])]),t._v(" "),t._m(0),t._v(" "),s("div",{staticClass:"rewardItem oneNormal",class:{oneLight:t.oneLight}}),t._v(" "),s("div",{staticClass:"rewardItem threeNormal",class:{threeLight:t.threeLight}}),t._v(" "),s("div",{staticClass:"rewardItem fiveNormal",class:{fiveLight:t.fiveLight}}),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t.showPop,expression:"showPop"}],staticClass:"mask",on:{click:function(e){return t.closeSignPop()}}}),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t.showPop,expression:"showPop"}],staticClass:"popCon"},[s("div",{staticClass:"close",on:{click:function(e){return t.closeSignPop()}}},[t._v("X")]),t._v(" "),s("div",{staticClass:"inputCon"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.tel_number,expression:"tel_number"}],attrs:{type:"text",placeholder:"请输入手机号"},domProps:{value:t.tel_number},on:{input:function(e){e.target.composing||(t.tel_number=e.target.value)}}})]),t._v(" "),s("div",{staticClass:"tips"},[t._v(t._s(t.errorTips))]),t._v(" "),t.needRegister?t.needRegister?s("div",{staticClass:"signInBtn",on:{click:function(e){return t.goRegister()}}},[t._v("去注册")]):t._e():s("div",{staticClass:"signInBtn",on:{click:function(e){return t.signIn()}}},[t._v("签到")])])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"qt_tit_div"},[e("div",[this._v("累计签到有奖")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"qt_tit_div"},[e("div",[this._v("签到规则")])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"ruleCon"},[s("div",{staticClass:"ruleIcon"}),t._v(" "),s("div",{staticClass:"ruleItem"},[t._v("1、贝好赚用户在页面进行签到，签到周期为7天")]),t._v(" "),s("div",{staticClass:"ruleItem"},[t._v("2、累计签到次数达到1次、3次、5次后将得到一个贝金币的红包")]),t._v(" "),s("div",{staticClass:"ruleItem"},[t._v("3、红包不累加，一个用户仅可获得一个红包")]),t._v(" "),s("div",{staticClass:"ruleItem"},[t._v("4、所有红包仅发送给注册用户，非注册用户无法收到红包")])])}]};var v=s("VU/8")(l,u,!1,function(t){s("c4G/")},"data-v-27d64c03",null).exports;n.default.use(o.a);var d=new o.a({mode:"history",base:"/missionSignIn/",routes:[{path:"/",name:"MissionSignIn",component:v}]}),h=(s("sVYa"),s("7QTg")),p=s.n(h),g=(s("v2ns"),s("pQgH")),_=s("UF21"),m=s.n(_),f=(s("bJWl"),s("Fd2+")),w=s("pIqd"),C=s.n(w);s("tvR6");n.default.use(f.b),n.default.use(C.a),n.default.use(m.a),n.default.use(g.a);var x=o.a.prototype.push;o.a.prototype.push=function(t){return x.call(this,t).catch(function(t){return t})},n.default.use(p.a),n.default.config.productionTip=!1,n.default.prototype.prev=function(){this.$router.go(-1)},new n.default({el:"#app",router:d,components:{App:i},template:"<App/>"})},VN0c:function(t,e,s){"use strict";var n=s("//Fk"),a=s.n(n),i=s("mtWM"),o=s.n(i),r=s("mw3O"),c=s.n(r),l=o.a.create({baseURL:"https://www.beihaozhuan.com",withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded","Access-Control-Allow-Credentials":!0}}),u=o.a.create({baseURL:"https://www.beihaozhuan.com",withCredentials:!0,headers:{"Content-Type":"multipart/form-data","Access-Control-Allow-Credentials":!0}}),v=o.a.create({baseURL:"https://www.beihaozhuan.com",withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded","Access-Control-Allow-Credentials":!0}}),d={request:function(t){var e=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return new a.a(function(a,i){var o={url:t,method:n};"get"===n.toLowerCase()?o.params=c.a.stringify(s):o.data=c.a.stringify(s),l(o).then(function(t){a(t.data)}).catch(function(t){t.response?401===t.response.status?e.router.push({name:"Login"}):400===t.response.status?alert("该用户未注册或密码不正确"):403===t.response.status?alert("验证码不正确"):alert("服务器忙"):alert("服务器忙")})})},formRequest:function(t){var e=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return new a.a(function(a,i){var o={url:t,method:n};"get"===n.toLowerCase()?o.params=s:o.data=s,u(o).then(function(t){a(t.data)}).catch(function(t){t.response?401===t.response.status?e.router.push({name:"Login"}):400===t.response.status?alert("该用户未注册或密码不正确"):alert("服务器忙"):alert("服务器忙")})})},formRequestios:function(t){var e=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return new a.a(function(a,i){var o={url:t,method:n};"get"===n.toLowerCase()?o.params=c.a.stringify(s):o.data=c.a.stringify(s),v(o).then(function(t){a(t.data)}).catch(function(t){t.response?401===t.response.status?e.router.push({name:"Login"}):400===t.response.status?alert("当前手机号已注册"):403===t.response.status?alert("验证码不正确"):alert("服务器忙"):alert("服务器忙")})})}};e.a=d},XqYu:function(t,e){},"c4G/":function(t,e){},oCOH:function(t,e){},pQgH:function(t,e,s){"use strict";var n=s("pFYg"),a=s.n(n),i=s("7+uW"),o={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return"text"===t.messageType&&t.show?s("div",{staticClass:"toastMessageBox"},[t._v("\n  "+t._s(t.message)+"\n")]):"success"===t.messageType&&t.show?s("div",{staticClass:"iconMessageBox"},[s("div",{staticClass:"messageIcon success"}),t._v(" "),s("div",{staticClass:"message"},[t._v(t._s(t.message))])]):"error"===t.messageType&&t.show?s("div",{staticClass:"iconMessageBox"},[s("div",{staticClass:"messageIcon error"}),t._v(" "),s("div",{staticClass:"message"},[t._v(t._s(t.message))])]):"loading"===t.messageType&&t.show?s("div",{staticClass:"iconMessageBox"},[s("div",{staticClass:"messageIcon loading"}),t._v(" "),s("div",{staticClass:"message"},[t._v(t._s(t.message))])]):t._e()},staticRenderFns:[]};var r=s("VU/8")({name:"Toast",data:function(){return{message:"",show:!1,messageType:""}}},o,!1,function(t){s("G026")},"data-v-296ea46e",null).exports,c=i.default.extend(r),l=void 0,u=null,v=function(t){l||((l=new c).vm=l.$mount(),document.body.appendChild(l.vm.$el)),console.log(t),u&&(clearTimeout(u),u=null,l.show=!1,l.message="");if("string"==typeof t)l.message=t;else{if("object"!==(void 0===t?"undefined":a()(t)))return;var e=t.message,s=t.messageType;l.message=e,l.messageType=s}l.show=!0,u=setTimeout(function(){l.show=!1,clearTimeout(u),u=null,l.message=""},2e3)};v.close=function(){u&&(clearTimeout(u),u=null,l.show=!1,l.message="")},v.install=function(t){console.log("install--------toastMessage"),t.prototype.$toastMessage=v};e.a=v},tvR6:function(t,e){},v2ns:function(t,e){}},[4]);
//# sourceMappingURL=missionSignIn.c9fc06e299322501d8fc.js.map