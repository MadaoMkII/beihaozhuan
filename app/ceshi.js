!function (e) {
    function t(o) {
        if (i[o]) return i[o].exports;
        var n = i[o] = {exports: {}, id: o, loaded: !1};
        return e[o].call(n.exports, n, n.exports, t), n.loaded = !0, n.exports
    }

    var i = {};
    t.m = e, t.c = i, t.p = "", t(0)
}([function (e, t, i) {
    "use strict";
    var o = i(1), n = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(o), r = function e() {
        document.removeEventListener("DOMContentLoaded", e), window.main = new n.default, function e() {
            main.update(), window.requestAnimationFrame(e)
        }()
    };
    document.addEventListener("DOMContentLoaded", r)
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var r = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), s = i(2), a = o(s), l = i(4), u = o(l), c = function () {
        function e() {
            n(this, e), console.log("Hello, this is js"), window.main = this, CSSPlugin.defaultForce3D = !0, u.default.resize(), this.DEV_MODE = !0, this._isIntro = !0, this._bgColor = "rgba(255, 255, 255, 1)", u.default.isTouch && document.body.classList.add("isTouch"), this._init(), u.default.isTouch && (window.addEventListener("touchstart", u.default.onTouchStart), window.addEventListener("touchmove", u.default.onMouseMove)), window.addEventListener("mousemove", u.default.onMouseMove), window.addEventListener("resize", this._onResize.bind(this))
        }

        return r(e, [{
            key: "_init", value: function () {
                this._pageManager = new a.default
            }
        }, {
            key: "update", value: function () {
                this._pageManager && this._pageManager.update()
            }
        }, {
            key: "_onResize", value: function () {
                u.default.resize(), this._pageManager && this._pageManager.resize()
            }
        }]), e
    }();
    t.default = c
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t, i, o, n) {
        var r = {};
        return Object.keys(o).forEach(function (e) {
            r[e] = o[e]
        }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
            return o(e, t, i) || i
        }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var s, a = function () {
            function e(e, t) {
                for (var i = 0; i < t.length; i++) {
                    var o = t[i];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }

            return function (t, i, o) {
                return i && e(t.prototype, i), o && e(t, o), t
            }
        }(), l = i(3), u = o(l), c = i(6), h = (o(c), i(11)), d = (o(h), i(12)), p = i(10), f = o(p), y = i(34), v = o(y),
        _ = (s = function () {
            function e() {
                n(this, e), this._router = new u.default, this.init()
            }

            return a(e, [{
                key: "init", value: function () {
                    this._content = document.getElementById("container");
                    var t = this._content.children, i = t[t.length - 1];
                    e.currentId = i.getAttribute("id"), this._router.changed.add(this._onStateChange.bind(this)), this._ajaxify(i)
                }
            }, {
                key: "update", value: function () {
                    this._popin && this._popin.update(), this._page && this._page.update(), this._previousPage && this._previousPage.update()
                }
            }, {
                key: "resize", value: function () {
                    this._popin && this._popin.resize(), this._page && this._page.resize(), this._previousPage && this._previousPage.resize()
                }
            }, {
                key: "_ajaxify", value: function (t, i) {
                    var o;
                    o = d.sitemap.pages[e.currentId] ? d.sitemap.pages[e.currentId].class : d.sitemap.pages.default.class, i || (this._previousPage = this._page);
                    var n = new o.default(t, this._page);
                    n.init(), n.shown.add(this._onPageShown), i ? (this._popin = n, this._popin.hidden.add(this._onPopinHidden)) : (this._page = n, this._previousPage && (this._previousPage.hidden.add(this._onPageHidden), this._previousPage.hide(this._page), window.scrollTo(0, 0))), n.show()
                }
            }, {
                key: "_setContent", value: function (t, i) {
                    var o = new DOMParser, n = o.parseFromString(t, "text/html"), r = n.querySelector("#container"),
                        s = r.children[r.children.length - 1];
                    this._content.appendChild(s);
                    var a = n.querySelector("title");
                    e.currentId = s.getAttribute("id"), u.default.setTitle(a.innerText), this._ajaxify(s, i)
                }
            }, {
                key: "_onStateChange", value: function (e) {
                    var t = this;
                    this._page && this._page.scrollable && (this._page.scrollable.scrollLocked = !0), this._xhr && this._xhr.abort();
                    var i = function (i, o) {
                        t._setContent(i, e && e.popin)
                    }, o = function (e, i) {
                        document.body.classList.remove("loading"), t._router.locked = !0, t._xhr = null
                    };
                    document.body.classList.add("loading"), this._xhr = (0, v.default)().get(this._router.url), this._xhr.then(i), this._xhr.always(o)
                }
            }, {
                key: "_onPageHidden", value: function () {
                    this._page.isShown && (this._previousPage.isDestroyed || this._previousPage.destroy(), this._previousPage = null, this._router.locked = !1)
                }
            }, {
                key: "_onPopinHidden", value: function () {
                    this._popin.destroy(), this._popin = null
                }
            }, {
                key: "_onPageShown", value: function () {
                    this._previousPage && this._previousPage.isHidden && (this._previousPage.isDestroyed || this._previousPage.destroy(), this._previousPage = null, this._router.locked = !1)
                }
            }]), e
        }(), r(s.prototype, "_onPageHidden", [f.default], Object.getOwnPropertyDescriptor(s.prototype, "_onPageHidden"), s.prototype), r(s.prototype, "_onPopinHidden", [f.default], Object.getOwnPropertyDescriptor(s.prototype, "_onPopinHidden"), s.prototype), r(s.prototype, "_onPageShown", [f.default], Object.getOwnPropertyDescriptor(s.prototype, "_onPageShown"), s.prototype), s);
    t.default = _
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var r, s = function () {
            function e(e, t) {
                for (var i = 0; i < t.length; i++) {
                    var o = t[i];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }

            return function (t, i, o) {
                return i && e(t.prototype, i), o && e(t, o), t
            }
        }(), a = i(4), l = (o(a), i(5)), u = (o(l), i(6)), c = (o(u), i(7)), h = o(c), d = i(8), p = o(d), f = i(10),
        y = o(f), v = (r = function () {
            function e() {
                n(this, e), this.changed = new h.default, function (e) {
                    var t = e.pushState;
                    e.pushState = function (i, o, n) {
                        i.url = n;
                        var r = new CustomEvent("popstate", {detail: i}), s = t.apply(e, arguments);
                        return window.dispatchEvent(r), s
                    }
                }(window.history), (0, p.default)(document.body, "a:not([target])", "click", this._onClickLink.bind(this)), window.addEventListener("popstate", this._onPopState), window.addEventListener("pushstate", this._onPopState), this.parser = document.createElement("a"), this.url = this._sanitizeUrl(window.location.href), this.origin = window.location.origin, history.replaceState(null, document.title, this.url)
            }

            return s(e, [{
                key: "_sanitizeUrl", value: function (e) {
                    return "" !== window.location.hash && (e = e.replace(window.location.hash, "")), "/" !== e[e.length - 1] && (e += "/"), e
                }
            }, {
                key: "_onClickLink", value: function (e) {
                    if (1 !== e.button) {
                        e.preventDefault();
                        var t = e.delegateTarget;
                        this.parser.href = t.getAttribute("href") || t._href;
                        var i = "";
                        "/" !== this.parser.pathname[0] && (i = "/");
                        var o = this.origin + i + this.parser.pathname + this.parser.search + this.parser.hash,
                            n = "true" === t.getAttribute("data-prevent"), r = "true" === t.getAttribute("data-popin");
                        history.pushState({prevented: n, popin: r}, document.title, o)
                    }
                }
            }, {
                key: "_onPopState", value: function (e) {
                    var t = e.detail, i = this._sanitizeUrl(window.location.href);
                    this.url !== i && (this.url = i, window.ga && ga("send", "pageview"), t && t.prevented || this.changed.dispatch(t))
                }
            }], [{
                key: "setTitle", value: function (e) {
                    document.title = e
                }
            }, {
                key: "setCurrentId", value: function (t) {
                    e.currentId = t
                }
            }]), e
        }(), function (e, t, i, o, n) {
            var r = {};
            return Object.keys(o).forEach(function (e) {
                r[e] = o[e]
            }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
                return o(e, t, i) || i
            }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
        }(r.prototype, "_onPopState", [y.default], Object.getOwnPropertyDescriptor(r.prototype, "_onPopState"), r.prototype), r);
    t.default = v
}, function (e, t) {
    "use strict";

    function i(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    Object.defineProperty(t, "__esModule", {value: !0});
    var o = function e() {
        i(this, e)
    };
    t.default = o, window.mobileAndTabletcheck = function () {
        var e = !1;
        return function (t) {
            (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
        }(navigator.userAgent || navigator.vendor || window.opera), e
    }, o.isTouch = window.mobileAndTabletcheck(), o.dpr = void 0 !== window.devicePixelRatio ? window.devicePixelRatio : 1, o.IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, o.resize = function () {
        o.width = window.innerWidth, o.height = window.innerHeight, o.centerX = .5 * o.width, o.centerY = .5 * o.height, o.mobile = o.width < 740;
        o.isRetina = !!matchMedia("(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)").matches
    }, o.mouseX = 0, o.mouseY = 0, o.onTouchStart = function (e) {
        e.targetTouches ? (o.mouseX = e.targetTouches[0].clientX, o.mouseY = e.targetTouches[0].clientY) : e.changedTouches && (o.mouseX = e.changedTouches[0].clientX, o.mouseY = e.changedTouches[0].clientY)
    }, o.onMouseMove = function (e) {
        o.isTouch ? e.targetTouches ? (o.mouseX = e.targetTouches[0].clientX, o.mouseY = e.targetTouches[0].clientY) : e.changedTouches && (o.mouseX = e.changedTouches[0].clientX, o.mouseY = e.changedTouches[0].clientY) : (o.mouseX = e.clientX, o.mouseY = e.clientY)
    }, o.isRetina = function () {
        return (window.matchMedia && (window.matchMedia("only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)").matches || window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)").matches) || window.devicePixelRatio && window.devicePixelRatio >= 2) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
    }
}, function (e, t) {
    "use strict";
    var i = e.exports = function () {
    };
    i.DOWN = "mousedown", i.UP = "mouseup", i.CLICK = "click", i.MOVE = "mousemove", i.ENTER = "mouseenter", i.LEAVE = "mouseleave", i.OVER = "mouseover", i.OUT = "mouseout", i.WHEEL = "mousewheel", i.SCROLL = "scroll"
}, function (e, t) {
    "use strict";

    function i(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    Object.defineProperty(t, "__esModule", {value: !0});
    var o = function e() {
        i(this, e)
    };
    t.default = o, o.CHANGE = "routerchange"
}, function (e, t, i) {
    var o;
    /** @license
     * JS Signals <http://millermedeiros.github.com/js-signals/>
     * Released under the MIT license
     * Author: Miller Medeiros
     * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
     */
    !function (n) {
        function r(e, t, i, o, n) {
            this._listener = t, this._isOnce = i, this.context = o, this._signal = e, this._priority = n || 0
        }

        function s(e, t) {
            if ("function" != typeof e) throw new Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}", t))
        }

        function a() {
            this._bindings = [], this._prevParams = null;
            var e = this;
            this.dispatch = function () {
                a.prototype.dispatch.apply(e, arguments)
            }
        }

        r.prototype = {
            active: !0, params: null, execute: function (e) {
                var t, i;
                return this.active && this._listener && (i = this.params ? this.params.concat(e) : e, t = this._listener.apply(this.context, i), this._isOnce && this.detach()), t
            }, detach: function () {
                return this.isBound() ? this._signal.remove(this._listener, this.context) : null
            }, isBound: function () {
                return !!this._signal && !!this._listener
            }, isOnce: function () {
                return this._isOnce
            }, getListener: function () {
                return this._listener
            }, getSignal: function () {
                return this._signal
            }, _destroy: function () {
                delete this._signal, delete this._listener, delete this.context
            }, toString: function () {
                return "[SignalBinding isOnce:" + this._isOnce + ", isBound:" + this.isBound() + ", active:" + this.active + "]"
            }
        }, a.prototype = {
            VERSION: "1.0.0",
            memorize: !1,
            _shouldPropagate: !0,
            active: !0,
            _registerListener: function (e, t, i, o) {
                var n, s = this._indexOfListener(e, i);
                if (-1 !== s) {
                    if (n = this._bindings[s], n.isOnce() !== t) throw new Error("You cannot add" + (t ? "" : "Once") + "() then add" + (t ? "Once" : "") + "() the same listener without removing the relationship first.")
                } else n = new r(this, e, t, i, o), this._addBinding(n);
                return this.memorize && this._prevParams && n.execute(this._prevParams), n
            },
            _addBinding: function (e) {
                var t = this._bindings.length;
                do {
                    --t
                } while (this._bindings[t] && e._priority <= this._bindings[t]._priority);
                this._bindings.splice(t + 1, 0, e)
            },
            _indexOfListener: function (e, t) {
                for (var i, o = this._bindings.length; o--;) if (i = this._bindings[o], i._listener === e && i.context === t) return o;
                return -1
            },
            has: function (e, t) {
                return -1 !== this._indexOfListener(e, t)
            },
            add: function (e, t, i) {
                return s(e, "add"), this._registerListener(e, !1, t, i)
            },
            addOnce: function (e, t, i) {
                return s(e, "addOnce"), this._registerListener(e, !0, t, i)
            },
            remove: function (e, t) {
                s(e, "remove");
                var i = this._indexOfListener(e, t);
                return -1 !== i && (this._bindings[i]._destroy(), this._bindings.splice(i, 1)), e
            },
            removeAll: function () {
                for (var e = this._bindings.length; e--;) this._bindings[e]._destroy();
                this._bindings.length = 0
            },
            getNumListeners: function () {
                return this._bindings.length
            },
            halt: function () {
                this._shouldPropagate = !1
            },
            dispatch: function (e) {
                if (this.active) {
                    var t, i = Array.prototype.slice.call(arguments), o = this._bindings.length;
                    if (this.memorize && (this._prevParams = i), o) {
                        t = this._bindings.slice(), this._shouldPropagate = !0;
                        do {
                            o--
                        } while (t[o] && this._shouldPropagate && !1 !== t[o].execute(i))
                    }
                }
            },
            forget: function () {
                this._prevParams = null
            },
            dispose: function () {
                this.removeAll(), delete this._bindings, delete this._prevParams
            },
            toString: function () {
                return "[Signal active:" + this.active + " numListeners:" + this.getNumListeners() + "]"
            }
        };
        var l = a;
        l.Signal = a, void 0 !== (o = function () {
            return l
        }.call(t, i, t, e)) && (e.exports = o)
    }()
}, function (e, t, i) {
    "use strict";

    function o(e, t, i, o, r) {
        var s = n.apply(this, arguments);
        return e.addEventListener(i, s, r), {
            destroy: function () {
                e.removeEventListener(i, s, r)
            }
        }
    }

    function n(e, t, i, o) {
        return function (i) {
            i.delegateTarget = (0, s.default)(i.target, t), i.delegateTarget && o.call(e, i)
        }
    }

    var r = i(9), s = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(r);
    e.exports = o
}, function (e, t) {
    "use strict";

    function i(e, t) {
        for (; e && e.nodeType !== o;) {
            if (e.matches(t)) return e;
            e = e.parentNode
        }
    }

    var o = 9;
    if ("undefined" != typeof Element && !Element.prototype.matches) {
        var n = Element.prototype;
        n.matches = n.matchesSelector || n.mozMatchesSelector || n.msMatchesSelector || n.oMatchesSelector || n.webkitMatchesSelector
    }
    e.exports = i
}, function (e, t) {
    "use strict";

    function i() {
        return 1 === arguments.length ? o.apply(void 0, arguments) : n.apply(void 0, arguments)
    }

    function o(e) {
        var t = void 0;
        return "undefined" != typeof Reflect && "function" == typeof Reflect.ownKeys ? t = Reflect.ownKeys(e.prototype) : (t = Object.getOwnPropertyNames(e.prototype), "function" == typeof Object.getOwnPropertySymbols && (t = t.concat(Object.getOwnPropertySymbols(e.prototype)))), t.forEach(function (t) {
            if ("constructor" !== t) {
                var i = Object.getOwnPropertyDescriptor(e.prototype, t);
                "function" == typeof i.value && Object.defineProperty(e.prototype, t, n(e, t, i))
            }
        }), e
    }

    function n(e, t, i) {
        var o = i.value;
        if ("function" != typeof o) throw new Error("@autobind decorator can only be applied to methods not: " + (void 0 === o ? "undefined" : r(o)));
        var n = !1;
        return {
            configurable: !0, get: function () {
                if (n || this === e.prototype || this.hasOwnProperty(t) || "function" != typeof o) return o;
                var i = o.bind(this);
                return n = !0, Object.defineProperty(this, t, {
                    configurable: !0, get: function () {
                        return i
                    }, set: function (e) {
                        o = e, delete this[t]
                    }
                }), n = !1, i
            }, set: function (e) {
                o = e
            }
        }
    }

    Object.defineProperty(t, "__esModule", {value: !0});
    var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    };
    t.default = i
}, function (e, t) {
    "use strict";

    function i(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    Object.defineProperty(t, "__esModule", {value: !0});
    var o = function e() {
        i(this, e)
    };
    t.default = o, o.SHOW = "pageshow", o.SHOWN = "pageshown", o.HIDE = "pagehide", o.HIDDEN = "pagehidden"
}, function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    t.sitemap = {
        pages: {
            default: {class: i(13)},
            photography: {class: i(30)},
            films: {class: i(31)},
            single: {class: i(32)},
            "about-me": {class: i(33)}
        }
    }
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function s(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var a = function () {
            function e(e, t) {
                for (var i = 0; i < t.length; i++) {
                    var o = t[i];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }

            return function (t, i, o) {
                return i && e(t.prototype, i), o && e(t, o), t
            }
        }(), l = function e(t, i, o) {
            null === t && (t = Function.prototype);
            var n = Object.getOwnPropertyDescriptor(t, i);
            if (void 0 === n) {
                var r = Object.getPrototypeOf(t);
                return null === r ? void 0 : e(r, i, o)
            }
            if ("value" in n) return n.value;
            var s = n.get;
            if (void 0 !== s) return s.call(o)
        }, u = i(14), c = o(u), h = i(16), d = (o(h), i(4)), p = (o(d), i(26)), f = o(p), y = i(27), v = o(y), _ = i(28),
        g = o(_), m = i(29), w = o(m), b = function (e) {
            function t(e, i) {
                n(this, t);
                var o = r(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments));
                o._previousPage = i, t.header || (t.header = new f.default), t.footer || (t.footer = new v.default), o.bg = document.body;
                var s = o.dom.querySelector(".page-body"), a = window.getComputedStyle(s), l = a.backgroundColor;
                return s.style.background = "none", s.style.visibility = "visible", o._bgColor = l, t.canvasFx || (t.canvasFx = new g.default, t.transitions = new w.default(t.canvasFx)), window.main._isIntro && t.transitions.intro(o), o
            }

            return s(t, e), a(t, [{
                key: "setBackgroundColor", value: function (e) {
                    var i = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                    window.main._bgColor != e && (i ? TweenLite.to(this.bg, 2, {
                        backgroundColor: e,
                        ease: Power2.easeOut
                    }) : TweenLite.set(this.bg, {backgroundColor: e}), window.main._bgColor = e, t.header.setColor(e))
                }
            }, {
                key: "init", value: function () {
                    l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "init", this).call(this)
                }
            }, {
                key: "resize", value: function () {
                    l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "resize", this).call(this), t.canvasFx && (t.canvasFx.resize(), t.transitions.resize())
                }
            }, {
                key: "update", value: function () {
                    l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "update", this).call(this), t.canvasFx && t.canvasFx.update()
                }
            }, {
                key: "_show", value: function () {
                    this.header.setActivePage(this.dom), this.scrollable.y = 0, this._shown()
                }
            }, {
                key: "_hide", value: function () {
                    var e = -this.scrollable.y;
                    this.dom.classList.add("hiding"), this.scrollable.dom.style.transform = "translate3d(0," + e + "px,0)"
                }
            }, {
                key: "header", get: function () {
                    if (t.header) return t.header
                }
            }, {
                key: "footer", get: function () {
                    if (t.footer) return t.footer
                }
            }, {
                key: "transitions", get: function () {
                    if (t.transitions) return t.transitions
                }
            }]), t
        }(c.default);
    t.default = b
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function s(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var a = function () {
            function e(e, t) {
                for (var i = 0; i < t.length; i++) {
                    var o = t[i];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }

            return function (t, i, o) {
                return i && e(t.prototype, i), o && e(t, o), t
            }
        }(), l = function e(t, i, o) {
            null === t && (t = Function.prototype);
            var n = Object.getOwnPropertyDescriptor(t, i);
            if (void 0 === n) {
                var r = Object.getPrototypeOf(t);
                return null === r ? void 0 : e(r, i, o)
            }
            if ("value" in n) return n.value;
            var s = n.get;
            if (void 0 !== s) return s.call(o)
        }, u = i(15), c = o(u), h = i(16), d = o(h), p = i(18), f = (o(p), i(21)), y = o(f), v = i(22), _ = o(v),
        g = function (e) {
            function t(e, i) {
                return n(this, t), r(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            }

            return s(t, e), a(t, [{
                key: "init", value: function () {
                    l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "init", this).call(this), this._initScrolling()
                }
            }, {
                key: "_initScrolling", value: function () {
                    var e = this.dom.querySelector(".scrollable");
                    e && "touchOnly" !== _.default.deviceType ? this.scrollable = new y.default(e) : this.scrollable = new d.default(e)
                }
            }, {
                key: "resize", value: function () {
                    l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "resize", this).call(this), this.scrollable && this.scrollable.resize && (this.scrollable.resize(), this.height = this.scrollable.height)
                }
            }, {
                key: "update", value: function () {
                    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "update", this).call(this), this.scrollable && this.scrollable.update && this.scrollable.update()
                }
            }, {
                key: "destroy", value: function () {
                    l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this), this.scrollable && this.scrollable.destroy()
                }
            }, {
                key: "hide", value: function (e) {
                    l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "hide", this).call(this, e), this.scrollable && (this.scrollable.isLocked = !0)
                }
            }]), t
        }(c.default);
    t.default = g
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var r = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), s = i(11), a = (o(s), i(7)), l = o(a), u = function () {
        function e(t, i) {
            n(this, e), this.dom = t, this.id = t.getAttribute("id"), this.uid = this.id + "-" + (1e5 * Math.random() | 0);
            var o = t.querySelector(".post-type-portfolio");
            this.pageId = o ? o.getAttribute("id") : this.id, this.startHide = new l.default, this.hidden = new l.default, this.startShow = new l.default, this.shown = new l.default, i && !i.isHidden && (this._previousPage = i, this._previousPage.hidden.add(this._onPreviousPageHidden.bind(this)))
        }

        return r(e, [{
            key: "init", value: function () {
            }
        }, {
            key: "resize", value: function () {
            }
        }, {
            key: "update", value: function () {
            }
        }, {
            key: "destroy", value: function () {
                this.startShow.dispose(), this.shown.dispose(), this.startHide.dispose(), this.hidden.dispose(), this.dom.parentNode.removeChild(this.dom), this.isDestroyed = !0
            }
        }, {
            key: "_onPreviousPageHidden", value: function (e) {
                this._previousPage = null
            }
        }, {
            key: "show", value: function () {
                this.resize(), this.isHidden = !1, this.startShow.dispatch(), this._show()
            }
        }, {
            key: "_show", value: function () {
            }
        }, {
            key: "_shown", value: function () {
                this.isShown = !0, this.shown.dispatch(this)
            }
        }, {
            key: "hide", value: function (e) {
                this.isShown = !1, this.startHide.dispatch(), this.transitions.start(this, e), this._hide()
            }
        }, {
            key: "_hide", value: function () {
            }
        }, {
            key: "_hidden", value: function () {
                this.isHidden = !0, this.hidden.dispatch(this)
            }
        }]), e
    }();
    t.default = u
}, function (e, t, i) {
    "use strict";

    function o(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function n(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function r(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var s = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), a = function e(t, i, o) {
        null === t && (t = Function.prototype);
        var n = Object.getOwnPropertyDescriptor(t, i);
        if (void 0 === n) {
            var r = Object.getPrototypeOf(t);
            return null === r ? void 0 : e(r, i, o)
        }
        if ("value" in n) return n.value;
        var s = n.get;
        if (void 0 !== s) return s.call(o)
    }, l = i(17), u = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(l), c = function (e) {
        function t(e) {
            o(this, t);
            var i = n(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)),
                r = document.documentElement;
            document.body;
            return r.style.overflowY = "auto", i
        }

        return r(t, e), s(t, [{
            key: "destroy", value: function () {
                a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
            }
        }, {
            key: "y", set: function (e) {
                window.scrollTo(0, e)
            }, get: function () {
                return window.scrollY
            }
        }]), t
    }(u.default);
    t.default = c
}, function (e, t, i) {
    "use strict";

    function o(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var n = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), r = i(7), s = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(r), a = function () {
        function e(t) {
            o(this, e), this.dom = t, this.scrolled = new s.default
        }

        return n(e, [{
            key: "destroy", value: function () {
            }
        }, {
            key: "enabled", set: function (e) {
                this.isLocked = !e
            }, get: function () {
                return !this.isLocked
            }
        }]), e
    }();
    t.default = a
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function s(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    function a(e, t, i, o, n) {
        var r = {};
        return Object.keys(o).forEach(function (e) {
            r[e] = o[e]
        }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
            return o(e, t, i) || i
        }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var l, u = function () {
            function e(e, t) {
                for (var i = 0; i < t.length; i++) {
                    var o = t[i];
                    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
                }
            }

            return function (t, i, o) {
                return i && e(t.prototype, i), o && e(t, o), t
            }
        }(), c = i(4), h = o(c), d = i(19), p = o(d), f = i(20), y = o(f), v = i(17), _ = o(v), g = i(10), m = o(g),
        w = (l = function (e) {
            function t(e) {
                var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                    o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                n(this, t);
                var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments));
                return s.thumb = i, s.prevent = o, s.vy = 0, s.percent = 0, s.x = 0, s.y = s._y = 0, s._easing = .5, s._friction = .2, s._frictionTouchRelease = .95, s.isLocked = !1, s._firstScroll = !0, s._mode = "mouse", s._scrollify(), s
            }

            return s(t, e), u(t, [{
                key: "resize", value: function (e) {
                    this.height = this.dom.clientHeight, this.boundingHeight = e || h.default.height, this._dummy && h.default.mobile ? this._dummy.style.display = "none" : this._dummy && (this._dummy.style.display = null), this._applyConstrains(), this.update(!0)
                }
            }, {
                key: "update", value: function () {
                    var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                        t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
                    if (!this.isLocked) if (void 0 !== this._y) {
                        if (this.deltaY = this._y - this.y, e) this.vy = 0, this.y = this._y; else if ("mouse" === this._mode) this.vy += this.deltaY * this._easing, this.y += this.vy *= this._friction; else if ("touch" === this._mode) {
                            this.dragging ? (this.y += this.deltaY, this.vy = this.y - this._oy) : (this.y += this.vy, this._y = this.y, this.vy *= this._frictionTouchRelease);
                            this.y < 0 ? (this.vy = 0, this.y += (0 - this.y) * (this.dragging ? .5 : .125)) : this.y > this.height - this.boundingHeight && (this.vy = 0, this.y += (this.height - this.boundingHeight - this.y) * (this.dragging ? .5 : .125)), this.thumb && this._updateThumbPosition()
                        }
                    } else this.y = this._y;
                    this.y = (1e3 * this.y | 0) / 1e3, this.preventDomUpdate || this._ox === this.x && this._oy === this.y && !e || this._updateDom(t), this.percent = this.y / (this.height - this.boundingHeight), this._ox = this.x, this._oy = this.y
                }
            }, {
                key: "destroy", value: function () {
                    this._dummy && this._dummy.parentNode.removeChild(this._dummy), window.removeEventListener("scroll", this._onScroll), this.dom.removeEventListener("mousedown", this._onMouseDown), this.dom.removeEventListener("touchstart", this._onTouchStart), this.dom.removeEventListener("touchmove", this._onTouchMove), this.dom.removeEventListener("touchend", this._onTouchEnd), this.dom.removeEventListener(this._wheelEvent, this._onMouseScroll)
                }
            }, {
                key: "reset", value: function () {
                    this.y = this._y = this._oy = this.percent = 0
                }
            }, {
                key: "_updateDom", value: function (e) {
                    var t = "translate3d(" + this.x + "px," + -this.y + "px,0)";
                    e && (t += " " + e), p.default.transform(this.dom, t)
                }
            }, {
                key: "_scrollify", value: function () {
                    this.dom.style.position = "fixed", this.dom.style.willChange = "transform", this.thumb ? this.thumb.scrolled.add(this._onScroll) : (this._dummy = document.createElement("div"), this._dummy.style.position = "absolute", this._dummy.style.top = 0, this._dummy.style.left = 0, this._dummy.style.width = "1px", this._dummy.style.visibility = "hidden", this.dom.parentNode.appendChild(this._dummy), window.addEventListener("scroll", this._onScroll, e)), this._wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : "DOMMouseScroll";
                    var e = !!y.default.hasSupport && {passive: !0};
                    this.dom.addEventListener("mousedown", this._onMouseDown, e), this.dom.addEventListener("touchstart", this._onTouchStart, e), this.dom.addEventListener("touchmove", this._onTouchMove, !this.prevent && e), this.dom.addEventListener("touchend", this._onTouchEnd, e), this.dom.addEventListener(this._wheelEvent, this._onMouseScroll, e)
                }
            }, {
                key: "_applyConstrains", value: function () {
                    var e = this.height - this.boundingHeight;
                    this._y < 0 || this.height <= h.default.height ? this._y = 0 : this._y > e && (this._y = e)
                }
            }, {
                key: "_updateThumbPosition", value: function () {
                    this.height > this.boundingHeight && (this.thumb.percent = this._y / (this.height - this.boundingHeight))
                }
            }, {
                key: "_onMouseDown", value: function (e) {
                    this._mode = "mouse"
                }
            }, {
                key: "_onMouseScroll", value: function (e) {
                    this._mode = "mouse", e.stopPropagation(), this.thumb && (this._y += e ? 1 === e.deltaMode ? 20 * e.deltaY : e.deltaY : 0, this._applyConstrains(), this._updateThumbPosition())
                }
            }, {
                key: "_onTouchStart", value: function (e) {
                    this._mode = "touch", e.stopPropagation(), this.dragging = !0;
                    var t = e.touches[0] || e.changedTouches[0];
                    this._touchy = t.pageY
                }
            }, {
                key: "_onTouchMove", value: function (e) {
                    if (!this.isLocked) {
                        e.stopPropagation(), this.prevent && e.preventDefault();
                        var t = e.touches[0] || e.changedTouches[0], i = this._touchy || 0;
                        this._touchy = t.pageY, this._y += i - this._touchy
                    }
                }
            }, {
                key: "_onTouchEnd", value: function (e) {
                    this.dragging = !1
                }
            }, {
                key: "_onScroll", value: function (e) {
                    if (!this.isLocked) {
                        this._y = this.thumb ? this.thumb.percent * (this.height - this.boundingHeight) : window.scrollY || window.pageYOffset;
                        var t = this._firstScroll;
                        this._firstScroll ? (this.y = this._oy = this._y, this._firstScroll = !1, this.update(!0), this.firstScrolled.dispatch()) : this._y || (this._firstScroll = !1), this.scrolled.dispatch(t)
                    }
                }
            }, {
                key: "enabled", set: function (e) {
                    e ? (this.dom.style.willChange = "transform", this._dummy && (this._dummy.style.display = null), this.thumb || window.scrollTo(0, this.y)) : (this._dummy && (this._dummy.style.display = "none"), this.dom.style.willChange = null), this.isLocked = !e
                }, get: function () {
                    return !this.isLocked
                }
            }, {
                key: "height", set: function (e) {
                    this._height = e, this._dummy && (this._dummy.style.height = this._height + "px")
                }, get: function () {
                    return this._height
                }
            }]), t
        }(_.default), a(l.prototype, "_onMouseDown", [m.default], Object.getOwnPropertyDescriptor(l.prototype, "_onMouseDown"), l.prototype), a(l.prototype, "_onMouseScroll", [m.default], Object.getOwnPropertyDescriptor(l.prototype, "_onMouseScroll"), l.prototype), a(l.prototype, "_onTouchStart", [m.default], Object.getOwnPropertyDescriptor(l.prototype, "_onTouchStart"), l.prototype), a(l.prototype, "_onTouchMove", [m.default], Object.getOwnPropertyDescriptor(l.prototype, "_onTouchMove"), l.prototype), a(l.prototype, "_onTouchEnd", [m.default], Object.getOwnPropertyDescriptor(l.prototype, "_onTouchEnd"), l.prototype), a(l.prototype, "_onScroll", [m.default], Object.getOwnPropertyDescriptor(l.prototype, "_onScroll"), l.prototype), l);
    t.default = w
}, function (e, t) {
    "use strict";
    var i = e.exports = function () {
    };
    i.vendors = {Webkit: "webkit", Moz: "moz", O: "o"}, i.prefix = "", i.init = function () {
        i.setPrefix()
    }, i.setPrefix = function () {
        var e = document.createElement("div");
        if (void 0 !== e.style.transitionProperty) i.prefix = ""; else for (var t in i.vendors) if (void 0 !== e.style[t + "TransitionProperty"]) return i.prefix = "-" + t.toLowerCase() + "-", !1;
        e = null
    }, i.transform = function (e, t) {
        e && (e.style.transform || (e.style.transform = e.style.webkitTransform || e.style.mozTransform), e.style.transform = t)
    }, i.transformOrigin = function (e, t) {
        e && (e.style.transformOrigin || (e.style.transformOrigin = e.style.webkitTransformOrigin || e.style.mozTransformOrigin), e.style.transformOrigin = t)
    }, i.transition = function (e, t) {
        e && (e.style.transition || (e.style.transition = e.style.webkitTransition || e.style.mozTransition), e.style.transition = t)
    }, i.getMatrix = function (e) {
        var t = window.getComputedStyle(e, null),
            i = t.getPropertyValue("transform") || t.getPropertyValue("-webkit-transform") || t.getPropertyValue("-moz-transform") || t.getPropertyValue("-ms-transform") || t.getPropertyValue("-o-transform"),
            o = /^\w*\((((\d+)|(\d*\.\d+)),\s*)*((\d+)|(\d*\.\d+))\)/i, n = [];
        if (o.test(i)) {
            n = i.replace(/^\w*\(/, "").replace(")", "").split(/\s*,\s*/)
        }
        return n
    }
}, function (e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = {
        update: function () {
            if ("undefined" != typeof window && "function" == typeof window.addEventListener) {
                var e = !1, t = Object.defineProperty({}, "passive", {
                    get: function () {
                        e = !0
                    }
                }), o = function () {
                };
                window.addEventListener("testPassiveEventSupport", o, t), window.removeEventListener("testPassiveEventSupport", o, t), i.hasSupport = e
            }
        }
    };
    i.update(), t.default = i
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function s(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    function a(e, t, i, o, n) {
        var r = {};
        return Object.keys(o).forEach(function (e) {
            r[e] = o[e]
        }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
            return o(e, t, i) || i
        }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var l, u = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), c = function e(t, i, o) {
        null === t && (t = Function.prototype);
        var n = Object.getOwnPropertyDescriptor(t, i);
        if (void 0 === n) {
            var r = Object.getPrototypeOf(t);
            return null === r ? void 0 : e(r, i, o)
        }
        if ("value" in n) return n.value;
        var s = n.get;
        if (void 0 !== s) return s.call(o)
    }, h = i(17), d = o(h), p = i(4), f = o(p), y = i(10), v = o(y), _ = (l = function (e) {
        function t(e) {
            n(this, t);
            var i = r(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments));
            return i.y = window.scrollY, i.isMobile || (i.bindImagesLoad(), i.checkPageHeight(), setTimeout(i.checkPageHeight, 60)), i
        }

        return s(t, e), u(t, [{
            key: "resize", value: function () {
                this.pageHeight = this.dom.clientHeight, document.body.style.height = this.pageHeight + "px"
            }
        }, {
            key: "destroy", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
            }
        }, {
            key: "bindImagesLoad", value: function () {
                for (var e = this, t = this.dom.querySelectorAll("img"), i = 0, o = t.length; i < o; i++) t[i].addEventListener("load", function (t) {
                    e.dom.clientHeight !== e.pageHeight && (e.pageHeight = e.dom.clientHeight, document.body.style.height = e.pageHeight + "px")
                })
            }
        }, {
            key: "checkPageHeight", value: function () {
                var e = document.documentElement, t = document.body, i = this.dom.clientHeight;
                i <= f.default.height ? e.style.overflowY = "hidden" : (e.style.overflowY = "auto", this.dom.style.position = "fixed", this.dom.style.willChange = "transform", this.pageHeight ? this.pageHeight != i && (this.pageHeight = i, t.style.height = this.pageHeight + "px") : (this.pageHeight = i, t.style.height = this.pageHeight + "px"))
            }
        }, {
            key: "update", value: function () {
                this.isLocked || Math.round(this.y) != window.pageYOffset && TweenLite.to(this, .79, {
                    _y: window.pageYOffset,
                    ease: Power3.easeOut,
                    onUpdate: this.updateScroll
                })
            }
        }, {
            key: "updateScroll", value: function () {
                this.y = this._y, TweenLite.set(this.dom, {y: -this._y})
            }
        }]), t
    }(d.default), a(l.prototype, "checkPageHeight", [v.default], Object.getOwnPropertyDescriptor(l.prototype, "checkPageHeight"), l.prototype), a(l.prototype, "updateScroll", [v.default], Object.getOwnPropertyDescriptor(l.prototype, "updateScroll"), l.prototype), l);
    t.default = _
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t, i, o) {
        return e && (t || i) ? "hybrid" : e && Object.keys(o.detectHover).filter(function (e) {
            return "update" !== e
        }).every(function (e) {
            return !1 === o.detectHover[e]
        }) && Object.keys(o.detectPointer).filter(function (e) {
            return "update" !== e
        }).every(function (e) {
            return !1 === o.detectPointer[e]
        }) ? window.navigator && /android/.test(window.navigator.userAgent.toLowerCase()) ? "touchOnly" : "hybrid" : e ? "touchOnly" : "mouseOnly"
    }

    Object.defineProperty(t, "__esModule", {value: !0});
    var r = i(23), s = o(r), a = i(24), l = o(a), u = i(25), c = o(u), h = i(20), d = o(h), p = {
        state: {
            detectHover: s.default,
            detectPointer: l.default,
            detectTouchEvents: c.default,
            detectPassiveEvents: d.default
        }, update: function () {
            p.state.detectHover.update(), p.state.detectPointer.update(), p.state.detectTouchEvents.update(), p.state.detectPassiveEvents.update(), p.updateOnlyOwnProperties()
        }, updateOnlyOwnProperties: function () {
            if ("undefined" != typeof window) {
                p.passiveEvents = p.state.detectPassiveEvents.hasSupport || !1, p.hasTouch = p.state.detectTouchEvents.hasSupport || !1, p.deviceType = n(p.hasTouch, p.state.detectHover.anyHover, p.state.detectPointer.anyFine, p.state), p.hasMouse = "touchOnly" !== p.deviceType, p.primaryInput = "mouseOnly" === p.deviceType && "mouse" || "touchOnly" === p.deviceType && "touch" || p.state.detectHover.hover && "mouse" || p.state.detectHover.none && "touch" || "mouse";
                /windows/.test(window.navigator.userAgent.toLowerCase()) && /chrome/.test(window.navigator.userAgent.toLowerCase()) && function (e) {
                    return e >= 59 && e < 62
                }(parseInt(/Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1], 10)) && p.hasTouch && (p.deviceType = "hybrid", p.hasMouse = !0, p.primaryInput = "mouse")
            }
        }
    };
    p.updateOnlyOwnProperties(), t.default = p
}, function (e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = {
        update: function () {
            "undefined" != typeof window && "function" == typeof window.matchMedia && (i.hover = window.matchMedia("(hover: hover)").matches, i.none = window.matchMedia("(hover: none)").matches || window.matchMedia("(hover: on-demand)").matches, i.anyHover = window.matchMedia("(any-hover: hover)").matches, i.anyNone = window.matchMedia("(any-hover: none)").matches || window.matchMedia("(any-hover: on-demand)").matches)
        }
    };
    i.update(), t.default = i
}, function (e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = {
        update: function () {
            "undefined" != typeof window && "function" == typeof window.matchMedia && (i.fine = window.matchMedia("(pointer: fine)").matches, i.coarse = window.matchMedia("(pointer: coarse)").matches, i.none = window.matchMedia("(pointer: none)").matches, i.anyFine = window.matchMedia("(any-pointer: fine)").matches, i.anyCoarse = window.matchMedia("(any-pointer: coarse)").matches, i.anyNone = window.matchMedia("(any-pointer: none)").matches)
        }
    };
    i.update(), t.default = i
}, function (e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = {
        update: function () {
            "undefined" != typeof window && (i.hasSupport = "ontouchstart" in window, i.browserSupportsApi = Boolean(window.TouchEvent))
        }
    };
    i.update(), t.default = i
}, function (e, t, i) {
    "use strict";

    function o(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function n(e, t, i, o, n) {
        var r = {};
        return Object.keys(o).forEach(function (e) {
            r[e] = o[e]
        }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
            return o(e, t, i) || i
        }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var r, s = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), a = i(10), l = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(a), u = (r = function () {
        function e() {
            o(this, e), this.activeMenu = void 0, this.menu = document.body.querySelector(".menu"), this.logoBtn = this.menu.querySelector(".menu__logo"), this.logo = this.menu.querySelector(".menu__item--home"), this.socials = this.menu.querySelector(".menu__socials"), this.logoBtn.addEventListener("mouseenter", this.onRollOverLogo), this.logoBtn.addEventListener("mouseleave", this.onRollOutLogo)
        }

        return s(e, [{
            key: "onRollOverLogo", value: function (e) {
                TweenLite.to(this.logo, .1, {
                    autoAlpha: .05,
                    ease: Power4.easeOut
                }), TweenLite.to(this.socials, 1, {autoAlpha: 1, ease: Power4.easeOut})
            }
        }, {
            key: "onRollOutLogo", value: function (e) {
                TweenLite.to(this.logo, 1, {
                    autoAlpha: 1,
                    ease: Power4.easeOut
                }), TweenLite.to(this.socials, .1, {autoAlpha: 0, ease: Power4.easeOut})
            }
        }, {
            key: "setColor", value: function (e) {
                switch (e) {
                    case"rgb(0, 0, 0)":
                        this.menu.classList.add("whiteNav");
                        break;
                    default:
                        this.menu.classList.remove("whiteNav")
                }
            }
        }, {
            key: "setActivePage", value: function (e) {
                switch (this.dom = e, this.activeMenu && this.activeMenu.classList.remove("active"), this.dom.id) {
                    case"photography":
                        this.activeMenu = this.menu.querySelector(".menu__item--photos");
                        break;
                    case"films":
                        this.activeMenu = this.menu.querySelector(".menu__item--films");
                        break;
                    case"about-me":
                        this.activeMenu = this.menu.querySelector(".menu__item--about");
                        break;
                    default:
                        this.activeMenu = void 0
                }
                this.activeMenu && this.activeMenu.classList.add("active")
            }
        }]), e
    }(), n(r.prototype, "onRollOverLogo", [l.default], Object.getOwnPropertyDescriptor(r.prototype, "onRollOverLogo"), r.prototype), n(r.prototype, "onRollOutLogo", [l.default], Object.getOwnPropertyDescriptor(r.prototype, "onRollOutLogo"), r.prototype), n(r.prototype, "setColor", [l.default], Object.getOwnPropertyDescriptor(r.prototype, "setColor"), r.prototype), r);
    t.default = u
}, function (e, t) {
    "use strict";

    function i(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    Object.defineProperty(t, "__esModule", {value: !0});
    var o = function e(t) {
        i(this, e), this.dom = t
    };
    t.default = o
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t, i, o, n) {
        var r = {};
        return Object.keys(o).forEach(function (e) {
            r[e] = o[e]
        }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
            return o(e, t, i) || i
        }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var s, a = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), l = i(4), u = o(l), c = i(10), h = o(c), d = (s = function () {
        function e() {
            n(this, e), window._canvasFx = this, this.holder = document.body.querySelector(".canvasFx"), this.canvas = document.createElement("canvas"), this.holder.appendChild(this.canvas), PIXI.utils.skipHello(), PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR, this.renderer = PIXI.autoDetectRenderer(u.default.width, u.default.height, {
                view: this.canvas,
                transparent: !0,
                antialias: !0,
                roundPixels: !0,
                resolution: u.default.isRetina ? 2 : 1,
                forceFXAA: !1
            }), this.renderTexture = PIXI.RenderTexture.create(u.default.width, u.default.height), this.renderTexture2 = PIXI.RenderTexture.create(u.default.width, u.default.height), this.currentTexture = this.renderTexture, this.feedback = new PIXI.Sprite(this.currentTexture), this.feedback.x = u.default.centerX, this.feedback.y = u.default.centerY, this.feedback.anchor.set(.5), this.stage = new PIXI.Container, this.scene = new PIXI.Container, this.noFeedback = new PIXI.Container, this.darkTitles = new PIXI.Sprite, this.lightTitles = new PIXI.Sprite, this.visuelHeight = .59 * u.default.height, this.visuelWidth = 21 * this.visuelHeight / 29.7, this.visuelContainer = new PIXI.Container, this.visuelBackground = new PIXI.Sprite;
            var t = new PIXI.Graphics;
            t.beginFill("0x000000", 1), t.drawRect(0, 0, 10, 10), t.endFill(), this.visuelBackground.addChild(t), this.visuelContainer.addChild(this.visuelBackground), this.visuelContainer.alpha = 0, this.visuel = new PIXI.Container, this.visuelContainer.addChild(this.visuel), this.titleMask = new PIXI.Graphics, this.titleMask.beginFill("0xff00cc", 1), this.titleMask.drawRect(0, 0, this.visuelWidth, this.visuelHeight), this.titleMask.endFill(), this.titleMask.addChild(this.titleMask), this.visuelContainer.addChild(this.titleMask), this.lightTitles.mask = this.titleMask, this.scene.addChild(this.darkTitles), this.scene.addChild(this.visuelContainer), this.noFeedback.addChild(this.lightTitles), this.scene.addChild(this.feedback), this.stage.addChild(this.scene), this.stage.addChild(this.noFeedback), this.distoScale = 1, this.scaleComp = 1 / this.distoScale, this.visuelContainer.scale.x = this.distoScale, this.visuelContainer.scale.y = this.distoScale, this.visuel.scale.x = this.scaleComp, this.visuel.scale.y = this.scaleComp, u.default.isTouch || (this.displacementTexture = PIXI.Texture.fromImage(templateUrl + "/library/media/test/nm-04.jpg"), this.displacementTexture.baseTexture.wrapMode = 2, this.displacementSprite = new PIXI.Sprite(this.displacementTexture), this.displacementSprite.width = u.default.width, this.displacementSprite.height = u.default.height, this.stage.addChild(this.displacementSprite), this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite), this.visuelContainer.filters = [this.displacementFilter]), this.hideHome(), this.init()
        }

        return a(e, [{
            key: "init", value: function () {
                this.frame = 1, this.scrollY = 0, this.yScrollNull = 0, this.fontSize = .09 * u.default.width, this.easedMouseX = 0, this.easedMouseY = 0, this.easedMouseX2 = 0, this.easedMouseY2 = 0, this._lastMouseX = 0, this._lastMouseY = 0, this._xDistoNull = 0, this._yDistoNull = 0, this.initDistoX = 50, this.initDistoY = -50, this.distoMouseAmp = 1, this.imageLoop = [], this._currentImageSprite = void 0, this.swapLayers = !1, this._swapedLayer = "top", this.timeScale = 1, this.xDelta = 0, this.yDelta = 0, this.scaleDelta = .001, this.rotDelta = 0, this.fadeDelta = .05
            }
        }, {
            key: "setHome", value: function (e, t) {
                if (this._projects = e, t) this.setProjects(); else {
                    var i = this;
                    window.onload = function () {
                        WebFont.load({
                            active: function () {
                                i.setProjects()
                            }, custom: {families: ["Canela"]}
                        })
                    }
                }
            }
        }, {
            key: "showHome", value: function () {
                this.scene.alpha = 1, this.noFeedback.alpha = 1
            }
        }, {
            key: "hideHome", value: function () {
                this.scene.alpha = 0, this.noFeedback.alpha = 0
            }
        }, {
            key: "update", value: function () {
                if (!u.default.isTouch) {
                    if (this.scrollable && Math.round(this.scrollable.y) != Math.round(this.scrollY) && this.scroll(this.scrollable.y), TweenLite.to(this, .4, {
                        easedMouseX: u.default.mouseX,
                        ease: Power1.easeOut
                    }), TweenLite.to(this, .4, {
                        easedMouseY: u.default.mouseY,
                        ease: Power1.easeOut
                    }), TweenLite.to(this, 1, {
                        easedMouseX2: this.easedMouseX,
                        ease: Power4.easeOut
                    }), TweenLite.to(this, 1, {
                        easedMouseY2: this.easedMouseY,
                        ease: Power4.easeOut
                    }), this.displacementFilter.scale.x = 1 + (u.default.mouseX - this.easedMouseX) * this.distoMouseAmp + this._xDistoNull, this.displacementFilter.scale.y = 1 + (u.default.mouseY - this.easedMouseY) * this.distoMouseAmp + this._yDistoNull, this._currentProject) {
                        var e = u.default.mouseX - (this._currentProject.darkTitle.x - 10);
                        e < 0 ? e = 0 : e > this._currentProject.darkTitle.width && (e = this._currentProject.darkTitle.width);
                        var t = Math.floor(e / (.098 * u.default.width));
                        if (this._currentImageId != t) {
                            this._currentImageId = t;
                            var i = t % (this._currentProject.imageLoop.length - 1),
                                o = this._currentProject.imageLoop[i];
                            o.complete || 0 != i && (o = this._currentProject.imageLoop[0]);
                            var n = PIXI.Sprite.from(o), r = 1;
                            o.height > 0 && (r = o.width / o.height), n.height = .59 * u.default.height, n.width = n.height * r, this.visuelWidth = n.width, this.visuelHeight = n.height, this.visuelBackground.width = .1 * this.visuelWidth, this.visuelBackground.height = .1 * this.visuelHeight, this.visuelBackground.x = .5 * -this.visuelWidth, this.visuelBackground.y = .5 * -this.visuelHeight, this.titleMask.width = this.visuelWidth * this.scaleComp, this.titleMask.height = this.visuelHeight * this.scaleComp, this.titleMask.x = .5 * -this.visuelWidth * this.scaleComp, this.titleMask.y = .5 * -this.visuelHeight * this.scaleComp, this.visuel.addChild(n), this.visuel.x = .5 * -this.visuelWidth * this.scaleComp, this.visuel.y = .5 * -this.visuelHeight * this.scaleComp, this._currentImageSprite && this.destroySprite(this._currentImageSprite), this._currentImageSprite = n
                        }
                        var s = u.default.mouseX, a = u.default.mouseY;
                        TweenLite.to(this.visuelContainer, .5, {
                            x: s,
                            ease: Power4.easeOut
                        }), TweenLite.to(this.visuelContainer, .5, {y: a, ease: Power4.easeOut})
                    }
                    this.renderer.render(this.stage), this.frame++
                }
            }
        }, {
            key: "checkMouseOver", value: function (e) {
                var t = e.rect.x, i = e.rect.y - (this.scrollY - this.yScrollNull);
                u.default.mouseX > t && u.default.mouseX < t + e.rect.width && u.default.mouseY > i && u.default.mouseY < i + e.rect.height && e != this._currentProjectOver && (void 0 != this._currentProjectOver && (this.unselectProject(this._currentProjectOver), console.log("out", this._currentProjectOver)), this.selectProject(e), console.log("over", e._id))
            }
        }, {
            key: "destroy", value: function () {
                console.log("CanvasFx destroy()")
            }
        }, {
            key: "setScrollable", value: function (e) {
                this.scrollable = e.scrollable
            }
        }, {
            key: "scroll", value: function (e) {
                this.scrollY = e, this.updateScroll()
            }
        }, {
            key: "updateScroll", value: function () {
                this.darkTitles.y = -(this.scrollY - this.yScrollNull), this.lightTitles.y = -(this.scrollY - this.yScrollNull)
            }
        }, {
            key: "destroySprite", value: function (e) {
                e && (e.parent.removeChild(e), e.destroy(), e = null)
            }
        }, {
            key: "reset", value: function () {
                this.activeProject && (this.lockProject = !1, this.unselectProject(this.activeProject), this.activeProject = void 0)
            }
        }, {
            key: "activateProject", value: function (e) {
                void 0 == this._currentProject && this.projectsList && (this._currentProject = this.projectsList[e._id]), this.activeProject = this._currentProject, this.lockProject = !0
            }
        }, {
            key: "selectProject", value: function (e) {
                if (!this.lockProject) {
                    var t = this.projectsList[e._id];
                    this._currentProject = t, this._currentImageId = void 0, this._currentProjectOver = e, this.visuelContainer.x = u.default.mouseX, this.visuelContainer.y = u.default.mouseY, TweenLite.set(t.lightTitle, {alpha: 1}), t.lightTitle._yearMc && (TweenLite.set(t.lightTitle._yearMc, {alpha: 1}), TweenLite.set(t.darkTitle._yearMc, {alpha: 1})), TweenLite.to(this.visuelContainer, 0, {
                        alpha: 1,
                        ease: Power2.easeInOut
                    }), TweenLite.to(this, 1.5, {
                        _xDistoNull: 0,
                        ease: Power2.easeOut
                    }), TweenLite.to(this, 1.5, {_yDistoNull: 0, ease: Power2.easeOut})
                }
            }
        }, {
            key: "unselectProject", value: function (e) {
                if (!this.lockProject) {
                    var t = void 0 != e._id ? this.projectsList[e._id] : e;
                    TweenLite.set(t.lightTitle, {alpha: 0}), t.lightTitle._yearMc && (TweenLite.set(t.lightTitle._yearMc, {alpha: 0}), TweenLite.set(t.darkTitle._yearMc, {alpha: 0})), this._currentProject = null, setTimeout(this.hideCover, 60)
                }
            }
        }, {
            key: "hideCover", value: function () {
                this._currentProject || (TweenLite.to(this.visuelContainer, 0, {
                    alpha: 0,
                    ease: Power2.easeInOut
                }), TweenLite.to(this, 0, {
                    _xDistoNull: this.initDistoX,
                    ease: Power2.easeIn
                }), TweenLite.to(this, 0, {_yDistoNull: this.initDistoY, ease: Power2.easeIn}))
            }
        }, {
            key: "setProjects", value: function () {
                var e = this;
                u.default.isTouch || (this.projectsList = [], this._projects.forEach(function (t, i) {
                    var o = {}, n = [], r = t.querySelector(".projects__list--cover"), s = r.querySelector("img");
                    n.push(s), r.dataset.images.split("||").forEach(function (e) {
                        var t = document.createElement("img");
                        t.src = e, n.push(t)
                    }), o.imageLoop = n;
                    var a = t.querySelector(".projects__list--title"), l = t.querySelector(".projects__list--year"),
                        u = e.createTitle(a, l);
                    o.darkTitle = u.dark, o.lightTitle = u.light, e.darkTitles.addChild(u.dark), e.lightTitles.addChild(u.light), e.projectsList.push(o)
                }), this.resize())
            }
        }, {
            key: "createTitle", value: function (e, t) {
                var i = e.innerHTML;
                i = (new DOMParser).parseFromString("<!doctype html><body>" + i, "text/html").body.textContent;
                var o = new PIXI.TextStyle({fontFamily: "Canela", fontSize: 105, fill: "#000000"}),
                    n = new PIXI.TextStyle({fontFamily: "Canela", fontSize: 105, fill: "#ffffff"}),
                    r = new PIXI.Container, s = new PIXI.Text(i, o);
                r._style = o, r._titleMc = s, r.addChild(s);
                var a = new PIXI.Container, l = new PIXI.Text(i, n);
                if (a._style = n, a._titleMc = l, a.alpha = 0, a.addChild(l), t) {
                    var u = new PIXI.TextStyle({fontFamily: "Canela", fontSize: 33, fill: "#000000"}),
                        c = new PIXI.TextStyle({fontFamily: "Canela", fontSize: 33, fill: "#ffffff"}),
                        h = new PIXI.Text(t.innerHTML, u);
                    r.addChild(h), r._yearMc = h, r._yearMc.alpha = 0, r._yearMc._style = u;
                    var d = new PIXI.Text(t.innerHTML, c);
                    a.addChild(d), a._yearMc = d, a._yearMc.alpha = 0, a._yearMc._style = c
                }
                return "d" == i.substr(i.length - 1) && (r.decal = !0), {dark: r, light: a}
            }
        }, {
            key: "resize", value: function () {
                var e = this;
                this.renderer.resize(u.default.width, u.default.height), u.default.isTouch || (this.displacementSprite.width = u.default.width, this.displacementSprite.height = u.default.height), this.fontSize = .079 * u.default.width;
                var t = .33 * this.fontSize;
                if (this.projectsList) {
                    var i = this.projDom.getBoundingClientRect();
                    this.projectsList.forEach(function (o, n) {
                        o.darkTitle._style.fontSize = e.fontSize, o.lightTitle._style.fontSize = e.fontSize;
                        var r = o.darkTitle._titleMc.width;
                        o.darkTitle.x = u.default.centerX - .5 * r, o.darkTitle.y = i.top + n * e.fontSize * 1.1 - .15 * e.fontSize - (e.yScrollNull - e.scrollY), o.lightTitle.x = u.default.centerX - .5 * r, o.lightTitle.y = i.top + n * e.fontSize * 1.1 - .15 * e.fontSize - (e.yScrollNull - e.scrollY), o.darkTitle._yearMc && (o.darkTitle._yearMc._style.fontSize = t, o.lightTitle._yearMc._style.fontSize = t, o.darkTitle._yearMc.x = r - .18 * e.fontSize, o.lightTitle._yearMc.x = o.darkTitle._yearMc.x, o.darkTitle.decal && (o.darkTitle._yearMc.x = r + .01 * e.fontSize, o.lightTitle._yearMc.x = o.darkTitle._yearMc.x), o.darkTitle._yearMc.y = -.15 * n * e.fontSize * .031, o.lightTitle._yearMc.y = -.15 * n * e.fontSize * .031)
                    })
                }
            }
        }]), e
    }(), r(s.prototype, "updateScroll", [h.default], Object.getOwnPropertyDescriptor(s.prototype, "updateScroll"), s.prototype), r(s.prototype, "selectProject", [h.default], Object.getOwnPropertyDescriptor(s.prototype, "selectProject"), s.prototype), r(s.prototype, "hideCover", [h.default], Object.getOwnPropertyDescriptor(s.prototype, "hideCover"), s.prototype), r(s.prototype, "setProjects", [h.default], Object.getOwnPropertyDescriptor(s.prototype, "setProjects"), s.prototype), s);
    t.default = d
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t, i, o, n) {
        var r = {};
        return Object.keys(o).forEach(function (e) {
            r[e] = o[e]
        }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
            return o(e, t, i) || i
        }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var s, a = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), l = i(4), u = o(l), c = i(10), h = o(c), d = (s = function () {
        function e(t) {
            if (n(this, e), this.cFx = t, this.holder = new PIXI.Container, this.titleHolder = new PIXI.Container, this.bgPadding = 1e3, this.bg = new PIXI.Graphics, this.bg.beginFill("0x000000", 1), this.bg.drawRect(0, 0, u.default.width, u.default.height), this.bg.endFill(), this.holder.addChild(this.bg), this.mask = new PIXI.Graphics, this.mask.beginFill("0xff0033", 1), this.mask.drawRect(0, 0, u.default.width, u.default.height), this.mask.endFill(), this.holder.addChild(this.mask), this.titleHolder.mask = this.mask, this.cFx.stage.addChild(this.holder), u.default.isTouch || (this.displacementFilter2 = new PIXI.filters.DisplacementFilter(this.cFx.displacementSprite), this.titleHolder.filters = [this.displacementFilter2], this.displacementFilter2.scale.x = 0, this.displacementFilter2.scale.y = 0), this.cFx.stage.addChild(this.titleHolder), u.default.isTouch) {
                var i = document.createElement("div");
                i.classList.add("transLayer"), document.body.appendChild(i), this.holder = i
            }
        }

        return a(e, [{
            key: "intro", value: function (e) {
                window.main._isIntro = !1, this.introTL = new TimelineLite({paused: !1}), this.introTL.fromTo(this.holder, 2, {y: u.default.height}, {
                    y: 0,
                    ease: Power4.easeInOut
                }), this.introTL.fromTo(e.dom.querySelector(".page-body"), 2, {y: 200}, {
                    y: 0,
                    ease: Power4.easeInOut
                }, 0), this.introTL.fromTo(this.cFx, 2, {yScrollNull: 200}, {
                    yScrollNull: 0,
                    ease: Power4.easeInOut,
                    onUpdate: this.cFx.updateScroll
                }, 0), e.setBackgroundColor(e._bgColor, !1), e.dom.classList.remove("hidden"), "photography" == e.id && this.cFx.showHome()
            }
        }, {
            key: "start", value: function (e, t) {
                if (this.title && (this.title.destroy(!0), this.title = null), this.transTween && this.transTween.kill(), this.tsDuration = 4, this._toHide = e, this._toShow = t, this.holder.alpha = 1, this.transTL = new TimelineLite({paused: !0}), u.default.isTouch ? this.transTL.fromTo(this.holder, 1, {y: 2 * u.default.height}, {
                    y: 0,
                    ease: Power4.easeInOut
                }, 0) : this.transTL.fromTo(this.holder, 1, {y: 2 * u.default.height + this.bgPadding}, {
                    y: 0,
                    ease: Power4.easeInOut
                }, 0), this.transTL.to(e.dom.querySelector(".page-body"), .7, {
                    y: -800,
                    ease: Power4.easeIn
                }, .1), "about-me" == this._toShow.id ? this.transTL.fromTo(t.dom.querySelector(".page-body"), .5, {y: u.default.height}, {
                    y: 0,
                    ease: Power4.easeOut
                }, .5) : this.transTL.fromTo(t.dom.querySelector(".page-body"), 1, {y: 200}, {
                    y: 0,
                    ease: Power4.easeInOut
                }, 0), "photography" != e.id || u.default.isTouch || this.transTL.to(this.cFx, .7, {
                    yScrollNull: -800,
                    ease: Power4.easeIn,
                    onUpdate: this.cFx.updateScroll
                }, .1), "photography" != t.id || u.default.isTouch || this.transTL.fromTo(this.cFx, 1, {yScrollNull: 200}, {
                    yScrollNull: 0,
                    ease: Power4.easeInOut,
                    onUpdate: this.cFx.updateScroll
                }, 0), "single" == t.id) if ("photography" == e.id) {
                    if (!u.default.isTouch) {
                        this.title = this.createTitle(t), this.resize(), this.titleHolder.addChild(this.title);
                        var i = this.cFx.activeProject.darkTitle.y + .5 * this.title._titleMc.height - this.cFx.scrollY,
                            o = this.title._endY + .5 * this.title._titleMc.height - 10;
                        this.titleHolder.y = i, this.titleHolder.scale.x = this.titleHolder.scale.y = 1, this.transTL.to(this.titleHolder, .9, {
                            y: o,
                            ease: Power4.easeInOut
                        }, .1), this.transTL.to(this.titleHolder.scale, .9, {
                            x: .889,
                            y: .889,
                            ease: Power4.easeInOut
                        }, .1), this.transTL.fromTo(this.displacementFilter2.scale, .9, {x: 50 * Math.random() + 50}, {
                            x: 0,
                            ease: Power4.easeInOut
                        }, .1)
                    }
                } else if ("single" == e.id && !u.default.isTouch) {
                    this.title = this.createTitle(t), this.resize(), this.titleHolder.addChild(this.title);
                    var n = e.dom.querySelector(".photography__next__title"),
                        r = n.getBoundingClientRect().top + .04 * u.default.width,
                        s = this.title._endY + .5 * this.title._titleMc.height - 10;
                    this.titleHolder.y = r, this.titleHolder.scale.x = this.titleHolder.scale.y = .889, this.transTL.to(this.titleHolder, .9, {
                        y: s,
                        ease: Power4.easeInOut
                    }, .1), this.transTL.fromTo(this.displacementFilter2.scale, .75, {x: 50 * Math.random() + 50}, {
                        x: 0,
                        ease: Power1.easeInOut
                    }, .1)
                }
                this.transTL.add(this.onMidTrans, .5), this.transTL.add(this.onEndTrans), this.transTween = TweenLite.to(this.transTL, this.tsDuration, {
                    progress: 1,
                    ease: Power2.easeOut
                })
            }
        }, {
            key: "onMidTrans", value: function () {
                this._toHide.dom.classList.add("hidden"), this._toShow.dom.classList.remove("hidden"), this._toHide._hidden(), "photography" == this._toShow.id && this.cFx.showHome(), "photography" == this._toHide.id && this.cFx.hideHome(), "about-me" == this._toShow.id && (this.holder.alpha = 0), this._toShow.setBackgroundColor(this._toShow._bgColor, !1)
            }
        }, {
            key: "onEndTrans", value: function () {
                this.transTween = null
            }
        }, {
            key: "createTitle", value: function (e) {
                var t = e.dom.querySelector(".photography__title"), i = t.getBoundingClientRect().top - 200,
                    o = t.cloneNode(!0), n = o.querySelector(".photography__year");
                n.parentNode.removeChild(n), o = o.querySelector("span"), t = (new DOMParser).parseFromString("<!doctype html><body>" + o.innerHTML, "text/html").body.textContent;
                var r = new PIXI.TextStyle({fontFamily: "Canela", fontSize: 105, fill: "#ffffff"}),
                    s = new PIXI.Container, a = new PIXI.Text(t, r);
                if (s._style = r, s._titleMc = a, s.addChild(a), n) {
                    var l = new PIXI.TextStyle({fontFamily: "Canela", fontSize: 33, fill: "#ffffff"}),
                        u = new PIXI.Text(n.innerHTML, l);
                    s.addChild(u), s._yearMc = u, s._yearMc._style = l
                }
                return s._endY = i, "d" == t.substr(t.length - 1) && (s.decal = !0), s
            }
        }, {
            key: "resize", value: function () {
                if (this.bg.y = -u.default.height - this.bgPadding, this.bg.width = u.default.width, this.bg.height = u.default.height + this.bgPadding, this.mask.y = -u.default.height - this.bgPadding, this.mask.width = u.default.width, this.mask.height = u.default.height + this.bgPadding, this.title) {
                    this.fontSize = .079 * u.default.width;
                    var e = .33 * this.fontSize;
                    this.title._style.fontSize = this.fontSize, this.titleHolder.x = u.default.centerX;
                    var t = this.title._titleMc.width, i = this.title._titleMc.height;
                    this.title._titleMc.x = .5 * -t, this.title._titleMc.y = .5 * -i, this.title._yearMc && (this.title._yearMc._style.fontSize = e, this.title._yearMc.x = .5 * t - .18 * this.fontSize, this.title._yearMc.y = this.title._titleMc.y - .15 * this.fontSize * .031, this.title.decal && (this.title._yearMc.x = .5 * t + .01 * this.fontSize))
                }
            }
        }]), e
    }(), r(s.prototype, "onMidTrans", [h.default], Object.getOwnPropertyDescriptor(s.prototype, "onMidTrans"), s.prototype), r(s.prototype, "onEndTrans", [h.default], Object.getOwnPropertyDescriptor(s.prototype, "onEndTrans"), s.prototype), s);
    t.default = d
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function s(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    function a(e, t, i, o, n) {
        var r = {};
        return Object.keys(o).forEach(function (e) {
            r[e] = o[e]
        }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
            return o(e, t, i) || i
        }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var l, u = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), c = function e(t, i, o) {
        null === t && (t = Function.prototype);
        var n = Object.getOwnPropertyDescriptor(t, i);
        if (void 0 === n) {
            var r = Object.getPrototypeOf(t);
            return null === r ? void 0 : e(r, i, o)
        }
        if ("value" in n) return n.value;
        var s = n.get;
        if (void 0 !== s) return s.call(o)
    }, h = i(13), d = o(h), p = i(4), f = o(p), y = i(10), v = o(y), _ = (l = function (e) {
        function t(e, i) {
            n(this, t);
            var o = r(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments));
            o._prevPage = i;
            var s = document.body.querySelector(".projects__list");
            return o.projDom = s, o.projects = Array.from(s.querySelectorAll("li")), o.projects.forEach(function (e, t) {
                var i = e.querySelector("a");
                i._id = t, f.default.isTouch || (i.addEventListener("mouseenter", o.onRollOver), i.addEventListener("mouseleave", o.onRollOut)), i.addEventListener("click", o.onClick)
            }), Array.from(s.querySelectorAll("a")).forEach(function (e) {
                e._href = e.getAttribute("href"), e.removeAttribute("href"), e.addEventListener("dragstart", function (e) {
                    e.preventDefault()
                })
            }), o
        }

        return s(t, e), u(t, [{
            key: "init", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "init", this).call(this), this.canvasFx = d.default.canvasFx, this.canvasFx.projDom = this.projDom, this.canvasFx.scrollY = 0, d.default.canvasFx._projects || d.default.canvasFx.setHome(this.projects, this._prevPage), this.canvasFx.reset(), this.canvasFx.setScrollable(this)
            }
        }, {
            key: "onRollOver", value: function (e) {
                this.canvasFx.selectProject(e.currentTarget)
            }
        }, {
            key: "onRollOut", value: function (e) {
                this.canvasFx.unselectProject(e.currentTarget)
            }
        }, {
            key: "onClick", value: function (e) {
                this.canvasFx.activateProject(e.currentTarget)
            }
        }, {
            key: "destroy", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
            }
        }, {
            key: "resize", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "resize", this).call(this)
            }
        }, {
            key: "update", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "update", this).call(this)
            }
        }, {
            key: "_show", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_show", this).call(this)
            }
        }, {
            key: "_hide", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_hide", this).call(this)
            }
        }]), t
    }(d.default), a(l.prototype, "onRollOver", [v.default], Object.getOwnPropertyDescriptor(l.prototype, "onRollOver"), l.prototype), a(l.prototype, "onRollOut", [v.default], Object.getOwnPropertyDescriptor(l.prototype, "onRollOut"), l.prototype), a(l.prototype, "onClick", [v.default], Object.getOwnPropertyDescriptor(l.prototype, "onClick"), l.prototype), l);
    t.default = _
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function s(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    function a(e, t, i, o, n) {
        var r = {};
        return Object.keys(o).forEach(function (e) {
            r[e] = o[e]
        }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
            return o(e, t, i) || i
        }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var l, u = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), c = function e(t, i, o) {
        null === t && (t = Function.prototype);
        var n = Object.getOwnPropertyDescriptor(t, i);
        if (void 0 === n) {
            var r = Object.getPrototypeOf(t);
            return null === r ? void 0 : e(r, i, o)
        }
        if ("value" in n) return n.value;
        var s = n.get;
        if (void 0 !== s) return s.call(o)
    }, h = i(13), d = o(h), p = i(10), f = o(p), y = (l = function (e) {
        function t(e, i) {
            n(this, t);
            var o = r(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments));
            return Array.from(o.dom.querySelectorAll(".films__list li")).forEach(function (e, t) {
                e._plyrId = "#player-" + (t + 1), e._title = e.querySelector(".films__list--title"), e._cover = e.querySelector(".films__list--cover"), e._preview = e.querySelector(".films__list--preview"), e._previewVideo = e._preview.querySelector("video"), e._titleHTML = e._title.innerHTML;
                var i = new DOMParser, n = i.parseFromString("<!doctype html><body>" + e._titleHTML, "text/html");
                e._titleHTML = n.body.textContent, e.addEventListener("mouseenter", o.onRollOver), e.addEventListener("mouseleave", o.onRollOut), e.addEventListener("mousedown", o.clickPreview)
            }), o.init(), o
        }

        return s(t, e), u(t, [{
            key: "init", value: function () {
                this.currentPlyr = void 0
            }
        }, {
            key: "onRollOver", value: function (e) {
                var t = e.currentTarget;
                t._title.innerHTML = "Play", 4 == t._previewVideo.readyState &&
                (t._previewVideo.paused ? (t._previewVideo.currentTime = 0, t._previewVideo.play(), TweenLite.set(t._cover, {autoAlpha: 0})) : TweenLite.to(t._cover, .5, {
                    autoAlpha: 0,
                    ease: Power1.easeOut
                }))
            }
        }, {
            key: "onRollOut", value: function (e) {
                var t = e.currentTarget;
                void 0 != this.currentPlyr && this.currentPlyr == t._plyr || (4 == t._previewVideo.readyState && TweenLite.to(t._cover, .5, {
                    autoAlpha: 1,
                    ease: Power1.easeIn,
                    onComplete: this.resetPreviewVideo,
                    onCompleteParams: [t]
                }), t._title.innerHTML = t._titleHTML)
            }
        }, {
            key: "resetPreviewVideo", value: function (e) {
                e._previewVideo.pause(), e._previewVideo.currentTime = 0
            }
        }, {
            key: "clickPreview", value: function (e) {
                var t = e.currentTarget;
                void 0 != this.currentPlyr && this.currentPlyr == t._plyr || (this.currentPlyr && (TweenLite.to(this.currentPlyr._btn._title, 1, {
                    autoAlpha: 1,
                    ease: Power2.easeOut
                }), TweenLite.to(this.currentPlyr._btn._cover, 1, {
                    autoAlpha: 1,
                    ease: Power2.easeOut
                }), TweenLite.to(this.currentPlyr._btn._preview, 1, {
                    autoAlpha: 1,
                    ease: Power2.easeOut
                }), this.currentPlyr._btn.classList.remove("active"), this.currentPlyr.pause(), this.currentPlyr._btn._title.innerHTML = this.currentPlyr._btn._titleHTML), t._plyr ? t._plyr.play() : (t._plyr = new Plyr(t._plyrId, {
                    controls: ["play", "progress", "fullscreen"],
                    settings: ["quality"],
                    speed: {selected: 0, options: [1]},
                    iconUrl: templateUrl + "/library/sprite/plyr.svg",
                    autoplay: !0
                }), t._plyr._btn = t), TweenLite.to(t._title, 1, {
                    autoAlpha: 0,
                    ease: Power2.easeOut
                }), TweenLite.to(t._cover, 1, {
                    autoAlpha: 0,
                    ease: Power2.easeOut
                }), TweenLite.to(t._preview, 1, {
                    autoAlpha: 0,
                    ease: Power2.easeOut,
                    onComplete: this.resetPreviewVideo,
                    onCompleteParams: [t]
                }), this.currentPlyr = t._plyr, t.classList.add("active"))
            }
        }, {
            key: "init", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "init", this).call(this)
            }
        }, {
            key: "destroy", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
            }
        }, {
            key: "resize", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "resize", this).call(this)
            }
        }, {
            key: "update", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "update", this).call(this)
            }
        }, {
            key: "_show", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_show", this).call(this)
            }
        }, {
            key: "_hide", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_hide", this).call(this)
            }
        }]), t
    }(d.default), a(l.prototype, "onRollOut", [f.default], Object.getOwnPropertyDescriptor(l.prototype, "onRollOut"), l.prototype), a(l.prototype, "resetPreviewVideo", [f.default], Object.getOwnPropertyDescriptor(l.prototype, "resetPreviewVideo"), l.prototype), a(l.prototype, "clickPreview", [f.default], Object.getOwnPropertyDescriptor(l.prototype, "clickPreview"), l.prototype), l);
    t.default = y
}, function (e, t, i) {
    "use strict";

    function o(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function n(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function r(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var s = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), a = function e(t, i, o) {
        null === t && (t = Function.prototype);
        var n = Object.getOwnPropertyDescriptor(t, i);
        if (void 0 === n) {
            var r = Object.getPrototypeOf(t);
            return null === r ? void 0 : e(r, i, o)
        }
        if ("value" in n) return n.value;
        var s = n.get;
        if (void 0 !== s) return s.call(o)
    }, l = i(13), u = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(l), c = function (e) {
        function t(e, i) {
            return o(this, t), n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, i))
        }

        return r(t, e), s(t, [{
            key: "init", value: function () {
                a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "init", this).call(this)
            }
        }, {
            key: "destroy", value: function () {
                a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
            }
        }, {
            key: "resize", value: function () {
                a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "resize", this).call(this)
            }
        }, {
            key: "update", value: function () {
                a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "update", this).call(this)
            }
        }, {
            key: "_show", value: function () {
                a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_show", this).call(this)
            }
        }, {
            key: "_hide", value: function () {
                a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_hide", this).call(this)
            }
        }]), t
    }(u.default);
    t.default = c
}, function (e, t, i) {
    "use strict";

    function o(e) {
        return e && e.__esModule ? e : {default: e}
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function s(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    function a(e, t, i, o, n) {
        var r = {};
        return Object.keys(o).forEach(function (e) {
            r[e] = o[e]
        }), r.enumerable = !!r.enumerable, r.configurable = !!r.configurable, ("value" in r || r.initializer) && (r.writable = !0), r = i.slice().reverse().reduce(function (i, o) {
            return o(e, t, i) || i
        }, r), n && void 0 !== r.initializer && (r.value = r.initializer ? r.initializer.call(n) : void 0, r.initializer = void 0), void 0 === r.initializer && (Object.defineProperty(e, t, r), r = null), r
    }

    Object.defineProperty(t, "__esModule", {value: !0}), t.default = void 0;
    var l, u = function () {
        function e(e, t) {
            for (var i = 0; i < t.length; i++) {
                var o = t[i];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
            }
        }

        return function (t, i, o) {
            return i && e(t.prototype, i), o && e(t, o), t
        }
    }(), c = function e(t, i, o) {
        null === t && (t = Function.prototype);
        var n = Object.getOwnPropertyDescriptor(t, i);
        if (void 0 === n) {
            var r = Object.getPrototypeOf(t);
            return null === r ? void 0 : e(r, i, o)
        }
        if ("value" in n) return n.value;
        var s = n.get;
        if (void 0 !== s) return s.call(o)
    }, h = i(10), d = o(h), p = i(13), f = o(p), y = (l = function (e) {
        function t(e, i) {
            return n(this, t), r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, i))
        }

        return s(t, e), u(t, [{
            key: "init", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "init", this).call(this), this.credits = this.dom.querySelector(".about__credits"), this.creditsTitle = this.credits.querySelector(".about__credits--title"), this.creditsContent = this.credits.querySelector(".about__credits--content")
            }
        }, {
            key: "onRollOverCredits", value: function (e) {
                TweenLite.to(this.creditsTitle, .1, {
                    autoAlpha: 0,
                    ease: Power4.easeOut
                }), TweenLite.to(this.creditsContent, 1, {autoAlpha: .6, ease: Power4.easeOut})
            }
        }, {
            key: "onRollOutCredits", value: function (e) {
                TweenLite.to(this.creditsTitle, 1, {
                    autoAlpha: .3,
                    ease: Power4.easeOut
                }), TweenLite.to(this.creditsContent, .1, {autoAlpha: 0, ease: Power4.easeOut})
            }
        }, {
            key: "destroy", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
            }
        }, {
            key: "resize", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "resize", this).call(this)
            }
        }, {
            key: "update", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "update", this).call(this)
            }
        }, {
            key: "_show", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_show", this).call(this)
            }
        }, {
            key: "_hide", value: function () {
                c(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "_hide", this).call(this)
            }
        }]), t
    }(f.default), a(l.prototype, "onRollOverCredits", [d.default], Object.getOwnPropertyDescriptor(l.prototype, "onRollOverCredits"), l.prototype), a(l.prototype, "onRollOutCredits", [d.default], Object.getOwnPropertyDescriptor(l.prototype, "onRollOutCredits"), l.prototype), l);
    t.default = y
}, function (e, t, i) {
    var o, n;
    /**!
     * ajax - v2.3.0
     * Ajax module in Vanilla JS
     * https://github.com/fdaciuk/ajax

     * Sun Jul 23 2017 10:55:09 GMT-0300 (BRT)
     * MIT (c) Fernando Daciuk
     */
    !function (r, s) {
        "use strict";
        o = s, void 0 !== (n = "function" == typeof o ? o.call(t, i, t, e) : o) && (e.exports = n)
    }(0, function () {
        "use strict";

        function e(e) {
            var o = ["get", "post", "put", "delete"];
            return e = e || {}, e.baseUrl = e.baseUrl || "", e.method && e.url ? i(e.method, e.baseUrl + e.url, t(e.data), e) : o.reduce(function (o, n) {
                return o[n] = function (o, r) {
                    return i(n, e.baseUrl + o, t(r), e)
                }, o
            }, {})
        }

        function t(e) {
            return e || null
        }

        function i(e, t, i, r) {
            var a = ["then", "catch", "always"], u = a.reduce(function (e, t) {
                return e[t] = function (i) {
                    return e[t] = i, e
                }, e
            }, {}), c = new XMLHttpRequest, h = o(t, i, e);
            return c.open(e, h, !0), c.withCredentials = r.hasOwnProperty("withCredentials"), n(c, r.headers), c.addEventListener("readystatechange", s(u, c), !1), c.send(l(i)), u.abort = function () {
                return c.abort()
            }, u
        }

        function o(e, t, i) {
            if ("get" !== i.toLowerCase() || !t) return e;
            var o = l(t);
            return e + (e.indexOf("?") > -1 ? "&" : "?") + o
        }

        function n(e, t) {
            t = t || {}, r(t) || (t["Content-Type"] = "application/x-www-form-urlencoded"), Object.keys(t).forEach(function (i) {
                t[i] && e.setRequestHeader(i, t[i])
            })
        }

        function r(e) {
            return Object.keys(e).some(function (e) {
                return "content-type" === e.toLowerCase()
            })
        }

        function s(e, t) {
            return function i() {
                t.readyState === t.DONE && (t.removeEventListener("readystatechange", i, !1), e.always.apply(e, a(t)), t.status >= 200 && t.status < 300 ? e.then.apply(e, a(t)) : e.catch.apply(e, a(t)))
            }
        }

        function a(e) {
            var t;
            try {
                t = JSON.parse(e.responseText)
            } catch (i) {
                t = e.responseText
            }
            return [t, e]
        }

        function l(e) {
            return u(e) ? c(e) : e
        }

        function u(e) {
            return "[object Object]" === Object.prototype.toString.call(e)
        }

        function c(e) {
            return Object.keys(e).reduce(function (t, i) {
                return (t ? t + "&" : "") + h(i) + "=" + h(e[i])
            }, "")
        }

        function h(e) {
            return encodeURIComponent(e)
        }

        return e
    })
}]);