webpackJsonp([3],{"0Y+T":function(t,e){},"0xQw":function(t,e){},2:function(t,e,s){s("j1ja"),t.exports=s("rX46")},"2AOQ":function(t,e){},"46Yu":function(t,e){},"92sz":function(t,e,s){"use strict";var i=s("VN0c"),n={getWeeklyMissionProcessing:function(){return i.a.request("/mission/getUserWeeklyMissionProcessing",{},"get")},getDailyMissionProcessing:function(){return i.a.request("/mission/getUserDailyMissionProcessing",{},"get")},getUserDailyMissionProcessing:function(){return i.a.request("/mission/getUserDailyMissionProcessing",{},"get")},getUserWeeklyMissionProcessing:function(){return i.a.request("/mission/getUserWeeklyMissionProcessing",{},"get")},getUserPermanentMissionProcessing:function(){return i.a.request("/mission/getUserPermanentMissionProcessing",{},"get")},completeMission:function(t){return i.a.request("/mission/completeMission",t)},checkAD:function(t){return i.a.request("checkAD?eventName="+t,{},"get")},getSquare:function(){return i.a.request("getSquare",{},"get")},signInReal:function(){return i.a.request("/user/signInReal",{},"get")},howMyMoney:function(){return i.a.request("/user/showMyMoney",{},"get")},finishMission:function(t){return i.a.request("/mission/finishMission ",t)}};e.a=n},"9ffX":function(t,e){},"C+o4":function(t,e){},IMvH:function(t,e,s){t.exports=s.p+"static/img/invitePoster.7ca85a3.png"},Nc0w:function(t,e,s){"use strict";var i=s("vxUu"),n=s("MJLE"),a=s.n(n),o=s("eMjc"),r=s.n(o),c={name:"InvitePoster",data:function(){return{phone:"",showPosterImg:!0,posterImg:""}},mounted:function(){var t=this;document.getElementById("bgImg").onload=function(){t.getUserPhone()}},methods:{getUserPhone:function(){var t=this;i.a.getUserInfo().then(function(e){console.log("res",e),"0"===e.code&&(t.phone=e.data.tel_number,t.inviteLink())})},inviteLink:function(){var t=this;i.a.inviteLink().then(function(e){if(console.log("res",e),0==e.code){var s=e.data;t.createQrcode(s)}})},createQrcode:function(t){var e=document.getElementById("qrcodeImg");e.innerHTML="";var s=parseInt(window.getComputedStyle(e).width),i=parseInt(window.getComputedStyle(e).height);new a.a(e,{width:s,height:i,colorDark:"#000000",colorLight:"#ffffff",correctLevel:a.a.CorrectLevel.H}).makeCode(t),this.createPoster()},createPoster:function(){var t=this,e=document.createElement("canvas");console.log("canvas",e);var s=this.$refs.posterHtml,i=parseInt(window.getComputedStyle(s).width),n=parseInt(window.getComputedStyle(s).height);console.log("width",i),console.log("height",n),e.width=4*i,e.height=4*n,e.style.width=i+"px",e.style.height=n+"px",console.log("canvaswidth",e.width),console.log("canvasheight",e.height),e.getContext("2d").scale(4,4);var a={backgroundColor:null,canvas:e,useCORS:!0};r()(s,a).then(function(e){var s=e.toDataURL("image/png");t.posterImg=s})}}},l={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"mask"}),t._v(" "),i("div",{staticClass:"posterBox"},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.showPosterImg,expression:"showPosterImg"}],ref:"posterHtml",attrs:{id:"posterHtml"}},[i("img",{staticClass:"imgCon",attrs:{id:"bgImg",src:s("IMvH"),alt:""}}),t._v(" "),i("div",{staticClass:"posterCon"},[i("div",{staticClass:"posterItem"},[t._v("您的朋友 "+t._s(t.phone)+" 邀请您")]),t._v(" "),i("div",{staticClass:"posterItem"},[t._v("贝好赚送您现金红包已到账")])]),t._v(" "),t._m(0)]),t._v(" "),i("div",{staticClass:"posterImgCon"},[i("img",{staticClass:"posterImg",attrs:{src:t.posterImg,alt:""}})]),t._v(" "),i("div",{staticClass:"posterTips"},[t._v("\n      长按图片保存至手机\n    ")])])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"qrcode"},[e("div",{attrs:{id:"qrcodeImg"}})])}]};var u=s("VU/8")(c,l,!1,function(t){s("C+o4")},"data-v-f7f790ae",null);e.a=u.exports},VN0c:function(t,e,s){"use strict";var i=s("//Fk"),n=s.n(i),a=s("mtWM"),o=s.n(a),r=s("mw3O"),c=s.n(r),l=o.a.create({baseURL:"https://www.beihaozhuan.com",withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded","Access-Control-Allow-Credentials":!0}}),u=o.a.create({baseURL:"https://www.beihaozhuan.com",withCredentials:!0,headers:{"Content-Type":"multipart/form-data","Access-Control-Allow-Credentials":!0}}),v=o.a.create({baseURL:"https://www.beihaozhuan.com",withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded","Access-Control-Allow-Credentials":!0}}),d={request:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return new n.a(function(i,n){var a={url:t,method:s};"get"===s.toLowerCase()?a.params=c.a.stringify(e):a.data=c.a.stringify(e),l(a).then(function(t){i(t.data)}).catch(function(t){t.response&&t.response.data.msg?alert(t.response.data.msg):alert("服务器忙")})})},formRequest:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return new n.a(function(i,n){var a={url:t,method:s};"get"===s.toLowerCase()?a.params=e:a.data=e,u(a).then(function(t){i(t.data)}).catch(function(t){t.response&&t.response.data.msg?alert(t.response.data.msg):alert("服务器忙")})})},formRequestios:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"post";return new n.a(function(i,n){var a={url:t,method:s};"get"===s.toLowerCase()?a.params=c.a.stringify(e):a.data=c.a.stringify(e),v(a).then(function(t){i(t.data)}).catch(function(t){t.response&&t.response.data.msg?alert(t.response.data.msg):alert("服务器忙")})})}};e.a=d},XqYu:function(t,e){},ZBDd:function(t,e){},luPQ:function(t,e){},pQgH:function(t,e,s){"use strict";var i=s("pFYg"),n=s.n(i),a=s("7+uW"),o={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return"text"===t.messageType&&t.show?s("div",{staticClass:"toastMessageBox"},[t._v("\n  "+t._s(t.message)+"\n")]):"success"===t.messageType&&t.show?s("div",{staticClass:"iconMessageBox"},[s("div",{staticClass:"messageIcon success"}),t._v(" "),s("div",{staticClass:"message"},[t._v(t._s(t.message))])]):"error"===t.messageType&&t.show?s("div",{staticClass:"iconMessageBox"},[s("div",{staticClass:"messageIcon error"}),t._v(" "),s("div",{staticClass:"message"},[t._v(t._s(t.message))])]):"loading"===t.messageType&&t.show?s("div",{staticClass:"iconMessageBox"},[s("div",{staticClass:"messageIcon loading"}),t._v(" "),s("div",{staticClass:"message"},[t._v(t._s(t.message))])]):t._e()},staticRenderFns:[]};var r=s("VU/8")({name:"Toast",data:function(){return{message:"",show:!1,messageType:""}}},o,!1,function(t){s("2AOQ")},"data-v-296ea46e",null).exports,c=a.default.extend(r),l=void 0,u=null,v=function(t){l||((l=new c).vm=l.$mount(),document.body.appendChild(l.vm.$el)),console.log(t),u&&(clearTimeout(u),u=null,l.show=!1,l.message="");if("string"==typeof t)l.message=t;else{if("object"!==(void 0===t?"undefined":n()(t)))return;var e=t.message,s=t.messageType;l.message=e,l.messageType=s}l.show=!0,u=setTimeout(function(){l.show=!1,clearTimeout(u),u=null,l.message=""},2e3)};v.close=function(){u&&(clearTimeout(u),u=null,l.show=!1,l.message="")},v.install=function(t){console.log("install--------toastMessage"),t.prototype.$toastMessage=v};e.a=v},rX46:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("7+uW"),n={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("keep-alive",[e("router-view")],1)],1)},staticRenderFns:[]};var a=s("VU/8")({name:"App",data:function(){return{path:"",tabs:!1}}},n,!1,function(t){s("46Yu")},null,null).exports,o=s("/ocq"),r={name:"GiftTip",props:{type:String},data:function(){return{}},methods:{}},c={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"con"},[s("div",{staticClass:"mask"}),t._v(" "),s("div",{staticClass:"giftTipCon"},[s("div",{staticClass:"giftTitle"},[t._v(t._s(t.type))]),t._v(" "),"领钱攻略"===t.type?s("div",{staticClass:"tipCon"},[t._v("\n      1、点击“我要领现金”进入贝好赚注册页面"),s("br"),t._v("\n      2、注册成为会员"),s("br"),t._v("\n      3、账户获得2000贝金币，约0.2元"),s("br"),t._v("\n      4、根据规则可提现"),s("br"),t._v("\n      5、贝好赚永久地址：https://www.beihaozhuan.com"),s("br"),t._v("\n      6、关注我，不迷路"),s("br"),t._v("\n      7、每个手机号仅可完成一次本活动"),s("br")]):"红包攻略"===t.type?s("div",{staticClass:"tipCon"},[t._v("\n      1、点击“我要抢红包”进入试玩下载页面"),s("br"),t._v("\n      2、根据页面规则进行操作"),s("br"),t._v("\n      3、审核后账户获得5000贝金币，约0.5元"),s("br"),t._v("\n      4、登录贝好赚，根据规则可提现"),s("br"),t._v("\n      5、贝好赚永久地址：https://www.beihaozhuan.com/"),s("br"),t._v("\n      6、关注我，不迷路"),s("br"),t._v("\n      7、每个手机号仅可完成一次本活动"),s("br")]):"邀请攻略"===t.type?s("div",{staticClass:"tipCon"},[t._v("\n      1、点击“我要去邀请”获得邀请海报"),s("br"),t._v("\n      2、保存海报，发送给朋友、微信群、朋友圈等"),s("br"),t._v("\n      3、朋友通过海报注册平台并登陆，双方即可获得相应奖励"),s("br"),t._v("\n      4、审核通过后，邀请人可获得3000贝金币，约0.3元"),s("br"),t._v("\n      5、登录贝好赚，根据规则可提现"),s("br"),t._v("\n      6、贝好赚永久地址：https://www.beihaozhuan.com/"),s("br"),t._v("\n      7、关注我，不迷路"),s("br"),t._v("\n      8、每个手机号仅可完成一次本活动"),s("br")]):t._e(),t._v(" "),s("div",{staticClass:"qrcodeCon"})])])},staticRenderFns:[]};var l=s("VU/8")(r,c,!1,function(t){s("9ffX")},"data-v-fd933c9c",null).exports,u=s("Nc0w"),v=s("92sz"),d=s("VN0c"),p={name:"Gift",data:function(){return{showPoster:!1,showPop:!1,type:"",inviteData:{},showBtn:!0}},components:{GIFTTIP:l,INVITEPOSTER:u.a},created:function(){var t=this;d.a.formRequestios("/user/isLogin",{},"get").then(function(e){console.log("判断登录状态",e),"用户已经登录"===e.data&&t.getInviteInfo()})},methods:{getInviteInfo:function(){var t=this;v.a.getUserPermanentMissionProcessing().then(function(e){if("0"===e.code){var s=e.data.find(function(t){return"活动—双十二邀请好友得现金"===t.missionEventName});t.inviteData=s,console.log("inviteData",t.inviteData),t.showBtn=!1}})},showTipsPop:function(t){this.type=t,this.showPop=!0},closePop:function(){this.showPop=!1,this.showPoster=!1},go:function(t){var e=this,s=this;d.a.formRequestios("/user/isLogin",{},"get").then(function(i){if(console.log("判断登录状态",i),"用户已经登录"===i.data)switch(s.getInviteInfo(),t){case"one":window.location.href="https://www.beihaozhuan.com";break;case"two":e.$router.push({path:"/gameDetail",name:"GameDetail"});break;case"showPoster":e.showPoster=!0,e.getInviteInfo();break;case"getReward":e.completeMission("Permanent","活动—双十二邀请好友得现金");break;case"three":e.showPoster=!0,e.getInviteInfo()}else 1==confirm("您需要登陆才可以参加活动哦~，点击确定即刻登陆贝好赚~")&&s.wechatLogin()})},completeMission:function(t,e){var s=this,i={modelName:t,missionEventName:e};v.a.completeMission(i).then(function(t){s.getInviteInfo()})},wechatLogin:function(){window.open("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx87462aaa978561bf&redirect_uri=https%3a%2f%2fwww.beihaozhuan.com/wechat/callback&response_type=code&scope=snsapi_userinfo&state=CHECK#wechat_redirect","_self")}}},f={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"contain"},[s("div",{staticClass:"giftCon"}),t._v(" "),s("div",{staticClass:"conBg"}),t._v(" "),s("div",{staticClass:"giftListCon"},[s("div",{staticClass:"giftItem oneImg"},[s("a",{attrs:{href:"https://www.beihaozhuan.com"}},[s("div",{staticClass:"btn oneBtn"},[t._v("我要领现金")])]),t._v(" "),s("div",{staticClass:"tips oneTips",on:{click:function(e){return t.showTipsPop("领钱攻略")}}},[t._v("领钱攻略>")])]),t._v(" "),s("div",{staticClass:"giftItem twoImg"},[s("div",{staticClass:"btn twoBtn",on:{click:function(e){return t.go("two")}}},[t._v("我要抢红包")]),t._v(" "),s("div",{staticClass:"tips oneTips",on:{click:function(e){return t.showTipsPop("红包攻略")}}},[t._v("红包攻略>")])]),t._v(" "),s("div",{staticClass:"giftItem threeImg"},[t.showBtn?s("div",{staticClass:"btn twoBtn",on:{click:function(e){return t.go("three")}}},[t._v("我要去邀请")]):t._e(),t._v(" "),t.inviteData.recentAmount<t.inviteData.requireAmount?s("div",{staticClass:"btn twoBtn",on:{click:function(e){return t.go("showPoster")}}},[t._v("我要去邀请")]):t.inviteData.recentAmount>=t.inviteData.requireAmount&&!t.inviteData.completed?s("div",{staticClass:"btn twoBtn",on:{click:function(e){return t.go("getReward")}}},[t._v("领取礼金")]):t.inviteData.completed?s("div",{staticClass:"btn twoBtn"},[t._v("已完成")]):t._e(),t._v(" "),s("div",{staticClass:"tips oneTips",on:{click:function(e){return t.showTipsPop("邀请攻略")}}},[t._v("邀请攻略>")])])]),t._v(" "),s("div",{staticClass:"moreGameCon"},[s("div",{staticClass:"moreGameTitle"},[t._v("更多好玩游戏")]),t._v(" "),s("a",{attrs:{href:"https://www.beihaozhuan.com?jumpTo=game"}},[s("div",{staticClass:"moreGameTips"},[t._v("查看更多>")])]),t._v(" "),s("a",{attrs:{href:"https://iddxy.shiyiyx.com/agent/80001150/index.html"}},[s("div",{staticClass:"picCon"})])]),t._v(" "),t.showPop?s("div",{staticClass:"tipPop"},[s("div",{staticClass:"closeBtn",on:{click:function(e){return t.closePop()}}}),t._v(" "),s("GIFTTIP",{attrs:{type:this.type}})],1):t._e(),t._v(" "),t.showPoster?s("div",{staticClass:"tipPop",on:{click:function(e){return t.closePop()}}},[s("INVITEPOSTER")],1):t._e()])},staticRenderFns:[]};var m=s("VU/8")(p,f,!1,function(t){s("0xQw")},"data-v-f18a5dae",null).exports,h={createPromotionProof:function(t){return d.a.formRequest("/promotion/createPromotionProof",t)},checkProofsStatus:function(){return d.a.request("/promotion/checkProofsStatus",{},"get")}},g={name:"GameDetail",data:function(){return{status:"",swiperOption:{loop:!0,speed:800,mousewheelControl:!1,lazy:{loadPrevNext:!0},autoplay:{delay:2e3,stopOnLastSlide:!1,disableOnInteraction:!1},coverflowEffect:{rotate:0,stretch:-70,depth:300,modifier:.5,slideShadows:!1},watchSlidesProgress:!0,centeredSlides:!0,spaceBetween:10,loopedSlides:2,observer:!0,observeParents:!0,effect:"coverflow",grabCursor:!0,slidesPerView:1.55},imgList:[{imgUrl:"/static/bannerImg/banner1.jpeg"},{imgUrl:"/static/bannerImg/banner2.jpeg"},{imgUrl:"/static/bannerImg/banner3.jpeg"}]}},computed:{swiper:function(){return this.$refs.mySwiper.swiper}},created:function(){this.getBtnStatus()},methods:{goUpload:function(){this.$router.push({name:"PicUpload"})},getBtnStatus:function(){var t=this;h.checkProofsStatus().then(function(e){console.log("res",e),"0"===e.code&&(t.status=e.data.status)})},goHome:function(){window.open("https://www.beihaozhuan.com","_self")}},watch:{$route:function(){this.getBtnStatus()}}},w={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"gameDetailCon"},[s("div",{staticClass:"gameDetailBg"}),t._v(" "),s("div",{staticClass:"flowCon"},[t._m(0),t._v(" "),s("div",{staticClass:"tips"},[t._v("\n      2、上传登录、注册、认证三张截图，例图如下\n    ")]),t._v(" "),s("div",{staticClass:"bannerCon"},[s("swiper",{ref:"mySwiper",staticClass:"swiper",attrs:{options:t.swiperOption}},t._l(t.imgList,function(t){return s("swiper-slide",[s("img",{staticClass:"imgCon",attrs:{src:t.imgUrl}})])}),1)],1),t._v(" "),s("div",{staticClass:"tips"},[t._v("\n      3、审核后贝好赚账户获得5000贝金币，约0.5元\n    ")]),t._v(" "),s("div",{staticClass:"tips"},[t._v("\n      4、登录贝好赚账号，每个设备只能完成一次试玩任务\n    ")]),t._v(" "),s("div",{staticClass:"tips"},[t._v("\n      5、登录贝好赚，根据规则可提现\n    ")]),t._v(" "),s("div",{staticClass:"tips"},[t._v("\n      6、贝好赚永久地址：https://www.beihaozhuan.com/\n    ")]),t._v(" "),s("div",{staticClass:"tips"},[t._v("\n      7、关注我，领钱不迷路\n    ")]),t._v(" "),s("div",{staticClass:"qrcodeCon"})]),t._v(" "),s("div",{staticClass:"btnGroup"},[s("a",{attrs:{href:"http://qpm.boxiangyx.com/mobile/mp/extension.html?agentId=2000551"}},[s("div",{staticClass:"downloadBtn"},[t._v("下载游戏")])]),t._v(" "),"无订单"===t.status?s("div",{staticClass:"packetBtn",on:{click:function(e){return t.goUpload()}}},[t._v("我要领红包")]):"未审核"===t.status?s("div",{staticClass:"packetBtn"},[t._v("已提交,请等待审核")]):"审核通过"===t.status?s("div",{staticClass:"packetBtn",on:{click:function(e){return t.goHome()}}},[t._v("任务完成,去贝好赚领钱")]):"审核不通过"===t.status?s("div",{staticClass:"packetBtn",on:{click:function(e){return t.goUpload()}}},[t._v("未通过审核,重新上传")]):t._e()])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"tips fistTips"},[this._v("\n      1、点击“立刻下载”安装捕鱼欢乐颂，登录注册账号并试玩，"),e("span",{staticStyle:{color:"#D21212"}},[this._v("限定安卓操作系统手机可下载试玩")])])}]};var _=s("VU/8")(g,w,!1,function(t){s("luPQ")},"data-v-2c66de50",null).exports,C={name:"PicUpload",data:function(){return{showPic1:!1,showPic2:!1,showPic3:!1,imageUrl1:"",imageUrl2:"",imageUrl3:"",file1:"",file2:"",file3:"",account:""}},methods:{onRead:function(t){var e=this;if("one"===t){if(this.file1=this.$refs.file1.files[0],this.file1){var s=new FileReader;s.readAsDataURL(this.file1),s.onload=function(){e.imageUrl1=s.result,e.showPic1=!0}}}else if("two"===t){if(this.file2=this.$refs.file2.files[0],this.file2){var i=new FileReader;i.readAsDataURL(this.file2),i.onload=function(){e.imageUrl2=i.result,e.showPic2=!0}}}else if("three"===t&&(this.file3=this.$refs.file3.files[0],this.file3)){var n=new FileReader;n.readAsDataURL(this.file3),n.onload=function(){e.imageUrl3=n.result,e.showPic3=!0}}},upload:function(){var t=this,e=new FormData;e.append("account",this.account),e.append("loginPicUrl",this.file1),e.append("registerPicUrl",this.file2),e.append("bindingPicUrl",this.file3),""!==this.account&&""!==this.file1&&""!==this.file2&&""!==this.file3||alert("请将信息填写完整"),h.createPromotionProof(e).then(function(e){console.log("res",e),"0"===e.code&&(alert("提交成功"),t.$router.push({name:"GameDetail"}))})}}},b={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"picUploadCon"},[s("div",{staticClass:"banner"}),t._v(" "),s("div",{staticClass:"centerCon"},[s("div",{staticClass:"item"},[s("div",{staticClass:"label"},[t._v("试玩手机号")]),t._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.account,expression:"account"}],staticClass:"input",attrs:{type:"text",placeholder:"请输入试玩手机号"},domProps:{value:t.account},on:{input:function(e){e.target.composing||(t.account=e.target.value)}}})]),t._v(" "),s("div",{staticClass:"item"},[s("div",{staticClass:"label uploadLabel"},[t._v("登录截图")]),t._v(" "),s("div",{staticClass:"uploadImg"},[s("img",{directives:[{name:"show",rawName:"v-show",value:t.showPic1,expression:"showPic1"}],staticClass:"picImg",attrs:{src:t.imageUrl1}}),t._v(" "),s("input",{ref:"file1",staticClass:"logimg",attrs:{type:"file",accept:"image/*"},on:{change:function(e){return t.onRead("one")}}})])]),t._v(" "),s("div",{staticClass:"item"},[s("div",{staticClass:"label uploadLabel"},[t._v("注册截图")]),t._v(" "),s("div",{staticClass:"uploadImg"},[s("img",{directives:[{name:"show",rawName:"v-show",value:t.showPic2,expression:"showPic2"}],staticClass:"picImg",attrs:{src:t.imageUrl2}}),t._v(" "),s("input",{ref:"file2",staticClass:"logimg",attrs:{type:"file",accept:"image/*"},on:{change:function(e){return t.onRead("two")}}})])]),t._v(" "),s("div",{staticClass:"item"},[s("div",{staticClass:"label uploadLabel"},[t._v("绑定截图")]),t._v(" "),s("div",{staticClass:"uploadImg"},[s("img",{directives:[{name:"show",rawName:"v-show",value:t.showPic3,expression:"showPic3"}],staticClass:"picImg",attrs:{src:t.imageUrl3}}),t._v(" "),s("input",{ref:"file3",staticClass:"logimg",attrs:{type:"file",accept:"image/*"},on:{change:function(e){return t.onRead("three")}}})])])]),t._v(" "),s("div",{staticClass:"btn",on:{click:function(e){return t.upload()}}},[t._v("提交")])])},staticRenderFns:[]};var P=s("VU/8")(C,b,!1,function(t){s("ZBDd")},"data-v-6f07b36c",null).exports;i.default.use(o.a);var I=new o.a({mode:"history",base:"/gift/",routes:[{path:"/",name:"Gift",component:m},{path:"/gameDetail",name:"GameDetail",component:_},{path:"/giftTip",name:"GiftTip",component:l},{path:"/picUpload",name:"PicUpload",component:P}]}),y=(s("sVYa"),s("7QTg")),U=s.n(y),T=(s("v2ns"),s("pQgH")),k=s("UF21"),x=s.n(k),q=(s("bJWl"),s("Fd2+")),M=s("pIqd"),R=s.n(M);i.default.use(q.b),i.default.use(q.c),i.default.use(R.a),i.default.use(x.a),i.default.use(T.a);var D=o.a.prototype.push;o.a.prototype.push=function(t){return D.call(this,t).catch(function(t){return t})},i.default.use(U.a),i.default.config.productionTip=!1,i.default.prototype.prev=function(){this.$router.go(-1)},new i.default({el:"#app",router:I,components:{App:a},template:"<App/>"})},v2ns:function(t,e){},vxUu:function(t,e,s){"use strict";var i=s("VN0c"),n={getUserInfo:function(){return i.a.request("/user/getInfo",{},"get")},updateUserInfo:function(t){return i.a.formRequest("/user/updateInfo",t)},inviteLink:function(){return i.a.formRequestios("/user/getInviteLink",{},"get")},getMyTeam:function(t){return i.a.formRequestios("/user/getMyTeam",t)}};e.a=n}},[2]);
//# sourceMappingURL=gift.acaebd58b466e24775fd.js.map