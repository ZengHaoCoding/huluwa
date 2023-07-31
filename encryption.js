var e = require("../@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.encryptionData = function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = e.ak, r = e.sk, i = e.method, o = e.url, d = e.body, s = n(), c = a({
        method: i,
        url: o,
        ak: t,
        sk: r,
        date: s
    }), l = u(d, r), m = {
        "X-HMAC-SIGNATURE": c,
        "X-HMAC-ACCESS-KEY": t,
        "X-HMAC-ALGORITHM": "hmac-sha256",
        "X-HMAC-DIGEST": l,
        "X-HMAC-Date": s
    };
    return m;
};

var t = e(require("crypto-js")), r = e(require("moment"));

function n() {
    var e = 0, t = wx.getStorageSync("serverBetweenTime");
    t && (e = new Number(t));
    var n = new Date().getTime() + e;
    return (0, r.default)(n).utc().format("ddd, DD MMM YYYY HH:mm:ss [GMT]");
}

function a() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r = e.method, n = e.url, a = e.ak, u = e.sk, i = e.date, o = r + "\n" + n + "\n\n" + a + "\n" + i + "\n", d = t.default.HmacSHA256(o, u);
    return d = t.default.enc.Base64.stringify(d);
}

function u(e, r) {
    var n = t.default.HmacSHA256(e, r);
    return n = t.default.enc.Base64.stringify(n);
}