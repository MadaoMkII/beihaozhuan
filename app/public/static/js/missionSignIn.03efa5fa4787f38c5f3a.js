webpackJsonp([4],{"0Y+T":function(e,t){},4:function(e,t,s){s("j1ja"),e.exports=s("OF61")},G026:function(e,t){},OF61:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("7+uW"),o={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var a=s("VU/8")({name:"App",data:function(){return{path:"",tabs:!1}}},o,!1,function(e){s("oCOH")},null,null).exports,i=s("/ocq"),c=(s("VN0c"),s("mtWM")),r=s.n(c),l={name:"MissionSignIn",data:function(){return{showPop:!1,showSignInStatusBtn:!1,active:1,tel_number:"",needRegister:!1,errorTips:"",count:"",oneLight:!1,threeLight:!1,fiveLight:!1,activeClass:[{c_xz:!1},{c_xz:!1},{c_xz:!1},{c_xz:!1},{c_xz:!1}]}},created:function(){this.showStep()},methods:{signPop:function(){this.showPop=!0},closeSignPop:function(){this.showPop=!1},signIn:function(){var e=this.tel_number,t=this;r.a.get("https://www.beihaozhuan.com/user/signIn?tel_number="+e).then(function(e){console.log(e.data);var s=e.data;404==s.code?(console.log("找不到这个用户，去注册"),t.errorTips="当前账号未注册，请先去注册",t.needRegister=!0):0==s.code?(console.log("签到成功"),t.count=s.data.count,t.showSignInStatusBtn=!0,t.showPop=!1,t.showStep()):201==s.code&&(console.log("今天已经签到了"),t.count=s.data.count,t.showSignInStatusBtn=!0,t.showPop=!1,t.showStep())}).catch(function(e){console.log(e)})},showStep:function(){for(var e=this.count,t=0;t<e;t++)this.activeClass[t].c_xz=!0;1==e||2==e?this.oneLight=!0:3==e||4==e?(this.oneLight=!0,this.threeLight=!0):5==e&&(this.oneLight=!0,this.threeLight=!0,this.fiveLight=!0)},goRegister:function(){window.open("https://www.beihaozhuan.com","_self")}}},u={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"topImg"}),e._v(" "),e.showSignInStatusBtn?s("div",{staticClass:"signBtn"},[s("div",{staticClass:"signStatus"},[e._v("已签到")]),e._v(" "),s("div",{staticClass:"signCount"},[e._v("累计"+e._s(e.count)+"天")])]):s("div",{staticClass:"signBtn signInNormal",on:{click:function(t){return e.signPop()}}}),e._v(" "),s("div",{staticClass:"q_tb_div"},[s("div",{staticClass:"q_tb_box"},[s("span",{staticClass:"s_l",class:{c_xz:e.activeClass[0].c_xz}},[s("i"),e._v("一天")]),e._v(" "),s("em"),e._v(" "),s("span",{class:{c_xz:e.activeClass[1].c_xz}},[s("i"),e._v("二天")]),e._v(" "),s("em"),e._v(" "),s("span",{class:{c_xz:e.activeClass[2].c_xz}},[s("i"),e._v("三天")]),e._v(" "),s("em"),e._v(" "),s("span",{class:{c_xz:e.activeClass[3].c_xz}},[s("i"),e._v("四天")]),e._v(" "),s("em"),e._v(" "),s("span",{staticClass:"s_r",class:{c_xz:e.activeClass[4].c_xz}},[s("i"),e._v("五天")])])]),e._v(" "),e._m(0),e._v(" "),s("div",{staticClass:"rewardItem oneNormal",class:{oneLight:e.oneLight}}),e._v(" "),s("div",{staticClass:"rewardItem threeNormal",class:{threeLight:e.threeLight}}),e._v(" "),s("div",{staticClass:"rewardItem fiveNormal",class:{fiveLight:e.fiveLight}}),e._v(" "),e._m(1),e._v(" "),e._m(2),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.showPop,expression:"showPop"}],staticClass:"mask",on:{click:function(t){return e.closeSignPop()}}}),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.showPop,expression:"showPop"}],staticClass:"popCon"},[s("div",{staticClass:"close",on:{click:function(t){return e.closeSignPop()}}},[e._v("X")]),e._v(" "),s("div",{staticClass:"inputCon"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.tel_number,expression:"tel_number"}],attrs:{type:"text",placeholder:"请输入手机号"},domProps:{value:e.tel_number},on:{input:function(t){t.target.composing||(e.tel_number=t.target.value)}}})]),e._v(" "),s("div",{staticClass:"tips"},[e._v(e._s(e.errorTips))]),e._v(" "),e.needRegister?e.needRegister?s("div",{staticClass:"signInBtn",on:{click:function(t){return e.goRegister()}}},[e._v("去注册")]):e._e():s("div",{staticClass:"signInBtn",on:{click:function(t){return e.signIn()}}},[e._v("签到")])])])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"qt_tit_div"},[t("div",[this._v("累计签到有奖")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"qt_tit_div"},[t("div",[this._v("签到规则")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"ruleCon"},[s("div",{staticClass:"ruleIcon"}),e._v(" "),s("div",{staticClass:"ruleItem"},[e._v("1、贝好赚用户在页面进行签到，签到周期为7天")]),e._v(" "),s("div",{staticClass:"ruleItem"},[e._v("2、累计签到次数达到1次、3次、5次后将得到一个贝金币的红包")]),e._v(" "),s("div",{staticClass:"ruleItem"},[e._v("3、红包不累加，一个用户仅可获得一个红包")]),e._v(" "),s("div",{staticClass:"ruleItem"},[e._v("4、所有红包仅发送给注册用户，非注册用户无法收到红包")])])}]};var v=s("VU/8")(l,u,!1,function(e){s("c4G/")},"data-v-27d64c03",null).exports;n.default.use(i.a);var d=new i.a({mode:"history",base:"/missionSignIn/",routes:[{path:"/",name:"MissionSignIn",component:v}]}),h=(s("sVYa"),s("7QTg")),g=s.n(h),p=(s("v2ns"),s("pQgH")),_=s("UF21"),m=s.n(_),f=(s("bJWl"),s("Fd2+")),w=s("pIqd"),C=s.n(w);s("tvR6");n.default.use(f.a),n.default.use(C.a),n.default.use(m.a),n.default.use(p.a);var x=i.a.prototype.push;i.a.prototype.push=function(e){return x.call(this,e).catch(function(e){return e})},n.default.use(g.a),n.default.config.productionTip=!1,n.default.prototype.prev=function(){this.$router.go(-1)},new n.default({el:"#app",router:d,components:{App:a},template:"<App/>"})},VN0c:function(e,t,s){"use strict";var n=s("//Fk"),o=s.n(n),a=s("mtWM"),i=s.n(a),c=s("mw3O"),r=s.n(c),l=i.a.create({baseURL:"https://www.beihaozhuan.com",withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded","Access-Control-Allow-Credentials":!0}}),u=i.a.create({baseURL:"https://www.beihaozhuan.com",withCredentials:!0,headers:{"Content-Type":"multipart/form-data","Access-Control-Allow-Credentials":!0}}),v=i.a.create({baseURL:"https://www.beihaozhuan.com",withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded","Access-Control-Allow-Credentials":!0}}),d={request:function(e){var t=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return new o.a(function(o,a){var i={url:e,method:n};"get"===n.toLowerCase()?i.params=r.a.stringify(s):i.data=r.a.stringify(s),l(i).then(function(e){console.log("返回数据",e),o(e.data)}).catch(function(e){console.log("操作失败111",e),e.response?(console.log("error.response"),401===e.response.status?(console.log("当前用户未登录"),t.router.push({name:"Login"})):403===e.response.status?(console.log("验证码不正确"),alert("验证码不正确")):alert("服务器忙")):alert("服务器忙")})})},formRequest:function(e){var t=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return new o.a(function(o,a){var i={url:e,method:n};"get"===n.toLowerCase()?i.params=s:i.data=s,u(i).then(function(e){console.log("返回数据",e),o(e.data)}).catch(function(e){e.response?(console.log("error.response"),401===e.response.status?(console.log("当前用户未登录"),t.router.push({name:"Login"})):alert("服务器忙")):alert("服务器忙")})})},formRequestios:function(e){var t=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return new o.a(function(o,a){var i={url:e,method:n};"get"===n.toLowerCase()?i.params=r.a.stringify(s):i.data=r.a.stringify(s),v(i).then(function(e){console.log("返回数据",e),o(e.data)}).catch(function(e){e.response?(console.log("error.response"),401===e.response.status?(console.log("当前用户未登录"),t.router.push({name:"Login"})):400===e.response.status?(console.log("当前手机号已注册"),alert("当前手机号已注册")):403===e.response.status?(console.log("验证码不正确"),alert("验证码不正确")):alert("服务器忙")):alert("服务器忙")})})}};t.a=d},XqYu:function(e,t){},"c4G/":function(e,t){},oCOH:function(e,t){},pQgH:function(e,t,s){"use strict";var n=s("pFYg"),o=s.n(n),a=s("7+uW"),i={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return"text"===e.messageType&&e.show?s("div",{staticClass:"toastMessageBox"},[e._v("\n  "+e._s(e.message)+"\n")]):"success"===e.messageType&&e.show?s("div",{staticClass:"iconMessageBox"},[s("div",{staticClass:"messageIcon success"}),e._v(" "),s("div",{staticClass:"message"},[e._v(e._s(e.message))])]):"error"===e.messageType&&e.show?s("div",{staticClass:"iconMessageBox"},[s("div",{staticClass:"messageIcon error"}),e._v(" "),s("div",{staticClass:"message"},[e._v(e._s(e.message))])]):"loading"===e.messageType&&e.show?s("div",{staticClass:"iconMessageBox"},[s("div",{staticClass:"messageIcon loading"}),e._v(" "),s("div",{staticClass:"message"},[e._v(e._s(e.message))])]):e._e()},staticRenderFns:[]};var c=s("VU/8")({name:"Toast",data:function(){return{message:"",show:!1,messageType:""}}},i,!1,function(e){s("G026")},"data-v-296ea46e",null).exports,r=a.default.extend(c),l=void 0,u=null,v=function(e){l||((l=new r).vm=l.$mount(),document.body.appendChild(l.vm.$el)),console.log(e),u&&(clearTimeout(u),u=null,l.show=!1,l.message="");if("string"==typeof e)l.message=e;else{if("object"!==(void 0===e?"undefined":o()(e)))return;var t=e.message,s=e.messageType;l.message=t,l.messageType=s}l.show=!0,u=setTimeout(function(){l.show=!1,clearTimeout(u),u=null,l.message=""},2e3)};v.close=function(){u&&(clearTimeout(u),u=null,l.show=!1,l.message="")},v.install=function(e){console.log("install--------toastMessage"),e.prototype.$toastMessage=v};t.a=v},tvR6:function(e,t){},v2ns:function(e,t){}},[4]);
//# sourceMappingURL=missionSignIn.03efa5fa4787f38c5f3a.js.map