webpackJsonp([3], {
    "0Y+T": function (e, s) {
    }, 2: function (e, s, t) {
        t("j1ja"), e.exports = t("NwR0")
    }, "7CaW": function (e, s) {
    }, DloW: function (e, s) {
    }, G026: function (e, s) {
    }, LQxx: function (e, s) {
    }, NwR0: function (e, s, t) {
        "use strict";
        Object.defineProperty(s, "__esModule", {value: !0});
        var n = t("7+uW"), o = {
            render: function () {
                var e = this.$createElement, s = this._self._c || e;
                return s("div", {attrs: {id: "app"}}, [s("keep-alive", [s("router-view")], 1)], 1)
            }, staticRenderFns: []
        };
        var r = t("VU/8")({
            name: "App", data: function () {
                return {path: "", tabs: !1}
            }
        }, o, !1, function (e) {
            t("DloW")
        }, null, null).exports, a = t("/ocq"), i = t("VN0c"), c = {
            getCode: function (e) {
                return i.a.formRequestios("/verify/sendVerifySmsMessage_test", e)
            }, register: function (e) {
                return i.a.formRequestios("/user/register_test", e)
            }
        }, l = {
            name: "Register", data: function () {
                return {
                    showPop: !1,
                    showPw: !1,
                    aShowPw: !1,
                    password: "",
                    aPassword: "",
                    showCodeBtn: !0,
                    codeBtnText: "获取验证码",
                    count: "",
                    timer: null,
                    inviteCode: "",
                    phone: "",
                    code: "",
                    canClick: !1,
                    canClickCode: !1,
                    lastdates: "",
                    errorPhone: !1,
                    errorPw: !1,
                    erroraPw: !1
                }
            }, mounted: function () {
                var e = new Date, s = e.getFullYear(), t = e.getMonth() + 1, n = e.getDate();
                t >= 1 && t <= 9 && (t = "0" + t), n >= 0 && n <= 9 && (n = "0" + n);
                var o = s + "-" + t + "-" + n;
                this.dateDiff(o, "2019-10-01")
            }, methods: {
                showPopaa: function () {
                    this.showPop = !0
                }, testPW: function () {
                    var e = this.password;
                    return /^(?=.*[a-z])(?=.*[A-Z])[^]{6,16}$/.test(e) ? (this.errorPw = !1, !0) : (this.errorPw = !0, this.$toastMessage({
                        message: "密码最少包含大小写字母各一个且为6-16位",
                        messageType: "text"
                    }), !1)
                }, fixScroll: function () {
                    window.scrollTo(0, 0)
                }, dateDiff: function (e, s) {
                    var t = e.split("-"), n = s.split("-"), o = new Date(t[0], t[1] - 1, t[2]),
                        r = new Date(n[0], n[1] - 1, n[2]), a = parseInt(Math.abs(r - o) / 1e3 / 60 / 60 / 24);
                    this.lastdates = a
                }, test: function () {
                    return "" == this.phone || this.phone.length <= 10 || !/^1[0-9]{10}$/.test(this.phone) ? (console.log("请输入正确的手机号"), this.errorPhone = !0, this.$toastMessage({
                        message: "请输入正确的手机号",
                        messageType: "text"
                    }), this.phone = "", this.canClickCode = !1, this.fixScroll(), !1) : (console.log("手机号正确，验证通过"), this.canClickCode = !0, this.errorPhone = !1, this.fixScroll(), this.$toastMessage({
                        message: "密码最少包含大小写字母各一个且为6-16位",
                        messageType: "text"
                    }), !0)
                }, showLoginBtn: function () {
                    var e = this.password, s = this.aPassword, t = this.code, n = e === s, o = this.testPW();
                    "" != e && "" != s && n && "" != t && o ? (console.log("显示注册按钮"), this.canClick = !0) : this.canClick = !1
                }, showPassword: function (e) {
                    var s = this.$refs.passwordInput.type, t = this.$refs.aPasswordInput.type;
                    "a" === e ? "password" == t ? (this.$refs.aPasswordInput.type = "text", console.log("显示密码"), this.aShowPw = !0) : (this.$refs.aPasswordInput.type = "password", console.log("隐藏密码"), this.aShowPw = !1) : "password" == s ? (this.$refs.passwordInput.type = "text", console.log("显示密码"), this.showPw = !0) : (this.$refs.passwordInput.type = "password", console.log("隐藏密码"), this.showPw = !1)
                }, equalPw: function () {
                    return this.fixScroll(), this.password !== this.aPassword ? (this.erroraPw = !0, this.$toastMessage({
                        message: "两次输入的密码不一致",
                        messageType: "text"
                    }), !1) : (this.erroraPw = !1, !0)
                }, goAgreement: function () {
                    this.$router.push({path: "/prepareAgreement", name: "PrepareAgreement"})
                }, getCode: function () {
                    var e = this, s = {tel_number: this.phone};
                    c.getCode(s).then(function (s) {
                        if (console.log("res", s), "0" === s.code) {
                            e.timer || (e.count = 60, e.showCodeBtn = !1, e.timer = setInterval(function () {
                                e.count > 0 && e.count <= 60 ? e.count-- : (e.showCodeBtn = !0, e.codeBtnText = "重新获取", clearInterval(e.timer), e.timer = null)
                            }, 1e3))
                        }
                    })
                }, registerLogin: function () {
                    var e = this;
                    if (this.canClick) {
                        var s = {
                            smsVerifyCode: this.code,
                            password: this.password,
                            tel_number: this.phone,
                            inviteCode: this.inviteCode
                        };
                        c.register(s).then(function (s) {
                            console.log("res", s), "0" === s.code && (e.showPop = !0)
                        })
                    }
                }, goSignIn: function () {
                    window.open("https://www.beihaozhuan.com/missionSignIn", "_self")
                }
            }
        }, v = {
            render: function () {
                var e = this, s = e.$createElement, n = e._self._c || s;
                return n("div", {staticClass: "loginBg"}, [n("div", {staticClass: "lastdatesCon"}, [e._v("距平台上线还有"), n("span", [e._v(" " + e._s(e.lastdates) + " ")]), e._v("天")]), e._v(" "), e._m(0), e._v(" "), n("div", {staticClass: "registerInfo"}, [n("div", {
                    staticClass: "infoItem",
                    class: {errorTipsBorder: e.errorPhone}
                }, [n("input", {
                    directives: [{name: "model", rawName: "v-model", value: e.phone, expression: "phone"}],
                    attrs: {
                        type: "text",
                        placeholder: "请输入手机号",
                        oninput: "value=value.replace(/[^\\d]/g,'')",
                        maxlength: "11"
                    },
                    domProps: {value: e.phone},
                    on: {
                        blur: function (s) {
                            return e.test()
                        }, input: function (s) {
                            s.target.composing || (e.phone = s.target.value)
                        }
                    }
                })]), e._v(" "), n("div", {
                    staticClass: "infoItem",
                    class: {errorTipsBorder: e.errorPw}
                }, [n("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: e.password,
                        expression: "password"
                    }],
                    ref: "passwordInput",
                    staticClass: "pwInput",
                    attrs: {type: "password", placeholder: "请输入密码"},
                    domProps: {value: e.password},
                    on: {
                        blur: function (s) {
                            return e.testPW()
                        }, input: function (s) {
                            s.target.composing || (e.password = s.target.value)
                        }
                    }
                }), e._v(" "), n("div", {
                    staticClass: "hidePw", class: {showPw: e.showPw}, on: {
                        click: function (s) {
                            return e.showPassword()
                        }
                    }
                })]), e._v(" "), n("div", {
                    staticClass: "infoItem",
                    class: {errorTipsBorder: e.erroraPw}
                }, [n("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: e.aPassword,
                        expression: "aPassword"
                    }],
                    ref: "aPasswordInput",
                    staticClass: "pwInput",
                    attrs: {type: "password", placeholder: "请再次确认密码"},
                    domProps: {value: e.aPassword},
                    on: {
                        blur: function (s) {
                            return e.equalPw()
                        }, input: [function (s) {
                            s.target.composing || (e.aPassword = s.target.value)
                        }, function (s) {
                            return e.showLoginBtn()
                        }]
                    }
                }), e._v(" "), n("div", {
                    staticClass: "hidePw", class: {aShowPw: e.aShowPw}, on: {
                        click: function (s) {
                            return e.showPassword("a")
                        }
                    }
                })]), e._v(" "), n("div", {staticClass: "infoItem"}, [n("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: e.code,
                        expression: "code"
                    }],
                    staticClass: "pwInput",
                    attrs: {type: "text", placeholder: "请输入验证码"},
                    domProps: {value: e.code},
                    on: {
                        input: [function (s) {
                            s.target.composing || (e.code = s.target.value)
                        }, function (s) {
                            return e.showLoginBtn()
                        }], blur: function (s) {
                            return e.fixScroll()
                        }
                    }
                }), e._v(" "), n("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: e.showCodeBtn,
                        expression: "showCodeBtn"
                    }], staticClass: "code", class: {canClickCode: e.canClickCode}, on: {
                        click: function (s) {
                            return e.getCode()
                        }
                    }
                }, [e._v(e._s(e.codeBtnText))]), e._v(" "), n("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: !e.showCodeBtn,
                        expression: "!showCodeBtn"
                    }], staticClass: "code"
                }, [e._v(e._s(e.count) + "S")])])]), e._v(" "), n("div", {staticClass: "note"}, [e._v("\n      注册表示同意\n"), e._v(" "), n("span", {
                    staticClass: "agreeText",
                    on: {
                        click: function (s) {
                            return e.goAgreement()
                        }
                    }
                }, [e._v("《用户许可使用协议》")])]), e._v(" "), n("div", {
                    staticClass: "registerBtn",
                    class: {canClick: e.canClick},
                    on: {
                        click: function (s) {
                            return e.registerLogin()
                        }
                    }
                }, [e._v("\n      注册\n    ")]), e._v(" "), n("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: e.showPop,
                        expression: "showPop"
                    }], staticClass: "mask"
                }), e._v(" "), n("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: e.showPop,
                        expression: "showPop"
                    }], staticClass: "popCon"
                }, [n("img", {
                    attrs: {
                        src: t("vCpc"),
                        alt: ""
                    }
                }), e._v(" "), n("div", {staticClass: "popPhone"}, [e._v(e._s(e.phone))]), e._v(" "), n("div", {
                    staticClass: "goSignInBtn",
                    on: {
                        click: function (s) {
                            return e.goSignIn()
                        }
                    }
                }, [e._v("去签到")])])])
            }, staticRenderFns: [function () {
                var e = this.$createElement, s = this._self._c || e;
                return s("div", {staticClass: "registerLogoCon"}, [s("div", {staticClass: "registerLogo"})])
            }]
        };
        var u = t("VU/8")(l, v, !1, function (e) {
            t("LQxx")
        }, "data-v-5074be70", null).exports, d = t("y7o8");
        n.default.use(a.a);
        var p = new a.a({
                mode: "history",
                base: "/prepare/",
                routes: [{path: "/", name: "PrepareRegister", component: u}, {
                    path: "/prepareAgreement",
                    name: "PrepareAgreement",
                    component: d.a
                }]
            }), h = (t("sVYa"), t("7QTg")), w = t.n(h), _ = (t("v2ns"), t("pQgH")), g = t("UF21"), m = t.n(g),
            f = (t("bJWl"), t("Fd2+")), b = t("pIqd"), C = t.n(b);
        n.default.use(f.a), n.default.use(C.a), n.default.use(m.a), n.default.use(_.a);
        var P = a.a.prototype.push;
        a.a.prototype.push = function (e) {
            return P.call(this, e).catch(function (e) {
                return e
            })
        }, n.default.use(w.a), n.default.config.productionTip = !1, n.default.prototype.prev = function () {
            this.$router.go(-1)
        }, new n.default({el: "#app", router: p, components: {App: r}, template: "<App/>"})
    }, VN0c: function (e, s, t) {
        "use strict";
        var n = t("//Fk"), o = t.n(n), r = t("mtWM"), a = t.n(r), i = t("mw3O"), c = t.n(i), l = a.a.create({
            baseURL: "https://www.beihaozhuan.com",
            withCredentials: !0,
            headers: {"Content-Type": "application/x-www-form-urlencoded", "Access-Control-Allow-Credentials": !0}
        }), v = a.a.create({
            baseURL: "https://www.beihaozhuan.com",
            withCredentials: !0,
            headers: {"Content-Type": "multipart/form-data", "Access-Control-Allow-Credentials": !0}
        }), u = a.a.create({
            baseURL: "https://www.beihaozhuan.com",
            withCredentials: !0,
            headers: {"Content-Type": "application/x-www-form-urlencoded", "Access-Control-Allow-Credentials": !0}
        }), d = {
            request: function (e) {
                var s = this, t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "post";
                return new o.a(function (o, r) {
                    var a = {url: e, method: n};
                    "get" === n.toLowerCase() ? a.params = c.a.stringify(t) : a.data = c.a.stringify(t), l(a).then(function (e) {
                        console.log("返回数据", e), o(e.data)
                    }).catch(function (e) {
                        console.log("操作失败111", e), e.response ? (console.log("error.response"), 401 === e.response.status ? (console.log("当前用户未登录"), s.router.push({name: "Login"})) : 403 === e.response.status ? (console.log("验证码不正确"), alert("验证码不正确")) : alert("服务器忙")) : alert("服务器忙")
                    })
                })
            }, formRequest: function (e) {
                var s = this, t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "post";
                return new o.a(function (o, r) {
                    var a = {url: e, method: n};
                    "get" === n.toLowerCase() ? a.params = t : a.data = t, v(a).then(function (e) {
                        console.log("返回数据", e), o(e.data)
                    }).catch(function (e) {
                        e.response ? (console.log("error.response"), 401 === e.response.status ? (console.log("当前用户未登录"), s.router.push({name: "Login"})) : alert("服务器忙")) : alert("服务器忙")
                    })
                })
            }, formRequestios: function (e) {
                var s = this, t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "post";
                return new o.a(function (o, r) {
                    var a = {url: e, method: n};
                    "get" === n.toLowerCase() ? a.params = c.a.stringify(t) : a.data = c.a.stringify(t), u(a).then(function (e) {
                        console.log("返回数据", e), o(e.data)
                    }).catch(function (e) {
                        e.response ? (console.log("error.response"), 401 === e.response.status ? (console.log("当前用户未登录"), s.router.push({name: "Login"})) : 400 === e.response.status ? (console.log("当前手机号已注册"), alert("当前手机号已注册")) : 403 === e.response.status ? (console.log("验证码不正确"), alert("验证码不正确")) : alert("服务器忙")) : alert("服务器忙")
                    })
                })
            }
        };
        s.a = d
    }, XqYu: function (e, s) {
    }, pQgH: function (e, s, t) {
        "use strict";
        var n = t("pFYg"), o = t.n(n), r = t("7+uW"), a = {
            render: function () {
                var e = this, s = e.$createElement, t = e._self._c || s;
                return "text" === e.messageType && e.show ? t("div", {staticClass: "toastMessageBox"}, [e._v("\n  " + e._s(e.message) + "\n")]) : "success" === e.messageType && e.show ? t("div", {staticClass: "iconMessageBox"}, [t("div", {staticClass: "messageIcon success"}), e._v(" "), t("div", {staticClass: "message"}, [e._v(e._s(e.message))])]) : "error" === e.messageType && e.show ? t("div", {staticClass: "iconMessageBox"}, [t("div", {staticClass: "messageIcon error"}), e._v(" "), t("div", {staticClass: "message"}, [e._v(e._s(e.message))])]) : "loading" === e.messageType && e.show ? t("div", {staticClass: "iconMessageBox"}, [t("div", {staticClass: "messageIcon loading"}), e._v(" "), t("div", {staticClass: "message"}, [e._v(e._s(e.message))])]) : e._e()
            }, staticRenderFns: []
        };
        var i = t("VU/8")({
            name: "Toast", data: function () {
                return {message: "", show: !1, messageType: ""}
            }
        }, a, !1, function (e) {
            t("G026")
        }, "data-v-296ea46e", null).exports, c = r.default.extend(i), l = void 0, v = null, u = function (e) {
            l || ((l = new c).vm = l.$mount(), document.body.appendChild(l.vm.$el)), console.log(e), v && (clearTimeout(v), v = null, l.show = !1, l.message = "");
            if ("string" == typeof e) l.message = e; else {
                if ("object" !== (void 0 === e ? "undefined" : o()(e))) return;
                var s = e.message, t = e.messageType;
                l.message = s, l.messageType = t
            }
            l.show = !0, v = setTimeout(function () {
                l.show = !1, clearTimeout(v), v = null, l.message = ""
            }, 2e3)
        };
        u.close = function () {
            v && (clearTimeout(v), v = null, l.show = !1, l.message = "")
        }, u.install = function (e) {
            console.log("install--------toastMessage"), e.prototype.$toastMessage = u
        };
        s.a = u
    }, v2ns: function (e, s) {
    }, vCpc: function (e, s, t) {
        e.exports = t.p + "static/img/WechatIMG2.7becbeb.jpeg"
    }, y7o8: function (e, s, t) {
        "use strict";
        var n = {
            render: function () {
                var e = this, s = e.$createElement, t = e._self._c || s;
                return t("div", {staticClass: "agreement"}, [t("div", {
                    staticClass: "backIcon",
                    on: {
                        click: function (s) {
                            return e.prev()
                        }
                    }
                }), e._v(" "), t("div", {staticClass: "title"}, [e._v("用户许可使用协议协议")]), e._v(" "), e._m(0)])
            }, staticRenderFns: [function () {
                var e = this, s = e.$createElement, t = e._self._c || s;
                return t("div", {staticClass: "detail"}, [e._v("\n    天津优享钜科技有限公司（以下简称“优享钜”）在此特别提醒您（用户）在注册成为用户之前，请认真阅读本《用户使用协议》（以下简称“协议”），确保您充分理解本协议中各条款，特别是字体加黑的内容。请您审慎阅读并选择接受或不接受本协议。除非您接受本协议所有条款，否则您无权注册、登录或使用本协议所涉服务。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。"), t("br"), e._v("\n    本协议约定优享钜与用户之间关于“贝好赚”软件服务（以下简称“服务”）的权利义务。“用户”是指注册、登录、使用本服务的个人。本协议可由优享钜随时更新，更新后的协议条款一旦公布即代替原来的协议条款，用户可在本网站查阅最新版协议条款。在优享钜修改协议条款后，如果用户不接受修改后的条款，请立即停止使用优享钜提供的服务，用户继续使用优享钜提供的服务将被视为接受修改后的协议。"), t("br"), e._v("\n    一、帐号注册"), t("br"), e._v("\n    用户在使用本服务前需要注册一个“贝好赚”帐号。“贝好赚”帐号应当使用手机号码绑定注册，请用户使用尚未与“贝好赚”帐号绑定的手机号码，以及未被优享钜根据本协议封禁的手机号码注册“贝好赚”帐号。优享钜可以根据用户需求或产品需要对帐号注册和绑定的方式进行变更，而无须事先通知用户。"), t("br"), e._v("\n    二、服务内容"), t("br"), e._v("\n    本服务的具体内容由优享钜根据实际情况提供，包括但不限于授权用户通过其帐号进行任务接受、虚拟币兑付结算、商城商品兑换、虚拟游戏体验等项目。"), t("br"), e._v("\n    三、内容规范"), t("br"), e._v("\n    1、用户不得利用“贝好赚”帐号或本服务制作、上载、复制、发布、传播如下法律、法规和政策禁止的内容："), t("br"), e._v("\n    (1) 反对宪法所确定的基本原则的；"), t("br"), e._v("\n    (2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；"), t("br"), e._v("\n    (3) 损害国家荣誉和利益的；"), t("br"), e._v("\n    (4) 煽动民族仇恨、民族歧视，破坏民族团结的；"), t("br"), e._v("\n    (5) 破坏国家宗教政策，宣扬邪教和封建迷信的；"), t("br"), e._v("\n    (6) 散布谣言，扰乱社会秩序，破坏社会稳定的；"), t("br"), e._v("\n    (7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；"), t("br"), e._v("\n    (8) 侮辱或者诽谤他人，侵害他人合法权益的；"), t("br"), e._v("\n    (9) 不遵守法律法规底线、社会主义制度底线、国家利益底线、公民合法权益底线、社会公共秩序底线、道德风尚底线和信息真实性底线的“七条底线”要求的；"), t("br"), e._v("\n    (10) 含有法律、行政法规禁止的其他内容的信息。"), t("br"), e._v("\n    2、用户不得利用“贝好赚”帐号或本服务制作、上载、复制、发布、传播如下干扰“贝好赚”正常运营，以及侵犯其他用户或第三方合法权益的内容："), t("br"), e._v("\n    (1) 含有任何性或性暗示的；"), t("br"), e._v("\n    (2) 含有辱骂、恐吓、威胁内容的；"), t("br"), e._v("\n    (3) 含有骚扰、垃圾广告、恶意信息、诱骗信息的；"), t("br"), e._v("\n    (4) 涉及他人隐私、个人信息或资料的；"), t("br"), e._v("\n    (5) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；"), t("br"), e._v("\n    (6) 含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。"), t("br"), e._v("\n    四、使用规则"), t("br"), e._v("\n    1、用户在本服务中或通过本服务所传送、发布的任何内容并不反映或代表，也不得被视为反映或代表优享钜的观点、立场或政策，优享钜对此不承担任何责任。"), t("br"), e._v("\n    2、用户不得利用“贝好赚”帐号或本服务进行如下行为："), t("br"), e._v("\n    (1) 提交、发布虚假信息，或盗用他人头像或资料，冒充、利用他人名义的；"), t("br"), e._v("\n    (2) 强制、诱导其他用户关注、点击链接页面或分享信息的；"), t("br"), e._v("\n    (3) 虚构事实、隐瞒真相以误导、欺骗他人的；"), t("br"), e._v("\n    (4) 利用技术手段批量建立虚假帐号的；"), t("br"), e._v("\n    (5) 利用“贝好赚”帐号或本服务从事任何违法犯罪活动的；"), t("br"), e._v("\n    (6) 制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播，无论这些行为是否为商业目的；"), t("br"), e._v("\n    (7) 其他违反法律法规规定、侵犯其他用户合法权益、干扰“贝好赚”正常运营或优享钜未明示授权的行为。"), t("br"), e._v("\n    3、用户须对利用“贝好赚”帐号或本服务传送信息的真实性、合法性、无害性、准确性、有效性等全权负责，与用户所传播的信息相关的任何法律责任由用户自行承担，与优享钜无关。如因此给优享钜或第三方造成损害的，用户应当依法予以赔偿。"), t("br"), e._v("\n    4、优享钜提供的服务中可能包括广告，用户同意在使用过程中显示优享钜和第三方供应商、合作伙伴提供的广告。除法律法规明确规定外，用户应自行对依该广告信息进行的交易负责，对用户因依该广告信息进行的交易或前述广告商提供的内容而遭受的损失或损害，优享钜不承担任何责任。"), t("br"), e._v("\n    5、除非优享钜书面许可，用户不得从事下列任一行为："), t("br"), e._v("\n    (1) 删除软件及其副本上关于著作权的信息；"), t("br"), e._v("\n    (2) 对软件进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现软件的源代码；"), t("br"), e._v("\n    (3) 对优享钜拥有知识产权的内容进行使用、出租、出借、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点等；"), t("br"), e._v("\n    (4) 对软件或者软件运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及软件运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非经优享钜授权的第三方工具/服务接入软件和相关系统；"), t("br"), e._v("\n    (5) 通过修改或伪造软件运行中的指令、数据，增加、删减、变动软件的功能或运行效果，或者将用于上述用途的软件、方法进行运营或向公众传播，无论这些行为是否为商业目的；"), t("br"), e._v("\n    (6) 通过非优享钜开发、授权的第三方软件、插件、外挂、系统，登录或使用优享钜软件及服务，或制作、发布、传播非优享钜开发、授权的第三方软件、插件、外挂、系统。"), t("br"), e._v("\n    五、账户管理"), t("br"), e._v("\n    1、 “贝好赚”帐号的所有权归优享钜所有，用户完成申请注册手续后，获得“贝好赚”帐号的使用权，该使用权仅属于初始申请注册人，禁止赠与、借用、租用、转让或售卖。优享钜因经营需要，有权回收用户的“贝好赚”帐号。"), t("br"), e._v("\n    2、用户可以通过1）查看与编辑个人资料页，2）“设置”页面里的“账号与安全”页面来查询、更改、删除、注销“贝好赚”帐户上的个人资料、注册信息及传送内容等，但需注意，删除有关信息的同时也会删除用户储存在系统中的文字和图片。用户需承担该风险。"), t("br"), e._v("\n    3、用户有责任妥善保管注册帐号信息及帐号密码的安全，因用户保管不善可能导致遭受盗号或密码失窃，责任由用户自行承担。用户需要对注册帐号以及密码下的行为承担法律责任。用户同意在任何情况下不使用其他用户的帐号或密码。在用户怀疑他人使用其帐号或密码时，用户同意立即通知优享钜。"), t("br"), e._v("\n    4、用户应遵守本协议的各项条款，正确、适当地使用本服务，如因用户违反本协议中的任何条款，优享钜在通知用户后有权依据协议中断或终止对违约用户“贝好赚”帐号提供服务。同时，优享钜保留在任何时候收回“贝好赚”帐号、用户名的权利。"), t("br"), e._v("\n    5、如用户注册“贝好赚”帐号后一年不登录，通知用户后，优享钜可以收回该帐号，以免造成资源浪费，由此造成的不利后果由用户自行承担。"), t("br"), e._v("\n    6、用户可以通过“设置”页面里的“账号与安全”页面来进行账号注销服务，用户确认注销账号是不可恢复的操作，用户应自行备份与贝好赚账号相关的信息和数据，用户确认操作之前与贝好赚账号相关的所有服务均已进行妥善处理。用户确认并同意注销账号后并不代表本贝好赚账号注销前的账号行为和相关责任得到豁免或减轻，如在注销期间，用户的账号被他人投诉、被国家机关调查或者正处于诉讼、仲裁程序中，优享钜有限自行终止用户的账号注销并无需另行得到用户的同意。"), t("br"), e._v("\n    六、数据储存"), t("br"), e._v("\n    1、优享钜不对用户在本服务中相关数据的删除或储存失败负责。"), t("br"), e._v("\n    2、优享钜可以根据实际情况自行决定用户在本服务中数据的最长储存期限，并在服务器上为其分配数据最大存储空间等。用户可根据自己的需要自行备份本服务中的相关数据。"), t("br"), e._v("\n    3、如用户停止使用本服务或本服务终止，优享钜可以从服务器上永久地删除用户的数据。本服务停止、终止后，优享钜没有义务向用户返还任何数据。"), t("br"), e._v("\n    七、风险承担"), t("br"), e._v("\n    1、用户理解并同意，“贝好赚”仅为用户提供任务发布、虚拟币兑换的平台，用户必须为自己注册帐号下的一切行为负责，包括用户所传送的任何内容以及由此产生的任何后果。用户应对“贝好赚”及本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。优享钜无法且不会对因用户行为而导致的任何损失或损害承担责任。"), t("br"), e._v("\n    如果用户发现任何人违反本协议约定或以其他不当的方式使用本服务，请立即向优享钜举报或投诉，举报或投诉电话为022-25326909，优享钜将依本协议约定进行处理。"), t("br"), e._v("\n    2、用户理解并同意，因业务发展需要，优享钜保留单方面对本服务的全部或部分服务内容变更、暂停、终止或撤销的权利，用户需承担此风险。"), t("br"), e._v("\n    八、知识产权声明"), t("br"), e._v("\n    1、除本服务中涉及广告的知识产权由相应广告商享有外，优享钜在本服务中提供的内容（包括但不限于网页、文字、图片、音频、视频、图表等）的知识产权均归优享钜所有，但用户在使用本服务前对自己发布的内容已合法取得知识产权的除外。"), t("br"), e._v("\n    2、除另有特别声明外，优享钜提供本服务时所依托软件的著作权、专利权及其他知识产权均归优享钜所有。"), t("br"), e._v("\n    3、优享钜在本服务中所涉及的图形、文字或其组成，以及其他优享钜标志及产品、服务名称（以下统称“优享钜标识”），其著作权或商标权归优享钜所有。未经优享钜事先书面同意，用户不得将优享钜标识以任何方式展示或使用或作其他处理，也不得向他人表明用户有权展示、使用、或其他有权处理优享钜标识的行为。"), t("br"), e._v("\n    4、上述及其他任何优享钜或相关广告商依法拥有的知识产权均受到法律保护，未经优享钜或相关广告商书面许可，用户不得以任何形式进行使用或创造相关衍生作品。"), t("br"), e._v("\n    5、用户在使用贝好赚服务时发表上传的文字、图片、视频、音频、软件以及表演等信息，此部分信息的知识产权归用户，责任由用户承担。但用户的发表、上传行为视为对优享钜的授权，用户理解并同意授予优享钜及其关联公司全球范围内完全免费、不可撤销、独家、永久、可转授权和可再许可的权利，包括但不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及《著作权法》规定的由著作权人享有的其他著作财产权利及邻接权利。优享钜可自行选择是否使用以及使用方式，包括但不限于将前述信息在优享钜旗下的服务平台上使用与传播，将上述信息再次编辑后使用，以及由优享钜授权给合作方使用、编辑与传播等。"), t("br"), e._v("\n    九、法律责任"), t("br"), e._v("\n    1、如果优享钜发现或收到他人举报或投诉用户违反本协议约定的，优享钜有权不经通知随时对相关内容，包括但不限于用户资料、聊天记录进行审查、删除，并视情节轻重对违规帐号处以包括但不限于警告、帐号封禁 、设备封禁 、功能封禁 的处罚，且通知用户处理结果。"), t("br"), e._v("\n    2、因违反用户协议被封禁的用户，可以自行到 贝好赚公众号查询封禁期限，并在封禁期限届满后自助解封。其中，被实施功能封禁的用户会在封禁期届满后自动恢复被封禁功能。被封禁用户可向优享钜网站相关页面提交申诉，优享钜将对申诉进行审查，并自行合理判断决定是否变更处罚措施。"), t("br"), e._v("\n    3、用户理解并同意，优享钜有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应承担由此而产生的一切法律责任。"), t("br"), e._v("\n    4、用户理解并同意，因用户违反本协议约定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，用户应当赔偿优享钜与合作公司、关联公司，并使之免受损害。"), t("br"), e._v("\n    十、不可抗力及其他免责事由"), t("br"), e._v("\n    1、用户理解并确认，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务发生中断。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、政府行为等。出现上述情况时，优享钜将努力在第一时间与相关单位配合，及时进行修复，但是由此给用户或第三方造成的损失，优享钜及合作单位在法律允许的范围内免责。"), t("br"), e._v("\n    2、本服务同大多数互联网服务一样，受包括但不限于用户原因、网络服务质量、社会环境等因素的差异影响，可能受到各种安全问题的侵扰，如他人利用用户的资料，造成现实生活中的骚扰；用户下载安装的其它软件或访问的其他网站中含有“特洛伊木马”等病毒，威胁到用户的计算机信息和数据的安全，继而影响本服务的正常使用等等。用户应加强信息安全及使用者资料的保护意识，要注意加强密码保护，以免遭致损失和骚扰。"), t("br"), e._v("\n    3、用户理解并确认，本服务存在因不可抗力、计算机病毒或黑客攻击、系统不稳定、用户所在位置、用户关机以及其他任何技术、互联网络、通信线路原因等造成的服务中断或不能满足用户要求的风险，因此导致的用户或第三方任何损失，优享钜不承担任何责任。"), t("br"), e._v("\n    4、用户理解并确认，在使用本服务过程中存在来自任何他人的包括误导性的、欺骗性的、威胁性的、诽谤性的、令人反感的或非法的信息，或侵犯他人权利的匿名或冒名的信息，以及伴随该等信息的行为，因此导致的用户或第三方的任何损失，优享钜不承担任何责任。"), t("br"), e._v("\n    5、用户理解并确认，优享钜需要定期或不定期地对“贝好赚”平台或相关的设备进行检修或者维护，如因此类情况而造成服务在合理时间内的中断，优享钜无需为此承担任何责任。"), t("br"), e._v("\n    6、优享钜依据法律法规、本协议约定获得处理违法违规或违约内容的权利，该权利不构成优享钜的义务或承诺，优享钜不能保证及时发现违法违规或违约行为或进行相应处理。"), t("br"), e._v("\n    7、用户理解并确认，对于优享钜向用户提供的下列产品或者服务的质量缺陷及其引发的任何损失，优享钜无需承担任何责任："), t("br"), e._v("\n    (1) 优享钜向用户免费提供的服务；"), t("br"), e._v("\n    (2) 优享钜向用户赠送的任何产品或者服务。"), t("br"), e._v("\n    8、在任何情况下，优享钜均不对任何间接性、后果性、惩罚性、偶然性、特殊性或刑罚性的损害，包括因用户使用“贝好赚”或本服务而遭受的利润损失，承担责任（即使优享钜已被告知该等损失的可能性亦然）。尽管本协议中可能含有相悖的规定，优享钜对用户承担的全部责任，无论因何原因或何种行为方式，始终不超过用户因使用优享钜提供的服务而支付给优享钜的费用(如有)。"), t("br"), e._v("\n    十一、服务的变更、中断、终止"), t("br"), e._v("\n    1、鉴于网络服务的特殊性，用户同意优享钜有权随时变更、中断或终止部分或全部的服务（包括收费服务）。优享钜变更、中断或终止的服务，优享钜应当在变更、中断或终止之前通知用户，并应向受影响的用户提供等值的替代性的服务；如用户不愿意接受替代性的服务，如果该用户已经向优享钜支付的贝好赚币，优享钜应当按照该用户实际使用服务的情况扣除相应贝好赚币之后将剩余的贝好赚币退还用户的贝好赚币账户中。"), t("br"), e._v("\n    2、如发生下列任何一种情形，优享钜有权变更、中断或终止向用户提供的免费服务或收费服务，而无需对用户或任何第三方承担任何责任："), t("br"), e._v("\n    (1) 根据法律规定用户应提交真实信息，而用户提供的个人资料不真实、或与注册时信息不一致又未能提供合理证明；"), t("br"), e._v("\n    (2) 用户违反相关法律法规或本协议的约定；"), t("br"), e._v("\n    (3) 按照法律规定或有权机关的要求；"), t("br"), e._v("\n    (4) 出于安全的原因或其他必要的情形。"), t("br"), e._v("\n    十二、其他"), t("br"), e._v("\n    1、优享钜郑重提醒用户注意本协议中免除优享钜责任和限制用户权利的条款，请用户仔细阅读，自主考虑风险。"), t("br"), e._v("\n    2、本协议的效力、解释及纠纷的解决，适用于中华人民共和国法律。若用户和优享钜之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户同意将纠纷或争议提交优享钜住所地有管辖权的人民法院管辖。"), t("br"), e._v("\n    3、本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。"), t("br"), e._v("\n    4、由于互联网高速发展，您与优享钜签署的本协议列明的条款可能并不能完整罗列并覆盖您与贝好赚所有权利与义务，现有的约定也不能保证完全符合未来发展的需求。因此，贝好赚隐私权政策、贝好赚平台行为规范等均为本协议的补充协议，与本协议不可分割且具有同等法律效力。如您使用贝好赚平台服务，视为您同意上述补充协议。"), t("br")])
            }]
        };
        var o = t("VU/8")({name: "Agreement"}, n, !1, function (e) {
            t("7CaW")
        }, "data-v-2a9cb677", null);
        s.a = o.exports
    }
}, [2]);
//# sourceMappingURL=prepare.8635a7b86021e70ea37b.js.map