/*!
 * Firepad is an open-source, collaborative code and text editor. It was designed
 * to be embedded inside larger applications. Since it uses Firebase as a backend,
 * it requires no server-side code and can be added to any web app simply by
 * including a couple JavaScript files.
 *
 * Firepad 1.3.0
 * http://www.firepad.io/
 * License: MIT
 * Copyright: 2014 Firebase
 * With code from ot.js (Copyright 2012-2013 Tim Baumann)
 */
! function(a, b, c) {
    "undefined" != typeof module && module.exports ? module.exports = b() : "function" == typeof c.define && c.define.amd ? define(b) : c[a] = b()
}("Firepad", function() {
    var a = a || {};
    a.utils = {}, a.utils.makeEventEmitter = function(a, b) {
        a.prototype.allowedEvents_ = b, a.prototype.on = function(a, b, c) {
            this.validateEventType_(a), this.eventListeners_ = this.eventListeners_ || {}, this.eventListeners_[a] = this.eventListeners_[a] || [], this.eventListeners_[a].push({
                callback: b,
                context: c
            })
        }, a.prototype.off = function(a, b) {
            this.validateEventType_(a), this.eventListeners_ = this.eventListeners_ || {};
            for (var c = this.eventListeners_[a] || [], d = 0; d < c.length; d++)
                if (c[d].callback === b) return void c.splice(d, 1)
        }, a.prototype.trigger = function(a) {
            this.eventListeners_ = this.eventListeners_ || {};
            for (var b = this.eventListeners_[a] || [], c = 0; c < b.length; c++) b[c].callback.apply(b[c].context, Array.prototype.slice.call(arguments, 1))
        }, a.prototype.validateEventType_ = function(a) {
            if (this.allowedEvents_) {
                for (var b = !1, c = 0; c < this.allowedEvents_.length; c++)
                    if (this.allowedEvents_[c] === a) {
                        b = !0;
                        break
                    }
                if (!b) throw new Error('Unknown event "' + a + '"')
            }
        }
    }, a.utils.elt = function(b, c, d) {
        var e = document.createElement(b);
        if ("string" == typeof c) a.utils.setTextContent(e, c);
        else if (c)
            for (var f = 0; f < c.length; ++f) e.appendChild(c[f]);
        for (var g in d || {}) e.setAttribute(g, d[g]);
        return e
    }, a.utils.setTextContent = function(a, b) {
        a.innerHTML = "", a.appendChild(document.createTextNode(b))
    }, a.utils.on = function(a, b, c, d) {
        a.addEventListener ? a.addEventListener(b, c, d || !1) : a.attachEvent && a.attachEvent("on" + b, c)
    }, a.utils.off = function(a, b, c, d) {
        a.removeEventListener ? a.removeEventListener(b, c, d || !1) : a.detachEvent && a.detachEvent("on" + b, c)
    }, a.utils.preventDefault = function(a) {
        a.preventDefault ? a.preventDefault() : a.returnValue = !1
    }, a.utils.stopPropagation = function(a) {
        a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
    }, a.utils.stopEvent = function(b) {
        a.utils.preventDefault(b), a.utils.stopPropagation(b)
    }, a.utils.stopEventAnd = function(b) {
        return function(c) {
            return b(c), a.utils.stopEvent(c), !1
        }
    }, a.utils.trim = function(a) {
        return a.replace(/^\s+/g, "").replace(/\s+$/g, "")
    }, a.utils.stringEndsWith = function(a, b) {
        for (var c = "string" == typeof b ? [b] : b, d = 0; d < c.length; d++) {
            var b = c[d];
            if (-1 !== a.indexOf(b, a.length - b.length)) return !0
        }
        return !1
    }, a.utils.assert = function(a, b) {
        if (!a) throw new Error(b || "assertion error")
    }, a.utils.log = function() {
        if ("undefined" != typeof console && "undefined" != typeof console.log) {
            for (var a = ["Firepad:"], b = 0; b < arguments.length; b++) a.push(arguments[b]);
            console.log.apply(console, a)
        }
    };
    var a = a || {};
    a.Span = function() {
        function a(a, b) {
            this.pos = a, this.length = b
        }
        return a.prototype.end = function() {
            return this.pos + this.length
        }, a
    }();
    var a = a || {};
    a.TextOp = function() {
        function b(a) {
            this.type = a, this.chars = null, this.text = null, this.attributes = null, "insert" === a ? (this.text = arguments[1], c.assert("string" == typeof this.text), this.attributes = arguments[2] || {}, c.assert("object" == typeof this.attributes)) : "delete" === a ? (this.chars = arguments[1], c.assert("number" == typeof this.chars)) : "retain" === a && (this.chars = arguments[1], c.assert("number" == typeof this.chars), this.attributes = arguments[2] || {}, c.assert("object" == typeof this.attributes))
        }
        var c = a.utils;
        return b.prototype.isInsert = function() {
            return "insert" === this.type
        }, b.prototype.isDelete = function() {
            return "delete" === this.type
        }, b.prototype.isRetain = function() {
            return "retain" === this.type
        }, b.prototype.equals = function(a) {
            return this.type === a.type && this.text === a.text && this.chars === a.chars && this.attributesEqual(a.attributes)
        }, b.prototype.attributesEqual = function(a) {
            for (var b in this.attributes)
                if (this.attributes[b] !== a[b]) return !1;
            for (b in a)
                if (this.attributes[b] !== a[b]) return !1;
            return !0
        }, b.prototype.hasEmptyAttributes = function() {
            var a = !0;
            for (var b in this.attributes) {
                a = !1;
                break
            }
            return a
        }, b
    }();
    var a = a || {};
    a.TextOperation = function() {
        "use strict";

        function b() {
            return this && this.constructor === b ? (this.ops = [], this.baseLength = 0, void(this.targetLength = 0)) : new b
        }

        function c(a) {
            var b = a.ops;
            switch (b.length) {
                case 1:
                    return b[0];
                case 2:
                    return b[0].isRetain() ? b[1] : b[1].isRetain() ? b[0] : null;
                case 3:
                    if (b[0].isRetain() && b[2].isRetain()) return b[1]
            }
            return null
        }

        function d(a) {
            return a.ops[0].isRetain() ? a.ops[0].chars : 0
        }
        var e = a.TextOp,
            f = a.utils;
        return b.prototype.equals = function(a) {
            if (this.baseLength !== a.baseLength) return !1;
            if (this.targetLength !== a.targetLength) return !1;
            if (this.ops.length !== a.ops.length) return !1;
            for (var b = 0; b < this.ops.length; b++)
                if (!this.ops[b].equals(a.ops[b])) return !1;
            return !0
        }, b.prototype.retain = function(a, b) {
            if ("number" != typeof a || 0 > a) throw new Error("retain expects a positive integer.");
            if (0 === a) return this;
            this.baseLength += a, this.targetLength += a, b = b || {};
            var c = this.ops.length > 0 ? this.ops[this.ops.length - 1] : null;
            return c && c.isRetain() && c.attributesEqual(b) ? c.chars += a : this.ops.push(new e("retain", a, b)), this
        }, b.prototype.insert = function(a, b) {
            if ("string" != typeof a) throw new Error("insert expects a string");
            if ("" === a) return this;
            b = b || {}, this.targetLength += a.length;
            var c = this.ops.length > 0 ? this.ops[this.ops.length - 1] : null,
                d = this.ops.length > 1 ? this.ops[this.ops.length - 2] : null;
            return c && c.isInsert() && c.attributesEqual(b) ? c.text += a : c && c.isDelete() ? d && d.isInsert() && d.attributesEqual(b) ? d.text += a : (this.ops[this.ops.length - 1] = new e("insert", a, b), this.ops.push(c)) : this.ops.push(new e("insert", a, b)), this
        }, b.prototype["delete"] = function(a) {
            if ("string" == typeof a && (a = a.length), "number" != typeof a || 0 > a) throw new Error("delete expects a positive integer or a string");
            if (0 === a) return this;
            this.baseLength += a;
            var b = this.ops.length > 0 ? this.ops[this.ops.length - 1] : null;
            return b && b.isDelete() ? b.chars += a : this.ops.push(new e("delete", a)), this
        }, b.prototype.isNoop = function() {
            return 0 === this.ops.length || 1 === this.ops.length && this.ops[0].isRetain() && this.ops[0].hasEmptyAttributes()
        }, b.prototype.clone = function() {
            for (var a = new b, c = 0; c < this.ops.length; c++) this.ops[c].isRetain() ? a.retain(this.ops[c].chars, this.ops[c].attributes) : this.ops[c].isInsert() ? a.insert(this.ops[c].text, this.ops[c].attributes) : a["delete"](this.ops[c].chars);
            return a
        }, b.prototype.toString = function() {
            var a = Array.prototype.map || function(a) {
                for (var b = this, c = [], d = 0, e = b.length; e > d; d++) c[d] = a(b[d]);
                return c
            };
            return a.call(this.ops, function(a) {
                return a.isRetain() ? "retain " + a.chars : a.isInsert() ? "insert '" + a.text + "'" : "delete " + a.chars
            }).join(", ")
        }, b.prototype.toJSON = function() {
            for (var a = [], b = 0; b < this.ops.length; b++) this.ops[b].hasEmptyAttributes() || a.push(this.ops[b].attributes), "retain" === this.ops[b].type ? a.push(this.ops[b].chars) : "insert" === this.ops[b].type ? a.push(this.ops[b].text) : "delete" === this.ops[b].type && a.push(-this.ops[b].chars);
            return 0 === a.length && a.push(0), a
        }, b.fromJSON = function(a) {
            for (var c = new b, d = 0, e = a.length; e > d; d++) {
                var g = a[d],
                    h = {};
                "object" == typeof g && (h = g, d++, g = a[d]), "number" == typeof g ? g > 0 ? c.retain(g, h) : c["delete"](-g) : (f.assert("string" == typeof g), c.insert(g, h))
            }
            return c
        }, b.prototype.apply = function(a, b, c) {
            var d = this;
            if (b = b || [], c = c || [], a.length !== d.baseLength) throw new Error("The operation's base length must be equal to the string's length.");
            for (var e, g, h = [], i = 0, j = 0, k = this.ops, l = 0, m = k.length; m > l; l++) {
                var n = k[l];
                if (n.isRetain()) {
                    if (j + n.chars > a.length) throw new Error("Operation can't retain more characters than are left in the string.");
                    for (h[i++] = a.slice(j, j + n.chars), e = 0; e < n.chars; e++) {
                        var o = b[j + e] || {},
                            p = {};
                        for (g in o) p[g] = o[g], f.assert(p[g] !== !1);
                        for (g in n.attributes) n.attributes[g] === !1 ? delete p[g] : p[g] = n.attributes[g], f.assert(p[g] !== !1);
                        c.push(p)
                    }
                    j += n.chars
                } else if (n.isInsert())
                    for (h[i++] = n.text, e = 0; e < n.text.length; e++) {
                        var q = {};
                        for (g in n.attributes) q[g] = n.attributes[g], f.assert(q[g] !== !1);
                        c.push(q)
                    } else j += n.chars
            }
            if (j !== a.length) throw new Error("The operation didn't operate on the whole string.");
            var r = h.join("");
            return f.assert(r.length === c.length), r
        }, b.prototype.invert = function(a) {
            for (var c = 0, d = new b, e = this.ops, f = 0, g = e.length; g > f; f++) {
                var h = e[f];
                h.isRetain() ? (d.retain(h.chars), c += h.chars) : h.isInsert() ? d["delete"](h.text.length) : (d.insert(a.slice(c, c + h.chars)), c += h.chars)
            }
            return d
        }, b.prototype.compose = function(a) {
            function c(a, b, c) {
                var d, e = {};
                for (d in a) e[d] = a[d];
                for (d in b) c && b[d] === !1 ? delete e[d] : e[d] = b[d];
                return e
            }
            var d = this;
            if (d.targetLength !== a.baseLength) throw new Error("The base length of the second operation has to be the target length of the first operation");
            for (var e, f = new b, g = d.clone().ops, h = a.clone().ops, i = 0, j = 0, k = g[i++], l = h[j++];;) {
                if ("undefined" == typeof k && "undefined" == typeof l) break;
                if (k && k.isDelete()) f["delete"](k.chars), k = g[i++];
                else if (l && l.isInsert()) f.insert(l.text, l.attributes), l = h[j++];
                else {
                    if ("undefined" == typeof k) throw new Error("Cannot compose operations: first operation is too short.");
                    if ("undefined" == typeof l) throw new Error("Cannot compose operations: first operation is too long.");
                    if (k.isRetain() && l.isRetain()) e = c(k.attributes, l.attributes), k.chars > l.chars ? (f.retain(l.chars, e), k.chars -= l.chars, l = h[j++]) : k.chars === l.chars ? (f.retain(k.chars, e), k = g[i++], l = h[j++]) : (f.retain(k.chars, e), l.chars -= k.chars, k = g[i++]);
                    else if (k.isInsert() && l.isDelete()) k.text.length > l.chars ? (k.text = k.text.slice(l.chars), l = h[j++]) : k.text.length === l.chars ? (k = g[i++], l = h[j++]) : (l.chars -= k.text.length, k = g[i++]);
                    else if (k.isInsert() && l.isRetain()) e = c(k.attributes, l.attributes, !0), k.text.length > l.chars ? (f.insert(k.text.slice(0, l.chars), e), k.text = k.text.slice(l.chars), l = h[j++]) : k.text.length === l.chars ? (f.insert(k.text, e), k = g[i++], l = h[j++]) : (f.insert(k.text, e), l.chars -= k.text.length, k = g[i++]);
                    else {
                        if (!k.isRetain() || !l.isDelete()) throw new Error("This shouldn't happen: op1: " + JSON.stringify(k) + ", op2: " + JSON.stringify(l));
                        k.chars > l.chars ? (f["delete"](l.chars), k.chars -= l.chars, l = h[j++]) : k.chars === l.chars ? (f["delete"](l.chars), k = g[i++], l = h[j++]) : (f["delete"](k.chars), l.chars -= k.chars, k = g[i++])
                    }
                }
            }
            return f
        }, b.prototype.shouldBeComposedWith = function(a) {
            if (this.isNoop() || a.isNoop()) return !0;
            var b = d(this),
                e = d(a),
                f = c(this),
                g = c(a);
            return f && g ? f.isInsert() && g.isInsert() ? b + f.text.length === e : f.isDelete() && g.isDelete() ? e + g.chars === b || b === e : !1 : !1
        }, b.prototype.shouldBeComposedWithInverted = function(a) {
            if (this.isNoop() || a.isNoop()) return !0;
            var b = d(this),
                e = d(a),
                f = c(this),
                g = c(a);
            return f && g ? f.isInsert() && g.isInsert() ? b + f.text.length === e || b === e : f.isDelete() && g.isDelete() ? e + g.chars === b : !1 : !1
        }, b.transformAttributes = function(a, b) {
            var c, d = {},
                e = {},
                g = {};
            for (c in a) g[c] = !0;
            for (c in b) g[c] = !0;
            for (c in g) {
                var h = a[c],
                    i = b[c];
                f.assert(null != h || null != i), null == h ? e[c] = i : null == i ? d[c] = h : h === i || (d[c] = h)
            }
            return [d, e]
        }, b.transform = function(a, c) {
            if (a.baseLength !== c.baseLength) throw new Error("Both operations have to have the same base length");
            for (var d = new b, e = new b, f = a.clone().ops, g = c.clone().ops, h = 0, i = 0, j = f[h++], k = g[i++];;) {
                if ("undefined" == typeof j && "undefined" == typeof k) break;
                if (j && j.isInsert()) d.insert(j.text, j.attributes), e.retain(j.text.length), j = f[h++];
                else if (k && k.isInsert()) d.retain(k.text.length), e.insert(k.text, k.attributes), k = g[i++];
                else {
                    if ("undefined" == typeof j) throw new Error("Cannot transform operations: first operation is too short.");
                    if ("undefined" == typeof k) throw new Error("Cannot transform operations: first operation is too long.");
                    var l;
                    if (j.isRetain() && k.isRetain()) {
                        var m = b.transformAttributes(j.attributes, k.attributes);
                        j.chars > k.chars ? (l = k.chars, j.chars -= k.chars, k = g[i++]) : j.chars === k.chars ? (l = k.chars, j = f[h++], k = g[i++]) : (l = j.chars, k.chars -= j.chars, j = f[h++]), d.retain(l, m[0]), e.retain(l, m[1])
                    } else if (j.isDelete() && k.isDelete()) j.chars > k.chars ? (j.chars -= k.chars, k = g[i++]) : j.chars === k.chars ? (j = f[h++], k = g[i++]) : (k.chars -= j.chars, j = f[h++]);
                    else if (j.isDelete() && k.isRetain()) j.chars > k.chars ? (l = k.chars, j.chars -= k.chars, k = g[i++]) : j.chars === k.chars ? (l = k.chars, j = f[h++], k = g[i++]) : (l = j.chars, k.chars -= j.chars, j = f[h++]), d["delete"](l);
                    else {
                        if (!j.isRetain() || !k.isDelete()) throw new Error("The two operations aren't compatible");
                        j.chars > k.chars ? (l = k.chars, j.chars -= k.chars, k = g[i++]) : j.chars === k.chars ? (l = j.chars, j = f[h++], k = g[i++]) : (l = j.chars, k.chars -= j.chars, j = f[h++]), e["delete"](l)
                    }
                }
            }
            return [d, e]
        }, b
    }();
    var a = a || {};
    a.AnnotationList = function() {
        function b(a, b) {
            if (!a) throw new Error("AnnotationList assertion failed" + (b ? ": " + b : ""))
        }

        function c(a, b) {
            this.pos = a, this.length = b.length, this.annotation = b.annotation, this.attachedObject_ = b.attachedObject
        }

        function d(a, b) {
            this.pos = a, this.length = b.length, this.annotation = b.annotation, this.node_ = b
        }

        function e(a) {
            this.head_ = new f(0, h), this.changeHandler_ = a
        }

        function f(a, b) {
            this.length = a, this.annotation = b, this.attachedObject = null, this.next = null
        }
        var g = a.Span;
        c.prototype.getAttachedObject = function() {
            return this.attachedObject_
        }, d.prototype.attachObject = function(a) {
            this.node_.attachedObject = a
        };
        var h = {
            equals: function() {
                return !1
            }
        };
        return e.prototype.insertAnnotatedSpan = function(a, c) {
            this.wrapOperation_(new g(a.pos, 0), function(d, e) {
                b(!e || null === e.next);
                var g = new f(a.length, c);
                if (e) {
                    b(a.pos > d && a.pos < d + e.length);
                    var i = new f(0, h);
                    return i.next = new f(a.pos - d, e.annotation), i.next.next = g, g.next = new f(d + e.length - a.pos, e.annotation), i.next
                }
                return g
            })
        }, e.prototype.removeSpan = function(a) {
            0 !== a.length && this.wrapOperation_(a, function(c, d) {
                b(null !== d);
                var e = new f(0, h),
                    g = e;
                for (a.pos > c && (g.next = new f(a.pos - c, d.annotation), g = g.next); a.end() > c + d.length;) c += d.length, d = d.next;
                var i = c + d.length - a.end();
                return i > 0 && (g.next = new f(i, d.annotation)), e.next
            })
        }, e.prototype.updateSpan = function(a, c) {
            0 !== a.length && this.wrapOperation_(a, function(d, e) {
                b(null !== e);
                var g = new f(0, h),
                    i = g,
                    j = d,
                    k = a.pos - j;
                for (b(k < e.length), k > 0 && (i.next = new f(k, e.annotation), i = i.next, j += i.length); null !== e && a.end() >= d + e.length;) {
                    var l = d + e.length - j;
                    i.next = new f(l, c(e.annotation, l)), i = i.next, d += e.length, e = e.next, j = d
                }
                var m = a.end() - j;
                return m > 0 && (b(m < e.length), i.next = new f(m, c(e.annotation, m)), i = i.next, j += i.length, i.next = new f(d + e.length - j, e.annotation)), g.next
            })
        }, e.prototype.wrapOperation_ = function(a, b) {
            if (a.pos < 0) throw new Error("Span start cannot be negative.");
            var e, g = [],
                h = [],
                i = this.getAffectedNodes_(a);
            null !== i.start ? (e = i.end.next, i.end.next = null) : e = i.succ;
            var j = b(i.startPos, i.start),
                k = !1,
                l = !1;
            if (j) {
                this.mergeNodesWithSameAnnotations_(j);
                var m;
                for (i.pred && i.pred.annotation.equals(j.annotation) ? (k = !0, j.length += i.pred.length, i.beforePred.next = j, m = i.predPos) : (i.beforeStart.next = j, m = i.startPos); j.next;) h.push(new d(m, j)), m += j.length, j = j.next;
                i.succ && i.succ.annotation.equals(j.annotation) ? (j.length += i.succ.length, l = !0, j.next = i.succ.next) : j.next = e, h.push(new d(m, j))
            } else i.pred && i.succ && i.pred.annotation.equals(i.succ.annotation) ? (k = !0, l = !0, j = new f(i.pred.length + i.succ.length, i.pred.annotation), i.beforePred.next = j, j.next = i.succ.next, h.push(new d(i.startPos - i.pred.length, j))) : i.beforeStart.next = e;
            k && g.push(new c(i.predPos, i.pred));
            for (var n = i.startPos, o = i.start; null !== o;) g.push(new c(n, o)), n += o.length, o = o.next;
            l && g.push(new c(n, i.succ)), this.changeHandler_(g, h)
        }, e.prototype.getAffectedNodes_ = function(a) {
            for (var b = {}, c = null, d = this.head_, e = d.next, f = 0; null !== e && a.pos >= f + e.length;) f += e.length, c = d, d = e, e = e.next;
            if (null === e && (0 !== a.length || a.pos !== f)) throw new Error("Span start exceeds the bounds of the AnnotationList.");
            for (b.startPos = f, 0 === a.length && a.pos === f ? b.start = null : b.start = e, b.beforeStart = d, f === a.pos && f > 0 ? (b.pred = d, b.predPos = f - d.length, b.beforePred = c) : b.pred = null; null !== e && a.end() > f;) f += e.length, d = e, e = e.next;
            if (a.end() > f) throw new Error("Span end exceeds the bounds of the AnnotationList.");
            return 0 === a.length && a.end() === f ? b.end = null : b.end = d, b.succ = f === a.end() ? e : null, b
        }, e.prototype.mergeNodesWithSameAnnotations_ = function(a) {
            if (a)
                for (var b = null, c = a; c;) b && b.annotation.equals(c.annotation) ? (b.length += c.length, b.next = c.next) : b = c, c = c.next
        }, e.prototype.forEach = function(a) {
            for (var b = this.head_.next; null !== b;) a(b.length, b.annotation, b.attachedObject), b = b.next
        }, e.prototype.getAnnotatedSpansForPos = function(a) {
            for (var b = 0, d = this.head_.next, e = null; null !== d && b + d.length <= a;) b += d.length, e = d, d = d.next;
            if (null === d && b !== a) throw new Error("pos exceeds the bounds of the AnnotationList");
            var f = [];
            return b === a && e && f.push(new c(b - e.length, e)), d && f.push(new c(b, d)), f
        }, e.prototype.getAnnotatedSpansForSpan = function(a) {
            if (0 === a.length) return [];
            for (var b = [], c = this.getAffectedNodes_(a), d = c.startPos, e = c.start; null !== e && d < a.end();) {
                var f = Math.max(d, a.pos),
                    h = Math.min(d + e.length, a.end()),
                    i = new g(f, h - f);
                i.annotation = e.annotation, b.push(i), d += e.length, e = e.next
            }
            return b
        }, e.prototype.count = function() {
            for (var a = 0, c = this.head_.next, d = null; null !== c;) d && b(!d.annotation.equals(c.annotation)), d = c, c = c.next, a++;
            return a
        }, f.prototype.clone = function() {
            var a = new f(this.spanLength, this.annotation);
            return a.next = this.next, a
        }, e
    }();
    var a = a || {};
    a.Cursor = function() {
        "use strict";

        function a(a, b) {
            this.position = a, this.selectionEnd = b
        }
        return a.fromJSON = function(b) {
            return new a(b.position, b.selectionEnd)
        }, a.prototype.equals = function(a) {
            return this.position === a.position && this.selectionEnd === a.selectionEnd
        }, a.prototype.compose = function(a) {
            return a
        }, a.prototype.transform = function(b) {
            function c(a) {
                for (var c = a, d = b.ops, e = 0, f = b.ops.length; f > e && (d[e].isRetain() ? a -= d[e].chars : d[e].isInsert() ? c += d[e].text.length : (c -= Math.min(a, d[e].chars), a -= d[e].chars), !(0 > a)); e++);
                return c
            }
            var d = c(this.position);
            return this.position === this.selectionEnd ? new a(d, d) : new a(d, c(this.selectionEnd))
        }, a
    }();
    var a = a || {};
    a.FirebaseAdapter = function(b) {
        function c(a, b, c) {
            this.ref_ = a, this.ready_ = !1, this.firebaseCallbacks_ = [], this.zombie_ = !1, this.document_ = new g, this.revision_ = 0, this.pendingReceivedRevisions_ = {};
            var d = this;
            b ? (this.setUserId(b), this.setColor(c), this.firebaseOn_(a.root().child(".info/connected"), "value", function(a) {
                a.val() === !0 && d.initializeUserData_()
            }, this), this.on("ready", function() {
                d.monitorCursors_()
            })) : this.userId_ = a.push().key(), setTimeout(function() {
                d.monitorHistory_()
            }, 0)
        }

        function d(a, b) {
            if (!a) throw new Error(b || "assertion error")
        }

        function e(a) {
            if (0 === a) return "A0";
            for (var b = ""; a > 0;) {
                var c = a % j.length;
                b = j[c] + b, a -= c, a /= j.length
            }
            var d = j[b.length + 9];
            return d + b
        }

        function f(a) {
            d(a.length > 0 && a[0] === j[a.length + 8]);
            for (var b = 0, c = 1; c < a.length; c++) b *= j.length, b += j.indexOf(a[c]);
            return b
        }
        "function" == typeof require && "function" != typeof Firebase && (Firebase = require("firebase"));
        var g = a.TextOperation,
            h = a.utils,
            i = 100;
        h.makeEventEmitter(c, ["ready", "cursor", "operation", "ack", "retry"]), c.prototype.dispose = function() {
            var a = this;
            return this.ready_ ? (this.removeFirebaseCallbacks_(), this.userRef_ && (this.userRef_.child("cursor").remove(), this.userRef_.child("color").remove()), this.ref_ = null, this.document_ = null, void(this.zombie_ = !0)) : void this.on("ready", function() {
                a.dispose()
            })
        }, c.prototype.setUserId = function(a) {
            this.userRef_ && (this.userRef_.child("cursor").remove(), this.userRef_.child("cursor").onDisconnect().cancel(), this.userRef_.child("color").remove(), this.userRef_.child("color").onDisconnect().cancel()), this.userId_ = a, this.userRef_ = this.ref_.child("users").child(a), this.initializeUserData_()
        }, c.prototype.isHistoryEmpty = function() {
            return d(this.ready_, "Not ready yet."), 0 === this.revision_
        }, c.prototype.sendOperation = function(a, b) {
            function c(a, d) {
                f.ref_.child("history").child(a).transaction(function(a) {
                    return null === a ? d : void 0
                }, function(e, g, i) {
                    if (e) {
                        if ("disconnect" !== e.message) throw h.log("Transaction failure!", e), e;
                        f.sent_ && f.sent_.id === a ? setTimeout(function() {
                            c(a, d)
                        }, 0) : b && b(e, !1)
                    } else b && b(null, g)
                }, !1)
            }
            var f = this;
            if (!this.ready_) return void this.on("ready", function() {
                f.trigger("retry")
            });
            d(this.document_.targetLength === a.baseLength, "sendOperation() called with invalid operation.");
            var g = e(this.revision_);
            this.sent_ = {
                id: g,
                op: a
            }, c(g, {
                a: f.userId_,
                o: a.toJSON(),
                t: Firebase.ServerValue.TIMESTAMP
            })
        }, c.prototype.sendCursor = function(a) {
            this.userRef_.child("cursor").set(a), this.cursor_ = a
        }, c.prototype.setColor = function(a) {
            this.userRef_.child("color").set(a), this.color_ = a
        }, c.prototype.getDocument = function() {
            return this.document_
        }, c.prototype.registerCallbacks = function(a) {
            for (var b in a) this.on(b, a[b])
        }, c.prototype.initializeUserData_ = function() {
            this.userRef_.child("cursor").onDisconnect().remove(), this.userRef_.child("color").onDisconnect().remove(), this.sendCursor(this.cursor_ || null), this.setColor(this.color_ || null)
        }, c.prototype.monitorCursors_ = function() {
            function a(a) {
                var b = a.key(),
                    d = a.val();
                c.trigger("cursor", b, d.cursor, d.color)
            }
            var b = this.ref_.child("users"),
                c = this;
            this.firebaseOn_(b, "child_added", a), this.firebaseOn_(b, "child_changed", a), this.firebaseOn_(b, "child_removed", function(a) {
                var b = a.key();
                c.trigger("cursor", b, null)
            })
        }, c.prototype.monitorHistory_ = function() {
            var a = this;
            this.ref_.child("checkpoint").once("value", function(b) {
                if (!a.zombie_) {
                    var c = b.child("id").val(),
                        d = b.child("o").val(),
                        e = b.child("a").val();
                    null != d && null != c && null !== e ? (a.pendingReceivedRevisions_[c] = {
                        o: d,
                        a: e
                    }, a.checkpointRevision_ = f(c), a.monitorHistoryStartingAt_(a.checkpointRevision_ + 1)) : (a.checkpointRevision_ = 0, a.monitorHistoryStartingAt_(a.checkpointRevision_))
                }
            })
        }, c.prototype.monitorHistoryStartingAt_ = function(a) {
            var b = this.ref_.child("history").startAt(null, e(a)),
                c = this;
            setTimeout(function() {
                c.firebaseOn_(b, "child_added", function(a) {
                    var b = a.key();
                    c.pendingReceivedRevisions_[b] = a.val(), c.ready_ && c.handlePendingReceivedRevisions_()
                }), b.once("value", function() {
                    c.handleInitialRevisions_()
                })
            }, 0)
        }, c.prototype.handleInitialRevisions_ = function() {
            d(!this.ready_, "Should not be called multiple times."), this.revision_ = this.checkpointRevision_;
            for (var a = e(this.revision_), b = this.pendingReceivedRevisions_; null != b[a];) {
                var c = this.parseRevision_(b[a]);
                c ? this.document_ = this.document_.compose(c.operation) : h.log("Invalid operation.", this.ref_.toString(), a, b[a]), delete b[a], this.revision_++, a = e(this.revision_)
            }
            this.trigger("operation", this.document_), this.ready_ = !0;
            var f = this;
            setTimeout(function() {
                f.trigger("ready")
            }, 0)
        }, c.prototype.handlePendingReceivedRevisions_ = function() {
            for (var a = this.pendingReceivedRevisions_, b = e(this.revision_), c = !1; null != a[b];) {
                this.revision_++;
                var d = this.parseRevision_(a[b]);
                d ? (this.document_ = this.document_.compose(d.operation), this.sent_ && b === this.sent_.id ? this.sent_.op.equals(d.operation) && d.author === this.userId_ ? (this.revision_ % i === 0 && this.saveCheckpoint_(), this.sent_ = null, this.trigger("ack")) : (c = !0, this.trigger("operation", d.operation)) : this.trigger("operation", d.operation)) : h.log("Invalid operation.", this.ref_.toString(), b, a[b]), delete a[b], b = e(this.revision_)
            }
            c && (this.sent_ = null, this.trigger("retry"))
        }, c.prototype.parseRevision_ = function(a) {
            if ("object" != typeof a) return null;
            if ("string" != typeof a.a || "object" != typeof a.o) return null;
            var b = null;
            try {
                b = g.fromJSON(a.o)
            } catch (c) {
                return null
            }
            return b.baseLength !== this.document_.targetLength ? null : {
                author: a.a,
                operation: b
            }
        }, c.prototype.saveCheckpoint_ = function() {
            this.ref_.child("checkpoint").set({
                a: this.userId_,
                o: this.document_.toJSON(),
                id: e(this.revision_ - 1)
            })
        }, c.prototype.firebaseOn_ = function(a, b, c, d) {
            return this.firebaseCallbacks_.push({
                ref: a,
                eventType: b,
                callback: c,
                context: d
            }), a.on(b, c, d), c
        }, c.prototype.firebaseOff_ = function(a, b, c, d) {
            a.off(b, c, d);
            for (var e = 0; e < this.firebaseCallbacks_.length; e++) {
                var f = this.firebaseCallbacks_[e];
                if (f.ref === a && f.eventType === b && f.callback === c && f.context === d) {
                    this.firebaseCallbacks_.splice(e, 1);
                    break
                }
            }
        }, c.prototype.removeFirebaseCallbacks_ = function() {
            for (var a = 0; a < this.firebaseCallbacks_.length; a++) {
                var b = this.firebaseCallbacks_[a];
                b.ref.off(b.eventType, b.callback, b.context)
            }
            this.firebaseCallbacks_ = []
        };
        var j = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        return c
    }();
    var a = a || {};
    a.RichTextToolbar = function(b) {
        function c(a) {
            this.imageInsertionUI = a, this.element_ = this.makeElement_()
        }
        var d = a.utils;
        return d.makeEventEmitter(c, ["bold", "italic", "underline", "strike", "font", "font-size", "color", "left", "center", "right", "unordered-list", "ordered-list", "todo-list", "indent-increase", "indent-decrease", "undo", "redo", "insert-image"]), c.prototype.element = function() {
            return this.element_
        }, c.prototype.makeButton_ = function(a, b) {
            var c = this;
            b = b || a;
            var e = d.elt("a", [d.elt("span", "", {
                "class": "firepad-tb-" + b
            })], {
                "class": "firepad-btn"
            });
            return d.on(e, "click", d.stopEventAnd(function() {
                c.trigger(a)
            })), e
        }, c.prototype.makeElement_ = function() {
            var a = this,
                b = this.makeFontDropdown_(),
                c = this.makeFontSizeDropdown_(),
                e = this.makeColorDropdown_(),
                f = [d.elt("div", [b], {
                    "class": "firepad-btn-group"
                }), d.elt("div", [c], {
                    "class": "firepad-btn-group"
                }), d.elt("div", [e], {
                    "class": "firepad-btn-group"
                }), d.elt("div", [a.makeButton_("bold"), a.makeButton_("italic"), a.makeButton_("underline"), a.makeButton_("strike", "strikethrough")], {
                    "class": "firepad-btn-group"
                }), d.elt("div", [a.makeButton_("unordered-list", "list-2"), a.makeButton_("ordered-list", "numbered-list"), a.makeButton_("todo-list", "list")], {
                    "class": "firepad-btn-group"
                }), d.elt("div", [a.makeButton_("indent-decrease"), a.makeButton_("indent-increase")], {
                    "class": "firepad-btn-group"
                }), d.elt("div", [a.makeButton_("left", "paragraph-left"), a.makeButton_("center", "paragraph-center"), a.makeButton_("right", "paragraph-right")], {
                    "class": "firepad-btn-group"
                }), d.elt("div", [a.makeButton_("undo"), a.makeButton_("redo")], {
                    "class": "firepad-btn-group"
                })];
            a.imageInsertionUI && f.push(d.elt("div", [a.makeButton_("insert-image")], {
                "class": "firepad-btn-group"
            }));
            var g = d.elt("div", f, {
                    "class": "firepad-toolbar-wrapper"
                }),
                h = d.elt("div", null, {
                    "class": "firepad-toolbar"
                });
            return h.appendChild(g), h
        }, c.prototype.makeFontDropdown_ = function() {
            for (var a = ["Arial", "Comic Sans MS", "Courier New", "Impact", "Times New Roman", "Verdana"], b = [], c = 0; c < a.length; c++) {
                var e = d.elt("span", a[c]);
                e.setAttribute("style", "font-family:" + a[c]), b.push({
                    content: e,
                    value: a[c]
                })
            }
            return this.makeDropdown_("Font", "font", b)
        }, c.prototype.makeFontSizeDropdown_ = function() {
            for (var a = [9, 10, 12, 14, 18, 24, 32, 42], b = [], c = 0; c < a.length; c++) {
                var e = d.elt("span", a[c].toString());
                e.setAttribute("style", "font-size:" + a[c] + "px; line-height:" + (a[c] - 6) + "px;"), b.push({
                    content: e,
                    value: a[c]
                })
            }
            return this.makeDropdown_("Size", "font-size", b, "px")
        }, c.prototype.makeColorDropdown_ = function() {
            for (var a = ["black", "red", "green", "blue", "yellow", "cyan", "magenta", "grey"], b = [], c = 0; c < a.length; c++) {
                var e = d.elt("div");
                e.className = "firepad-color-dropdown-item", e.setAttribute("style", "background-color:" + a[c]), b.push({
                    content: e,
                    value: a[c]
                })
            }
            return this.makeDropdown_("Color", "color", b)
        }, c.prototype.makeDropdown_ = function(a, b, c, e) {
            function f() {
                l || (k.style.display = "block", d.on(document, "click", g, !0), l = !0)
            }

            function g() {
                l && (k.style.display = "", d.off(document, "click", g, !0), l = !1), m = !0, setTimeout(function() {
                    m = !1
                }, 0)
            }

            function h(a, c) {
                "object" != typeof a && (a = document.createTextNode(String(a)));
                var f = d.elt("a", [a]);
                d.on(f, "click", d.stopEventAnd(function() {
                    g(), i.trigger(b, c + e)
                })), k.appendChild(f)
            }
            e = e || "";
            var i = this,
                j = d.elt("a", a + " ▾", {
                    "class": "firepad-btn firepad-dropdown"
                }),
                k = d.elt("ul", [], {
                    "class": "firepad-dropdown-menu"
                });
            j.appendChild(k);
            for (var l = !1, m = !1, n = 0; n < c.length; n++) {
                var o = c[n].content,
                    p = c[n].value;
                h(o, p)
            }
            return d.on(j, "click", d.stopEventAnd(function() {
                m || f()
            })), j
        }, c
    }();
    var a = a || {};
    a.WrappedOperation = function(a) {
        "use strict";

        function b(a, b) {
            this.wrapped = a, this.meta = b
        }

        function c(a, b) {
            for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c])
        }

        function d(a, b) {
            if (a && "object" == typeof a) {
                if ("function" == typeof a.compose) return a.compose(b);
                var d = {};
                return c(a, d), c(b, d), d
            }
            return b
        }

        function e(a, b) {
            return a && "object" == typeof a && "function" == typeof a.transform ? a.transform(b) : a
        }
        return b.prototype.apply = function() {
            return this.wrapped.apply.apply(this.wrapped, arguments)
        }, b.prototype.invert = function() {
            var a = this.meta;
            return new b(this.wrapped.invert.apply(this.wrapped, arguments), a && "object" == typeof a && "function" == typeof a.invert ? a.invert.apply(a, arguments) : a)
        }, b.prototype.compose = function(a) {
            return new b(this.wrapped.compose(a.wrapped), d(this.meta, a.meta))
        }, b.transform = function(a, c) {
            var d = a.wrapped.constructor.transform,
                f = d(a.wrapped, c.wrapped);
            return [new b(f[0], e(a.meta, c.wrapped)), new b(f[1], e(c.meta, a.wrapped))]
        }, b
    }();
    var a = a || {};
    a.UndoManager = function() {
        "use strict";

        function a(a) {
            this.maxItems = a || 50, this.state = c, this.dontCompose = !1, this.undoStack = [], this.redoStack = []
        }

        function b(a, b) {
            for (var c = [], d = b.constructor, e = a.length - 1; e >= 0; e--) {
                var f = d.transform(a[e], b);
                "function" == typeof f[0].isNoop && f[0].isNoop() || c.push(f[0]), b = f[1]
            }
            return c.reverse()
        }
        var c = "normal",
            d = "undoing",
            e = "redoing";
        return a.prototype.add = function(a, b) {
            if (this.state === d) this.redoStack.push(a), this.dontCompose = !0;
            else if (this.state === e) this.undoStack.push(a), this.dontCompose = !0;
            else {
                var c = this.undoStack;
                !this.dontCompose && b && c.length > 0 ? c.push(a.compose(c.pop())) : (c.push(a), c.length > this.maxItems && c.shift()), this.dontCompose = !1, this.redoStack = []
            }
        }, a.prototype.transform = function(a) {
            this.undoStack = b(this.undoStack, a), this.redoStack = b(this.redoStack, a)
        }, a.prototype.performUndo = function(a) {
            if (this.state = d, 0 === this.undoStack.length) throw new Error("undo not possible");
            a(this.undoStack.pop()), this.state = c
        }, a.prototype.performRedo = function(a) {
            if (this.state = e, 0 === this.redoStack.length) throw new Error("redo not possible");
            a(this.redoStack.pop()), this.state = c
        }, a.prototype.canUndo = function() {
            return 0 !== this.undoStack.length
        }, a.prototype.canRedo = function() {
            return 0 !== this.redoStack.length
        }, a.prototype.isUndoing = function() {
            return this.state === d
        }, a.prototype.isRedoing = function() {
            return this.state === e
        }, a
    }();
    var a = a || {};
    a.Client = function() {
        "use strict";

        function a() {
            this.state = e
        }

        function b() {}

        function c(a) {
            this.outstanding = a
        }

        function d(a, b) {
            this.outstanding = a, this.buffer = b
        }
        a.prototype.setState = function(a) {
            this.state = a
        }, a.prototype.applyClient = function(a) {
            this.setState(this.state.applyClient(this, a))
        }, a.prototype.applyServer = function(a) {
            this.setState(this.state.applyServer(this, a))
        }, a.prototype.serverAck = function() {
            this.setState(this.state.serverAck(this))
        }, a.prototype.serverRetry = function() {
            this.setState(this.state.serverRetry(this))
        }, a.prototype.sendOperation = function(a) {
            throw new Error("sendOperation must be defined in child class")
        }, a.prototype.applyOperation = function(a) {
            throw new Error("applyOperation must be defined in child class")
        }, a.Synchronized = b, b.prototype.applyClient = function(a, b) {
            return a.sendOperation(b), new c(b)
        }, b.prototype.applyServer = function(a, b) {
            return a.applyOperation(b), this
        }, b.prototype.serverAck = function(a) {
            throw new Error("There is no pending operation.")
        }, b.prototype.serverRetry = function(a) {
            throw new Error("There is no pending operation.")
        };
        var e = new b;
        return a.AwaitingConfirm = c, c.prototype.applyClient = function(a, b) {
            return new d(this.outstanding, b)
        }, c.prototype.applyServer = function(a, b) {
            var d = b.constructor.transform(this.outstanding, b);
            return a.applyOperation(d[1]), new c(d[0])
        }, c.prototype.serverAck = function(a) {
            return e
        }, c.prototype.serverRetry = function(a) {
            return a.sendOperation(this.outstanding), this
        }, a.AwaitingWithBuffer = d, d.prototype.applyClient = function(a, b) {
            var c = this.buffer.compose(b);
            return new d(this.outstanding, c)
        }, d.prototype.applyServer = function(a, b) {
            var c = b.constructor.transform,
                e = c(this.outstanding, b),
                f = c(this.buffer, e[1]);
            return a.applyOperation(f[1]), new d(e[0], f[0])
        }, d.prototype.serverRetry = function(a) {
            var b = this.outstanding.compose(this.buffer);
            return a.sendOperation(b), new c(b)
        }, d.prototype.serverAck = function(a) {
            return a.sendOperation(this.buffer), new c(this.buffer)
        }, a
    }();
    var a = a || {};
    a.EditorClient = function() {
        "use strict";

        function b(a, b) {
            this.cursorBefore = a, this.cursorAfter = b
        }

        function c(a, b) {
            this.id = a, this.editorAdapter = b, this.li = document.createElement("li")
        }

        function d(a, b) {
            g.call(this), this.serverAdapter = a, this.editorAdapter = b, this.undoManager = new i, this.clients = {};
            var c = this;
            this.editorAdapter.registerCallbacks({
                change: function(a, b) {
                    c.onChange(a, b)
                },
                cursorActivity: function() {
                    c.onCursorActivity()
                },
                blur: function() {
                    c.onBlur()
                },
                focus: function() {
                    c.onFocus()
                }
            }), this.editorAdapter.registerUndo(function() {
                c.undo()
            }), this.editorAdapter.registerRedo(function() {
                c.redo()
            }), this.serverAdapter.registerCallbacks({
                ack: function() {
                    c.serverAck(), c.focused && c.state instanceof g.Synchronized && (c.updateCursor(), c.sendCursor(c.cursor)), c.emitStatus()
                },
                retry: function() {
                    c.serverRetry()
                },
                operation: function(a) {
                    c.applyServer(a)
                },
                cursor: function(a, b, d) {
                    if (c.serverAdapter.userId_ !== a && c.state instanceof g.Synchronized) {
                        var e = c.getClientObject(a);
                        b ? (d && e.setColor(d), e.updateCursor(h.fromJSON(b))) : e.removeCursor()
                    }
                }
            })
        }

        function e(a, b) {
            function c() {}
            c.prototype = b.prototype,
                a.prototype = new c, a.prototype.constructor = a
        }

        function f(a) {
            return a[a.length - 1]
        }
        var g = a.Client,
            h = a.Cursor,
            i = a.UndoManager,
            j = a.WrappedOperation;
        return b.prototype.invert = function() {
            return new b(this.cursorAfter, this.cursorBefore)
        }, b.prototype.compose = function(a) {
            return new b(this.cursorBefore, a.cursorAfter)
        }, b.prototype.transform = function(a) {
            return new b(this.cursorBefore ? this.cursorBefore.transform(a) : null, this.cursorAfter ? this.cursorAfter.transform(a) : null)
        }, c.prototype.setColor = function(a) {
            this.color = a
        }, c.prototype.updateCursor = function(a) {
            this.removeCursor(), this.cursor = a, this.mark = this.editorAdapter.setOtherCursor(a, this.color, this.id)
        }, c.prototype.removeCursor = function() {
            this.mark && this.mark.clear()
        }, e(d, g), d.prototype.getClientObject = function(a) {
            var b = this.clients[a];
            return b ? b : this.clients[a] = new c(a, this.editorAdapter)
        }, d.prototype.applyUnredo = function(a) {
            this.undoManager.add(this.editorAdapter.invertOperation(a)), this.editorAdapter.applyOperation(a.wrapped), this.cursor = a.meta.cursorAfter, this.cursor && this.editorAdapter.setCursor(this.cursor), this.applyClient(a.wrapped)
        }, d.prototype.undo = function() {
            var a = this;
            this.undoManager.canUndo() && this.undoManager.performUndo(function(b) {
                a.applyUnredo(b)
            })
        }, d.prototype.redo = function() {
            var a = this;
            this.undoManager.canRedo() && this.undoManager.performRedo(function(b) {
                a.applyUnredo(b)
            })
        }, d.prototype.onChange = function(a, c) {
            var d = this.cursor;
            this.updateCursor();
            var e = this.undoManager.undoStack.length > 0 && c.shouldBeComposedWithInverted(f(this.undoManager.undoStack).wrapped),
                g = new b(this.cursor, d);
            this.undoManager.add(new j(c, g), e), this.applyClient(a)
        }, d.prototype.updateCursor = function() {
            this.cursor = this.editorAdapter.getCursor()
        }, d.prototype.onCursorActivity = function() {
            var a = this.cursor;
            this.updateCursor(), !this.focused || a && this.cursor.equals(a) || this.sendCursor(this.cursor)
        }, d.prototype.onBlur = function() {
            this.cursor = null, this.sendCursor(null), this.focused = !1
        }, d.prototype.onFocus = function() {
            this.focused = !0, this.onCursorActivity()
        }, d.prototype.sendCursor = function(a) {
            this.state instanceof g.AwaitingWithBuffer || this.serverAdapter.sendCursor(a)
        }, d.prototype.sendOperation = function(a) {
            this.serverAdapter.sendOperation(a), this.emitStatus()
        }, d.prototype.applyOperation = function(a) {
            this.editorAdapter.applyOperation(a), this.updateCursor(), this.undoManager.transform(new j(a, null))
        }, d.prototype.emitStatus = function() {
            var a = this;
            setTimeout(function() {
                a.trigger("synced", a.state instanceof g.Synchronized)
            }, 0)
        }, d
    }(), a.utils.makeEventEmitter(a.EditorClient, ["synced"]);
    var a, b = function(a, b) {
            return function() {
                return a.apply(b, arguments)
            }
        },
        c = [].slice;
    ("undefined" == typeof a || null === a) && (a = {}), a.ACEAdapter = function() {
        function d(a) {
            this.onCursorActivity = b(this.onCursorActivity, this), this.onFocus = b(this.onFocus, this), this.onBlur = b(this.onBlur, this), this.onChange = b(this.onChange, this);
            var c;
            this.ace = a, this.aceSession = this.ace.getSession(), this.aceDoc = this.aceSession.getDocument(), this.aceDoc.setNewLineMode("unix"), this.grabDocumentState(), this.ace.on("change", this.onChange), this.ace.on("blur", this.onBlur), this.ace.on("focus", this.onFocus), this.aceSession.selection.on("changeCursor", this.onCursorActivity), null == this.aceRange && (this.aceRange = (null != (c = ace.require) ? c : require)("ace/range").Range)
        }
        return d.prototype.ignoreChanges = !1, d.prototype.grabDocumentState = function() {
            return this.lastDocLines = this.aceDoc.getAllLines(), this.lastCursorRange = this.aceSession.selection.getRange()
        }, d.prototype.detach = function() {
            return this.ace.removeListener("change", this.onChange), this.ace.removeListener("blur", this.onBlur), this.ace.removeListener("focus", this.onCursorActivity), this.aceSession.selection.removeListener("changeCursor", this.onCursorActivity)
        }, d.prototype.onChange = function(a) {
            var b;
            return this.ignoreChanges ? void 0 : (b = this.operationFromACEChange(a), this.trigger.apply(this, ["change"].concat(c.call(b))), this.grabDocumentState())
        }, d.prototype.onBlur = function() {
            return this.ace.selection.isEmpty() ? this.trigger("blur") : void 0
        }, d.prototype.onFocus = function() {
            return this.trigger("focus")
        }, d.prototype.onCursorActivity = function() {
            var a = this;
            return setTimeout(function() {
                return a.trigger("cursorActivity")
            }, 0)
        }, d.prototype.operationFromACEChange = function(b) {
            var c, d, e, f, g, h, i, j;
            return b.data ? (e = b.data, "insertLines" === (j = e.action) || "removeLines" === j ? (i = e.lines.join("\n") + "\n", c = e.action.replace("Lines", "")) : (i = e.text.replace(this.aceDoc.getNewLineCharacter(), "\n"), c = e.action.replace("Text", "")), h = this.indexFromPos(e.range.start)) : (i = b.lines.join("\n"), h = this.indexFromPos(b.start)), g = this.lastDocLines.join("\n").length - h, "remove" === b.action && (g -= i.length), f = (new a.TextOperation).retain(h).insert(i).retain(g), d = (new a.TextOperation).retain(h)["delete"](i).retain(g), "remove" === b.action ? [d, f] : [f, d]
        }, d.prototype.applyOperationToACE = function(a) {
            var b, c, d, e, f, g, h, i;
            for (c = 0, i = a.ops, g = 0, h = i.length; h > g; g++) d = i[g], d.isRetain() ? c += d.chars : d.isInsert() ? (this.aceDoc.insert(this.posFromIndex(c), d.text), c += d.text.length) : d.isDelete() && (b = this.posFromIndex(c), f = this.posFromIndex(c + d.chars), e = this.aceRange.fromPoints(b, f), this.aceDoc.remove(e));
            return this.grabDocumentState()
        }, d.prototype.posFromIndex = function(a) {
            var b, c, d, e, f;
            for (f = this.aceDoc.$lines, c = d = 0, e = f.length; e > d && (b = f[c], !(a <= b.length)); c = ++d) a -= b.length + 1;
            return {
                row: c,
                column: a
            }
        }, d.prototype.indexFromPos = function(a, b) {
            var c, d, e, f;
            for (null == b && (b = this.lastDocLines), d = 0, c = e = 0, f = a.row; f >= 0 ? f > e : e > f; c = f >= 0 ? ++e : --e) d += this.lastDocLines[c].length + 1;
            return d += a.column
        }, d.prototype.getValue = function() {
            return this.aceDoc.getValue()
        }, d.prototype.getCursor = function() {
            var b, c, d, e, f, g;
            try {
                e = this.indexFromPos(this.aceSession.selection.getRange().start, this.aceDoc.$lines), d = this.indexFromPos(this.aceSession.selection.getRange().end, this.aceDoc.$lines)
            } catch (h) {
                b = h;
                try {
                    e = this.indexFromPos(this.lastCursorRange.start), d = this.indexFromPos(this.lastCursorRange.end)
                } catch (h) {
                    c = h, console.log("Couldn't figure out the cursor range:", c, "-- setting it to 0:0."), f = [0, 0], e = f[0], d = f[1]
                }
            }
            return e > d && (g = [d, e], e = g[0], d = g[1]), new a.Cursor(e, d)
        }, d.prototype.setCursor = function(a) {
            var b, c, d;
            return c = this.posFromIndex(a.position), b = this.posFromIndex(a.selectionEnd), a.position > a.selectionEnd && (d = [b, c], c = d[0], b = d[1]), this.aceSession.selection.setSelectionRange(new this.aceRange(c.row, c.column, b.row, b.column))
        }, d.prototype.setOtherCursor = function(a, b, c) {
            var d, e, f, g, h, i, j, k, l = this;
            return null == this.otherCursors && (this.otherCursors = {}), f = this.otherCursors[c], f && (f.start.detach(), f.end.detach(), this.aceSession.removeMarker(f.id)), j = this.posFromIndex(a.position), g = this.posFromIndex(a.selectionEnd), a.selectionEnd < a.position && (k = [g, j], j = k[0], g = k[1]), d = "other-client-selection-" + b.replace("#", ""), h = a.position === a.selectionEnd, h && (d = d.replace("selection", "cursor")), e = "." + d + " {\n  position: absolute;\n  background-color: " + (h ? "transparent" : b) + ";\n  border-left: 2px solid " + b + ";\n}", this.addStyleRule(e), this.otherCursors[c] = f = new this.aceRange(j.row, j.column, g.row, g.column), i = this, f.clipRows = function() {
                var a;
                return a = i.aceRange.prototype.clipRows.apply(this, arguments), a.isEmpty = function() {
                    return !1
                }, a
            }, f.start = this.aceDoc.createAnchor(f.start), f.end = this.aceDoc.createAnchor(f.end), f.id = this.aceSession.addMarker(f, d, "text"), {
                clear: function() {
                    return f.start.detach(), f.end.detach(), l.aceSession.removeMarker(f.id)
                }
            }
        }, d.prototype.addStyleRule = function(a) {
            var b;
            if ("undefined" != typeof document && null !== document && (this.addedStyleRules || (this.addedStyleRules = {}, b = document.createElement("style"), document.documentElement.getElementsByTagName("head")[0].appendChild(b), this.addedStyleSheet = b.sheet), !this.addedStyleRules[a])) return this.addedStyleRules[a] = !0, this.addedStyleSheet.insertRule(a, 0)
        }, d.prototype.registerCallbacks = function(a) {
            this.callbacks = a
        }, d.prototype.trigger = function() {
            var a, b, d, e;
            return b = arguments[0], a = 2 <= arguments.length ? c.call(arguments, 1) : [], null != (d = this.callbacks) && null != (e = d[b]) ? e.apply(this, a) : void 0
        }, d.prototype.applyOperation = function(a) {
            return a.isNoop() || (this.ignoreChanges = !0), this.applyOperationToACE(a), this.ignoreChanges = !1
        }, d.prototype.registerUndo = function(a) {
            return this.ace.undo = a
        }, d.prototype.registerRedo = function(a) {
            return this.ace.redo = a
        }, d.prototype.invertOperation = function(a) {
            return a.invert(this.getValue())
        }, d
    }();
    var a = a || {};
    a.AttributeConstants = {
        BOLD: "b",
        ITALIC: "i",
        UNDERLINE: "u",
        STRIKE: "s",
        FONT: "f",
        FONT_SIZE: "fs",
        COLOR: "c",
        BACKGROUND_COLOR: "bc",
        ENTITY_SENTINEL: "ent",
        LINE_SENTINEL: "l",
        LINE_INDENT: "li",
        LINE_ALIGN: "la",
        LIST_TYPE: "lt"
    }, a.sentinelConstants = {
        LINE_SENTINEL_CHARACTER: "",
        ENTITY_SENTINEL_CHARACTER: ""
    };
    var a = a || {};
    a.EntityManager = function() {
        function b() {
            this.entities_ = {};
            var a = [ "src", "alt", "width", "height", "style", "class"];
            this.register("a", {
                render: function(a) {
                    c.assert(a.src, "image entity should have 'src'!");
                    for (var b = ["src", "alt", "width", "height", "style", "class"], d = "<img ", e = 0; e < b.length; e++) {
                        var f = b[e];
                        f in a && (d += " " + f + '="' + a[f] + '"')
                    }
                    return d += ">"
                },
                fromElement: function(b) {
                    for (var c = {}, d = 0; d < a.length; d++) {
                        var e = a[d];
                        b.hasAttribute(e) && (c[e] = b.getAttribute(e))
                    }
                    return c
                }
            })
			
			
			
		
			
			
			
        }
        var c = a.utils;
        return b.prototype.register = function(b, c) {
            a.utils.assert(c.render, "Entity options should include a 'render' function!"), a.utils.assert(c.fromElement, "Entity options should include a 'fromElement' function!"), this.entities_[b] = c
        }, b.prototype.renderToElement = function(a, b) {
            return this.tryRenderToElement_(a, "render", b)
        }, b.prototype.exportToElement = function(a) {
            var b = this.tryRenderToElement_(a, "export") || this.tryRenderToElement_(a, "getHtml") || this.tryRenderToElement_(a, "render");
            return b.setAttribute("data-firepad-entity", a.type), b
        }, b.prototype.updateElement = function(a, b) {
            var c = a.type,
                d = a.info;
            this.entities_[c] && "undefined" != typeof this.entities_[c].update && this.entities_[c].update(d, b)
        }, b.prototype.fromElement = function(b) {
            var c = b.getAttribute("data-firepad-entity");
            if (c || (c = b.nodeName.toLowerCase()), c && this.entities_[c]) {
                var d = this.entities_[c].fromElement(b);
                return new a.Entity(c, d)
            }
        }, b.prototype.tryRenderToElement_ = function(b, c, d) {
            var e = b.type,
                f = b.info;
            if (this.entities_[e] && this.entities_[e][c]) {
                var g = a.document || window && window.document,
                    h = this.entities_[e][c](f, d, g);
                if (h) {
                    if ("string" == typeof h) {
                        var i = (a.document || document).createElement("div");
                        return i.innerHTML = h, i.childNodes[0]
                    }
                    if ("object" == typeof h) return a.utils.assert("undefined" != typeof h.nodeType, "Error rendering " + e + " entity.  render() function must return an html string or a DOM element."), h
                }
            }
        }, b.prototype.entitySupportsUpdate = function(a) {
            return this.entities_[a] && this.entities_[a].update
        }, b
    }();
    var a = a || {};
    a.Entity = function() {
        function b(a, c) {
            return this instanceof b ? (this.type = a, void(this.info = c || {})) : new b(a, c)
        }
        var c = a.AttributeConstants,
            d = c.ENTITY_SENTINEL,
            e = d + "_";
        return b.prototype.toAttributes = function() {
            var a = {};
            a[d] = this.type;
            for (var b in this.info) a[e + b] = this.info[b];
            return a
        }, b.fromAttributes = function(a) {
            var c = a[d],
                f = {};
            for (var g in a) 0 === g.indexOf(e) && (f[g.substr(e.length)] = a[g]);
            return new b(c, f)
        }, b
    }();
    var a = a || {};
    a.RichTextCodeMirror = function() {
        function b(a, b, c) {
            this.codeMirror = a, this.options_ = c || {}, this.entityManager_ = b, this.currentAttributes_ = null;
            var d = this;
            this.annotationList_ = new j(function(a, b) {
                d.onAnnotationsChanged_(a, b)
            }), this.initAnnotationList_(), i(this, "onCodeMirrorBeforeChange_"), i(this, "onCodeMirrorChange_"), i(this, "onCursorActivity_"), parseInt(CodeMirror.version) >= 4 ? this.codeMirror.on("changes", this.onCodeMirrorChange_) : this.codeMirror.on("change", this.onCodeMirrorChange_), this.codeMirror.on("beforeChange", this.onCodeMirrorBeforeChange_), this.codeMirror.on("cursorActivity", this.onCursorActivity_), this.changeId_ = 0, this.outstandingChanges_ = {}, this.dirtyLines_ = []
        }

        function c(a, b) {
            return a.line - b.line || a.ch - b.ch
        }

        function d(a, b) {
            return c(a, b) <= 0
        }

        function e(a) {
            return a[a.length - 1]
        }

        function f(a) {
            if (0 === a.length) return 0;
            for (var b = 0, c = 0; c < a.length; c++) b += a[c].length;
            return b + a.length - 1
        }

        function g(a) {
            this.attributes = a || {}
        }

        function h(a) {
            for (var b in a) return !1;
            return !0
        }

        function i(a, b) {
            var c = a[b];
            a[b] = function() {
                c.apply(a, arguments)
            }
        }
        var j = a.AnnotationList,
            k = a.Span,
            l = a.utils,
            m = a.AttributeConstants,
            n = "cmrt-",
            o = "cmrt-",
            p = {
                c: "color",
                bc: "background-color",
                fs: "font-size",
                li: function(a) {
                    return "padding-left: " + 40 * a + "px"
                }
            },
            q = {};
        l.makeEventEmitter(b, ["change", "attributesChange", "newLine"]);
        var r = a.sentinelConstants.LINE_SENTINEL_CHARACTER,
            s = a.sentinelConstants.ENTITY_SENTINEL_CHARACTER;
        return b.prototype.detach = function() {
            this.codeMirror.off("beforeChange", this.onCodeMirrorBeforeChange_), this.codeMirror.off("change", this.onCodeMirrorChange_), this.codeMirror.off("changes", this.onCodeMirrorChange_), this.codeMirror.off("cursorActivity", this.onCursorActivity_), this.clearAnnotations_()
        }, b.prototype.toggleAttribute = function(a, b) {
            var c = b || !0;
            if (this.emptySelection_()) {
                var d = this.getCurrentAttributes_();
                d[a] === c ? delete d[a] : d[a] = c, this.currentAttributes_ = d
            } else {
                var e = this.getCurrentAttributes_(),
                    f = e[a] !== c ? c : !1;
                this.setAttribute(a, f)
            }
        }, b.prototype.setAttribute = function(a, b) {
            var c = this.codeMirror;
            if (this.emptySelection_()) {
                var d = this.getCurrentAttributes_();
                b === !1 ? delete d[a] : d[a] = b, this.currentAttributes_ = d
            } else this.updateTextAttributes(c.indexFromPos(c.getCursor("start")), c.indexFromPos(c.getCursor("end")), function(c) {
                b === !1 ? delete c[a] : c[a] = b
            }), this.updateCurrentAttributes_()
        }, b.prototype.updateTextAttributes = function(a, b, c, d, e) {
            var f = [],
                i = a,
                j = this;
            this.annotationList_.updateSpan(new k(a, b - a), function(a, b) {
                var k = {};
                for (var l in a.attributes) k[l] = a.attributes[l];
                (!k[m.LINE_SENTINEL] || e) && c(k);
                var n = {},
                    o = {};
                return j.computeChangedAttributes_(a.attributes, k, n, o), h(n) || f.push({
                    start: i,
                    end: i + b,
                    attributes: n,
                    attributesInverse: o,
                    origin: d
                }), i += b, new g(k)
            }), f.length > 0 && this.trigger("attributesChange", this, f)
        }, b.prototype.computeChangedAttributes_ = function(a, b, c, d) {
            var e, f = {};
            for (e in a) f[e] = !0;
            for (e in b) f[e] = !0;
            for (e in f) e in b ? e in a ? a[e] !== b[e] && (c[e] = b[e], d[e] = a[e]) : (c[e] = b[e], d[e] = !1) : (c[e] = !1, d[e] = a[e])
        }, b.prototype.toggleLineAttribute = function(a, b) {
            var c, d = this.getCurrentLineAttributes_();
            c = a in d && d[a] === b ? !1 : b, this.setLineAttribute(a, c)
        }, b.prototype.setLineAttribute = function(a, b) {
            this.updateLineAttributesForSelection(function(c) {
                b === !1 ? delete c[a] : c[a] = b
            })
        }, b.prototype.updateLineAttributesForSelection = function(a) {
            var b = this.codeMirror,
                c = b.getCursor("start"),
                d = b.getCursor("end"),
                e = c.line,
                f = d.line,
                g = b.getLine(f),
                h = this.areLineSentinelCharacters_(g.substr(0, d.ch));
            f > e && h && f--, this.updateLineAttributes(e, f, a)
        }, b.prototype.updateLineAttributes = function(a, b, c) {
            for (var d = a; b >= d; d++) {
                var e = this.codeMirror.getLine(d),
                    f = this.codeMirror.indexFromPos({
                        line: d,
                        ch: 0
                    });
                if (e[0] !== r) {
                    var g = {};
                    g[m.LINE_SENTINEL] = !0, c(g), this.insertText(f, r, g)
                } else this.updateTextAttributes(f, f + 1, c, null, !0)
            }
        }, b.prototype.replaceText = function(a, b, c, d, e) {
            this.changeId_++;
            var f = o + this.changeId_;
            this.outstandingChanges_[f] = {
                origOrigin: e,
                attributes: d
            };
            var g = this.codeMirror,
                h = g.posFromIndex(a),
                i = "number" == typeof b ? g.posFromIndex(b) : null;
            g.replaceRange(c, h, i, f)
        }, b.prototype.insertText = function(a, b, c, d) {
            var e = this.codeMirror,
                f = e.getCursor(),
                g = "RTCMADAPTER" == d && !e.somethingSelected() && a == e.indexFromPos(f);
            this.replaceText(a, null, b, c, d), g && e.setCursor(f)
        }, b.prototype.removeText = function(a, b, c) {
            var d = this.codeMirror;
            d.replaceRange("", d.posFromIndex(a), d.posFromIndex(b), c)
        }, b.prototype.insertEntityAtCursor = function(a, b, c) {
            var d = this.codeMirror,
                e = d.indexFromPos(d.getCursor("head"));
            this.insertEntityAt(e, a, b, c)
        }, b.prototype.insertEntityAt = function(b, c, d, e) {
            this.codeMirror;
            this.insertEntity_(b, new a.Entity(c, d), e)
        }, b.prototype.insertEntity_ = function(a, b, c) {
            this.replaceText(a, null, s, b.toAttributes(), c)
        }, b.prototype.getAttributeSpans = function(a, b) {
            for (var c = [], d = this.annotationList_.getAnnotatedSpansForSpan(new k(a, b - a)), e = 0; e < d.length; e++) c.push({
                length: d[e].length,
                attributes: d[e].annotation.attributes
            });
            return c
        }, b.prototype.end = function() {
            var a = this.codeMirror.lineCount() - 1;
            return this.codeMirror.indexFromPos({
                line: a,
                ch: this.codeMirror.getLine(a).length
            })
        }, b.prototype.getRange = function(a, b) {
            var c = this.codeMirror.posFromIndex(a),
                d = this.codeMirror.posFromIndex(b);
            return this.codeMirror.getRange(c, d)
        }, b.prototype.initAnnotationList_ = function() {
            var a = this.end();
            0 !== a && this.annotationList_.insertAnnotatedSpan(new k(0, a), new g)
        }, b.prototype.onAnnotationsChanged_ = function(a, b) {
            var c, d = {};
            this.tryToUpdateEntitiesInPlace(a, b);
            for (var e = 0; e < a.length; e++) {
                var f = a[e].annotation.attributes;
                m.LINE_SENTINEL in f && (d[this.codeMirror.posFromIndex(a[e].pos).line] = !0), c = a[e].getAttachedObject(), c && c.clear()
            }
            for (e = 0; e < b.length; e++) {
                var g = b[e].annotation,
                    h = m.LINE_SENTINEL in g.attributes,
                    i = m.ENTITY_SENTINEL in g.attributes,
                    j = this.codeMirror.posFromIndex(b[e].pos);
                if (h) d[j.line] = !0;
                else if (i) this.markEntity_(b[e]);
                else {
                    var k = this.getClassNameForAttributes_(g.attributes);
                    if ("" !== k) {
                        var l = this.codeMirror.posFromIndex(b[e].pos + b[e].length);
                        c = this.codeMirror.markText(j, l, {
                            className: k
                        }), b[e].attachObject(c)
                    }
                }
            }
            for (var n in d) this.dirtyLines_.push(this.codeMirror.getLineHandle(Number(n))), this.queueLineMarking_()
        }, b.prototype.tryToUpdateEntitiesInPlace = function(a, b) {
            for (var c = a.length; c--;)
                for (var d = a[c], e = b.length; e--;) {
                    var f = b[e];
                    if (d.pos == f.pos && d.length == f.length && d.annotation.attributes.ent && d.annotation.attributes.ent == f.annotation.attributes.ent) {
                        var g = f.annotation.attributes.ent;
                        if (this.entityManager_.entitySupportsUpdate(g)) {
                            a.splice(c, 1), b.splice(e, 1);
                            var h = d.getAttachedObject();
                            h.update(f.annotation.attributes), f.attachObject(h)
                        }
                    }
                }
        }, b.prototype.queueLineMarking_ = function() {
            if (null == this.lineMarkTimeout_) {
                var a = this;
                this.lineMarkTimeout_ = setTimeout(function() {
                    a.lineMarkTimeout_ = null;
                    for (var b = [], c = 0; c < a.dirtyLines_.length; c++) {
                        var d = a.codeMirror.getLineNumber(a.dirtyLines_[c]);
                        b.push(Number(d))
                    }
                    a.dirtyLines_ = [], b.sort(function(a, b) {
                        return a - b
                    });
                    var e = -1;
                    for (c = 0; c < b.length; c++) {
                        var f = b[c];
                        f > e && (e = a.markLineSentinelCharactersForChangedLines_(f, f))
                    }
                }, 0)
            }
        }, b.prototype.addStyleWithCSS_ = function(a) {
            var b = document.getElementsByTagName("head")[0],
                c = document.createElement("style");
            c.type = "text/css", c.styleSheet ? c.styleSheet.cssText = a : c.appendChild(document.createTextNode(a)), b.appendChild(c)
        }, b.prototype.getClassNameForAttributes_ = function(b) {
            var c = "";
            for (var d in b) {
                var e = b[d];
                if (d === m.LINE_SENTINEL) a.utils.assert(e === !0, "LINE_SENTINEL attribute should be true if it exists.");
                else {
                    var f = (this.options_.cssPrefix || n) + d;
                    if (e !== !0) {
                        d === m.FONT_SIZE && "string" != typeof e && (e += "px");
                        var g = e.toString().toLowerCase().replace(/[^a-z0-9-_]/g, "-");
                        if (f += "-" + g, p[d] && (q[d] || (q[d] = {}), !q[d][g])) {
                            q[d][g] = !0;
                            var h = p[d],
                                i = "function" == typeof h ? h(e) : h + ": " + e,
                                j = d == m.LINE_INDENT ? "pre." + f : "." + f;
                            this.addStyleWithCSS_(j + " { " + i + " }")
                        }
                    }
                    c = c + " " + f
                }
            }
            return c
        }, b.prototype.markEntity_ = function(b) {
            for (var c = b.annotation.attributes, d = a.Entity.fromAttributes(c), e = this.codeMirror, f = this, g = [], h = 0; h < b.length; h++) {
                var i = e.posFromIndex(b.pos + h),
                    j = e.posFromIndex(b.pos + h + 1),
                    k = {
                        collapsed: !0,
                        atomic: !0,
                        inclusiveLeft: !1,
                        inclusiveRight: !1
                    },
                    l = this.createEntityHandle_(d, b.pos),
                    m = this.entityManager_.renderToElement(d, l);
                m && (k.replacedWith = m);
                var n = e.markText(i, j, k);
                g.push(n), l.setMarker(n)
            }
            b.attachObject({
                clear: function() {
                    for (var a = 0; a < g.length; a++) g[a].clear()
                },
                update: function(b) {
                    for (var c = a.Entity.fromAttributes(b), d = 0; d < g.length; d++) f.entityManager_.updateElement(c, g[d].replacedWith)
                }
            }), this.queueRefresh_()
        }, b.prototype.queueRefresh_ = function() {
            var a = this;
            this.refreshTimer_ || (this.refreshTimer_ = setTimeout(function() {
                a.codeMirror.refresh(), a.refreshTimer_ = null
            }, 0))
        }, b.prototype.createEntityHandle_ = function(b, c) {
            function d() {
                if (h) {
                    var a = h.find();
                    return a ? i.codeMirror.indexFromPos(a.from) : null
                }
                return c
            }

            function e() {
                var a = d();
                null != a && (i.codeMirror.focus(), i.removeText(a, a + 1))
            }

            function f(c) {
                var e = a.AttributeConstants,
                    f = e.ENTITY_SENTINEL,
                    g = f + "_",
                    h = d();
                i.updateTextAttributes(h, h + 1, function(a) {
                    for (var d in a) delete a[d];
                    a[f] = b.type;
                    for (var e in c) a[g + e] = c[e]
                })
            }

            function g(a) {
                h = a
            }
            var h = null,
                i = this;
            return {
                find: d,
                remove: e,
                replace: f,
                setMarker: g
            }
        }, b.prototype.lineClassRemover_ = function(a) {
            var b = this.codeMirror,
                c = b.getLineHandle(a);
            return {
                clear: function() {
                    b.removeLineClass(c, "text", ".*")
                }
            }
        }, b.prototype.emptySelection_ = function() {
            var a = this.codeMirror.getCursor("start"),
                b = this.codeMirror.getCursor("end");
            return a.line === b.line && a.ch === b.ch
        }, b.prototype.onCodeMirrorBeforeChange_ = function(a, b) {
            if ("+input" === b.origin || "paste" === b.origin) {
                for (var c = [], d = 0; d < b.text.length; d++) {
                    var e = b.text[d];
                    e = e.replace(new RegExp("[" + r + s + "]", "g"), ""), c.push(e)
                }
                b.update(b.from, b.to, c)
            }
        }, b.prototype.onCodeMirrorChange_ = function(a, b) {
            if ("object" == typeof b.from) {
                for (var c = []; b;) c.push(b), b = b.next;
                b = c
            }
            for (var d = this.convertCoordinateSystemForChanges_(b), e = [], f = 0; f < d.length; f++) {
                var h = d[f],
                    i = h.start,
                    j = (h.end, h.text),
                    l = h.removed,
                    m = h.origin;
                if (l.length > 0) {
                    for (var n = this.annotationList_.getAnnotatedSpansForSpan(new k(i, l.length)), o = 0, p = 0; p < n.length; p++) {
                        var q = n[p];
                        e.push({
                            start: i,
                            end: i + q.length,
                            removedAttributes: q.annotation.attributes,
                            removed: l.substr(o, q.length),
                            attributes: {},
                            text: "",
                            origin: h.origin
                        }), o += q.length
                    }
                    this.annotationList_.removeSpan(new k(i, l.length))
                }
                if (j.length > 0) {
                    var r;
                    "+input" === h.origin || "paste" === h.origin ? r = this.currentAttributes_ || {} : m in this.outstandingChanges_ ? (r = this.outstandingChanges_[m].attributes, m = this.outstandingChanges_[m].origOrigin, delete this.outstandingChanges_[m]) : r = {}, this.annotationList_.insertAnnotatedSpan(new k(i, j.length), new g(r)), e.push({
                        start: i,
                        end: i,
                        removedAttributes: {},
                        removed: "",
                        text: j,
                        attributes: r,
                        origin: m
                    })
                }
            }
            this.markLineSentinelCharactersForChanges_(b), e.length > 0 && this.trigger("change", this, e)
        }, b.prototype.convertCoordinateSystemForChanges_ = function(a) {
            function b(a, b) {
                return function(c) {
                    return d(c, b.from) ? a(c) : d(b.to, c) ? a({
                        line: c.line + b.text.length - 1 - (b.to.line - b.from.line),
                        ch: b.to.line < c.line ? c.ch : b.text.length <= 1 ? c.ch - (b.to.ch - b.from.ch) + f(b.text) : c.ch - b.to.ch + e(b.text).length
                    }) + f(b.removed) - f(b.text) : b.from.line === c.line ? a(b.from) + c.ch - b.from.ch : a(b.from) + f(b.removed.slice(0, c.line - b.from.line)) + 1 + c.ch
                }
            }
            for (var c = this, g = function(a) {
                    return c.codeMirror.indexFromPos(a)
                }, h = [], i = a.length - 1; i >= 0; i--) {
                var j = a[i];
                g = b(g, j);
                var k = g(j.from),
                    l = j.removed.join("\n"),
                    m = j.text.join("\n");
                h.unshift({
                    start: k,
                    end: k + l.length,
                    removed: l,
                    text: m,
                    origin: j.origin
                })
            }
            return h
        }, b.prototype.markLineSentinelCharactersForChanges_ = function(a) {
            for (var b = Number.MAX_VALUE, c = -1, d = 0; d < a.length; d++) {
                var e = a[d],
                    f = e.from.line;
                e.from.ch;
                (e.removed.length > 1 || e.removed[0].indexOf(r) >= 0) && (b = Math.min(b, f), c = Math.max(c, f)), e.text.length > 1 ? (b = Math.min(b, f), c = Math.max(c, f + e.text.length - 1)) : e.text[0].indexOf(r) >= 0 && (b = Math.min(b, f), c = Math.max(c, f))
            }
            c = Math.min(c, this.codeMirror.lineCount() - 1), this.markLineSentinelCharactersForChangedLines_(b, c)
        }, b.prototype.markLineSentinelCharactersForChangedLines_ = function(a, b) {
            if (a < Number.MAX_VALUE)
                for (; a > 0 && this.lineIsListItemOrIndented_(a - 1);) a--;
            if (b > -1)
                for (var c = this.codeMirror.lineCount(); c > b + 1 && this.lineIsListItemOrIndented_(b + 1);) b++;
            for (var d = [], e = this.codeMirror, f = a; b >= f; f++) {
                var g = e.getLine(f),
                    h = e.getLineHandle(f);
                if (e.removeLineClass(h, "text", ".*"), g.length > 0)
                    for (var i = g.indexOf(r); i >= 0;) {
                        for (var j = i; i < g.length && g[i] === r;) {
                            for (var k = e.findMarksAt({
                                    line: f,
                                    ch: i
                                }), l = 0; l < k.length; l++) k[l].isForLineSentinel && k[l].clear();
                            i++
                        }
                        this.markLineSentinelCharacters_(f, j, i, d), i = g.indexOf(r, i)
                    } else d = []
            }
            return b
        }, b.prototype.markLineSentinelCharacters_ = function(a, b, c, d) {
            var e = this.codeMirror,
                f = null,
                g = null,
                h = function() {
                    var a = g.find();
                    return a ? a.from.line : null
                };
            if (0 === b) {
                var i = this.getLineAttributes_(a),
                    j = i[m.LIST_TYPE],
                    k = i[m.LINE_INDENT] || 0;
                for (j && 0 === k && (k = 1); k >= d.length;) d.push(1);
                "o" === j ? (f = this.makeOrderedListElement_(d[k]), d[k]++) : "u" === j ? (f = this.makeUnorderedListElement_(), d[k] = 1) : "t" === j ? (f = this.makeTodoListElement_(!1, h), d[k] = 1) : "tc" === j && (f = this.makeTodoListElement_(!0, h), d[k] = 1);
                var l = this.getClassNameForAttributes_(i);
                "" !== l && this.codeMirror.addLineClass(a, "text", l), d = d.slice(0, k + 1)
            }
            var n = {
                inclusiveLeft: !0,
                collapsed: !0
            };
            f && (n.replacedWith = f);
            var g = e.markText({
                line: a,
                ch: b
            }, {
                line: a,
                ch: c
            }, n);
            g.isForLineSentinel = !0
        }, b.prototype.makeOrderedListElement_ = function(a) {
            return l.elt("div", a + ".", {
                "class": "firepad-list-left"
            })
        }, b.prototype.makeUnorderedListElement_ = function() {
            return l.elt("div", "•", {
                "class": "firepad-list-left"
            })
        }, b.prototype.toggleTodo = function(a) {
            var b, c = m.LIST_TYPE,
                d = this.getCurrentLineAttributes_();
            c in d && ("t" === d[c] || "tc" === d[c]) ? "t" === d[c] ? b = "tc" : "tc" === d[c] && (b = a ? "t" : !1) : b = "t", this.setLineAttribute(c, b)
        }, b.prototype.makeTodoListElement_ = function(a, b) {
            var c = {
                type: "checkbox",
                "class": "firepad-todo-left"
            };
            a && (c.checked = !0);
            var d = l.elt("input", !1, c),
                e = this;
            return l.on(d, "click", l.stopEventAnd(function(a) {
                e.codeMirror.setCursor({
                    line: b(),
                    ch: 1
                }), e.toggleTodo(!0)
            })), d
        }, b.prototype.lineIsListItemOrIndented_ = function(a) {
            var b = this.getLineAttributes_(a);
            return (b[m.LIST_TYPE] || !1) !== !1 || 0 !== (b[m.LINE_INDENT] || 0)
        }, b.prototype.onCursorActivity_ = function() {
            var a = this;
            setTimeout(function() {
                a.updateCurrentAttributes_()
            }, 1)
        }, b.prototype.getCurrentAttributes_ = function() {
            return this.currentAttributes_ || this.updateCurrentAttributes_(), this.currentAttributes_
        }, b.prototype.updateCurrentAttributes_ = function() {
            var b = this.codeMirror,
                c = b.indexFromPos(b.getCursor("anchor")),
                d = b.indexFromPos(b.getCursor("head")),
                e = d;
            if (c > d) {
                for (; e < this.end();) {
                    var f = this.getRange(e, e + 1);
                    if ("\n" !== f && f !== r) break;
                    e++
                }
                e < this.end() && e++
            } else
                for (; e > 0 && (f = this.getRange(e - 1, e), "\n" === f || f === r);) e--;
            var g = this.annotationList_.getAnnotatedSpansForPos(e);
            this.currentAttributes_ = {};
            var h = {};
            g.length > 0 && !(m.LINE_SENTINEL in g[0].annotation.attributes) ? h = g[0].annotation.attributes : g.length > 1 && (a.utils.assert(!(m.LINE_SENTINEL in g[1].annotation.attributes), "Cursor can't be between two line sentinel characters."), h = g[1].annotation.attributes);
            for (var i in h) "l" !== i && "lt" !== i && "li" !== i && 0 !== i.indexOf(m.ENTITY_SENTINEL) && (this.currentAttributes_[i] = h[i])
        }, b.prototype.getCurrentLineAttributes_ = function() {
            var a = this.codeMirror,
                b = a.getCursor("anchor"),
                c = a.getCursor("head"),
                d = c.line;
            return 0 === c.ch && b.line < c.line && d--, this.getLineAttributes_(d)
        }, b.prototype.getLineAttributes_ = function(b) {
            var c = {},
                d = this.codeMirror.getLine(b);
            if (d.length > 0 && d[0] === r) {
                var e = this.codeMirror.indexFromPos({
                        line: b,
                        ch: 0
                    }),
                    f = this.annotationList_.getAnnotatedSpansForSpan(new k(e, 1));
                a.utils.assert(1 === f.length);
                for (var g in f[0].annotation.attributes) c[g] = f[0].annotation.attributes[g]
            }
            return c
        }, b.prototype.clearAnnotations_ = function() {
            this.annotationList_.updateSpan(new k(0, this.end()), function(a, b) {
                return new g({})
            })
        }, b.prototype.newline = function() {
            var a = this.codeMirror,
                b = this;
            if (this.emptySelection_()) {
                var c = a.getCursor("head").line,
                    d = this.getLineAttributes_(c),
                    e = d[m.LIST_TYPE];
                e && 1 === a.getLine(c).length ? this.updateLineAttributes(c, c, function(a) {
                    delete a[m.LIST_TYPE], delete a[m.LINE_INDENT]
                }) : (a.replaceSelection("\n", "end", "+input"), this.updateLineAttributes(c + 1, c + 1, function(a) {
                    for (var f in d) a[f] = d[f];
                    "tc" === e && (a[m.LIST_TYPE] = "t"), b.trigger("newLine", {
                        line: c + 1,
                        attr: a
                    })
                }))
            } else a.replaceSelection("\n", "end", "+input")
        }, b.prototype.deleteLeft = function() {
            var a = this.codeMirror,
                b = a.getCursor("head"),
                c = this.getLineAttributes_(b.line),
                d = c[m.LIST_TYPE],
                e = c[m.LINE_INDENT],
                f = this.emptySelection_() && 1 === b.ch;
            f && d ? this.updateLineAttributes(b.line, b.line, function(a) {
                delete a[m.LIST_TYPE], delete a[m.LINE_INDENT]
            }) : f && e && e > 0 ? this.unindent() : a.deleteH(-1, "char")
        }, b.prototype.deleteRight = function() {
            var a = this.codeMirror,
                b = a.getCursor("head"),
                c = a.getLine(b.line),
                d = this.areLineSentinelCharacters_(c),
                e = b.line + 1 < a.lineCount() ? a.getLine(b.line + 1) : "";
            this.emptySelection_() && d && e[0] === r ? (a.replaceRange("", {
                line: b.line,
                ch: 0
            }, {
                line: b.line + 1,
                ch: 0
            }, "+input"), a.setCursor({
                line: b.line,
                ch: 0
            })) : a.deleteH(1, "char")
        }, b.prototype.indent = function() {
            this.updateLineAttributesForSelection(function(a) {
                var b = a[m.LINE_INDENT],
                    c = a[m.LIST_TYPE];
                b ? a[m.LINE_INDENT]++ : c ? a[m.LINE_INDENT] = 2 : a[m.LINE_INDENT] = 1
            })
        }, b.prototype.unindent = function() {
            this.updateLineAttributesForSelection(function(a) {
                var b = a[m.LINE_INDENT];
                b && b > 1 ? a[m.LINE_INDENT] = b - 1 : (delete a[m.LIST_TYPE], delete a[m.LINE_INDENT])
            })
        }, b.prototype.getText = function() {
            return this.codeMirror.getValue().replace(new RegExp(r, "g"), "")
        }, b.prototype.areLineSentinelCharacters_ = function(a) {
            for (var b = 0; b < a.length; b++)
                if (a[b] !== r) return !1;
            return !0
        }, g.prototype.equals = function(a) {
            if (!(a instanceof g)) return !1;
            var b;
            for (b in this.attributes)
                if (a.attributes[b] !== this.attributes[b]) return !1;
            for (b in a.attributes)
                if (a.attributes[b] !== this.attributes[b]) return !1;
            return !0
        }, b
    }();
    var a = a || {};
    a.RichTextCodeMirrorAdapter = function() {
        "use strict";

        function b(a) {
            this.rtcm = a, this.cm = a.codeMirror, g(this, "onChange"), g(this, "onAttributesChange"), g(this, "onCursorActivity"), g(this, "onFocus"), g(this, "onBlur"), this.rtcm.on("change", this.onChange), this.rtcm.on("attributesChange", this.onAttributesChange), this.cm.on("cursorActivity", this.onCursorActivity), this.cm.on("focus", this.onFocus), this.cm.on("blur", this.onBlur)
        }

        function c(a, b) {
            return a.line < b.line ? -1 : a.line > b.line ? 1 : a.ch < b.ch ? -1 : a.ch > b.ch ? 1 : 0
        }

        function d(a, b) {
            return 0 === c(a, b)
        }

        function e(a) {
            var b = a.lineCount() - 1;
            return a.indexFromPos({
                line: b,
                ch: a.getLine(b).length
            })
        }

        function f(a, b) {
            if (!a) throw new Error(b || "assertion error")
        }

        function g(a, b) {
            var c = a[b];
            a[b] = function() {
                c.apply(a, arguments)
            }
        }

        function h(a) {
            for (var b in a) return !1;
            return !0
        }

        function i(a, b) {
            if ("string" != typeof a) throw new TypeError("Expected a string");
            a = a.replace(/^#/, ""), 3 === a.length && (a = a[0] + a[0] + a[1] + a[1] + a[2] + a[2]);
            var c = parseInt(a, 16),
                d = [c >> 16, c >> 8 & 255, 255 & c],
                e = "rgb";
            return j(b) && (e = "rgba", d.push(b)), e + "(" + d.join(",") + ")"
        }

        function j(a) {
            return null !== a && void 0 !== a
        }
        var k = a.TextOperation,
            l = a.WrappedOperation,
            m = a.Cursor;
        return b.prototype.detach = function() {
            this.rtcm.off("change", this.onChange), this.rtcm.off("attributesChange", this.onAttributesChange), this.cm.off("cursorActivity", this.onCursorActivity), this.cm.off("focus", this.onFocus), this.cm.off("blur", this.onBlur)
        }, b.operationFromCodeMirrorChanges = function(a, b) {
            for (var c = e(b), d = (new k).retain(c), f = (new k).retain(c), g = a.length - 1; g >= 0; g--) {
                var h = a[g],
                    i = h.start,
                    j = c - i - h.text.length;
                d = (new k).retain(i)["delete"](h.removed.length).insert(h.text, h.attributes).retain(j).compose(d), f = f.compose((new k).retain(i)["delete"](h.text.length).insert(h.removed, h.removedAttributes).retain(j)), c += h.removed.length - h.text.length
            }
            return [d, f]
        }, b.operationFromAttributesChanges = function(a, b) {
            for (var c = e(b), d = new k, g = new k, h = 0, i = 0; i < a.length; i++) {
                var j = a[i],
                    l = j.start - h;
                f(l >= 0), d.retain(l), g.retain(l);
                var m = j.end - j.start;
                d.retain(m, j.attributes), g.retain(m, j.attributesInverse), h = j.start + m
            }
            return d.retain(c - h), g.retain(c - h), [d, g]
        }, b.applyOperationToCodeMirror = function(a, b) {
            a.ops.length > 10 && b.codeMirror.getWrapperElement().setAttribute("style", "display: none");
            for (var c = a.ops, d = 0, e = 0, f = c.length; f > e; e++) {
                var g = c[e];
                g.isRetain() ? (h(g.attributes) || b.updateTextAttributes(d, d + g.chars, function(a) {
                    for (var b in g.attributes) g.attributes[b] === !1 ? delete a[b] : a[b] = g.attributes[b]
                }, "RTCMADAPTER", !0), d += g.chars) : g.isInsert() ? (b.insertText(d, g.text, g.attributes, "RTCMADAPTER"), d += g.text.length) : g.isDelete() && b.removeText(d, d + g.chars, "RTCMADAPTER")
            }
            a.ops.length > 10 && (b.codeMirror.getWrapperElement().setAttribute("style", ""), b.codeMirror.refresh())
        }, b.prototype.registerCallbacks = function(a) {
            this.callbacks = a
        }, b.prototype.onChange = function(a, c) {
            if ("RTCMADAPTER" !== c[0].origin) {
                var d = b.operationFromCodeMirrorChanges(c, this.cm);
                this.trigger("change", d[0], d[1])
            }
        }, b.prototype.onAttributesChange = function(a, c) {
            if ("RTCMADAPTER" !== c[0].origin) {
                var d = b.operationFromAttributesChanges(c, this.cm);
                this.trigger("change", d[0], d[1])
            }
        }, b.prototype.onCursorActivity = function() {
            var a = this;
            setTimeout(function() {
                a.trigger("cursorActivity")
            }, 1)
        }, b.prototype.onFocus = function() {
            this.trigger("focus")
        }, b.prototype.onBlur = function() {
            this.cm.somethingSelected() || this.trigger("blur")
        }, b.prototype.getValue = function() {
            return this.cm.getValue()
        }, b.prototype.getCursor = function() {
            var a, b = this.cm,
                c = b.getCursor(),
                e = b.indexFromPos(c);
            if (b.somethingSelected()) {
                var f = b.getCursor(!0),
                    g = d(c, f) ? b.getCursor(!1) : f;
                a = b.indexFromPos(g)
            } else a = e;
            return new m(e, a)
        }, b.prototype.setCursor = function(a) {
            this.cm.setSelection(this.cm.posFromIndex(a.position), this.cm.posFromIndex(a.selectionEnd))
        }, b.prototype.addStyleRule = function(a) {
            if ("undefined" != typeof document && null !== document) {
                if (!this.addedStyleRules) {
                    this.addedStyleRules = {};
                    var b = document.createElement("style");
                    document.documentElement.getElementsByTagName("head")[0].appendChild(b), this.addedStyleSheet = b.sheet
                }
                if (!this.addedStyleRules[a]) return this.addedStyleRules[a] = !0, this.addedStyleSheet.insertRule(a, 0)
            }
        }, b.prototype.setOtherCursor = function(a, b, c) {
            var d = this.cm.posFromIndex(a.position);
            if ("string" == typeof b && b.match(/^#[a-fA-F0-9]{3,6}$/)) {
                var e = this.rtcm.end();
                if ("object" == typeof a && "number" == typeof a.position && "number" == typeof a.selectionEnd && !(a.position < 0 || a.position > e || a.selectionEnd < 0 || a.selectionEnd > e)) {
                    if (a.position === a.selectionEnd) {
                        var f = this.cm.cursorCoords(d),
                            g = document.createElement("span");
                        return g.className = "other-client", g.style.borderLeftWidth = "2px", g.style.borderLeftStyle = "solid", g.style.borderLeftColor = b, g.style.marginLeft = g.style.marginRight = "-1px", g.style.height = .9 * (f.bottom - f.top) + "px", g.setAttribute("data-clientid", c), g.style.zIndex = 0, this.cm.setBookmark(d, {
                            widget: g,
                            insertLeft: !0
                        })
                    }
                    var h = "selection-" + b.replace("#", ""),
                        j = .4,
                        k = "." + h + " { background: " + i(b) + ";\n background: " + i(b, j) + ";}";
                    this.addStyleRule(k);
                    var l, m;
                    return a.selectionEnd > a.position ? (l = d, m = this.cm.posFromIndex(a.selectionEnd)) : (l = this.cm.posFromIndex(a.selectionEnd), m = d), this.cm.markText(l, m, {
                        className: h
                    })
                }
            }
        }, b.prototype.trigger = function(a) {
            var b = Array.prototype.slice.call(arguments, 1),
                c = this.callbacks && this.callbacks[a];
            c && c.apply(this, b)
        }, b.prototype.applyOperation = function(a) {
            b.applyOperationToCodeMirror(a, this.rtcm)
        }, b.prototype.registerUndo = function(a) {
            this.cm.undo = a
        }, b.prototype.registerRedo = function(a) {
            this.cm.redo = a
        }, b.prototype.invertOperation = function(a) {
            for (var b, c, d = 0, e = this.rtcm.codeMirror, f = new k, g = 0; g < a.wrapped.ops.length; g++) {
                var i = a.wrapped.ops[g];
                if (i.isRetain())
                    if (h(i.attributes)) f.retain(i.chars), d += i.chars;
                    else
                        for (b = this.rtcm.getAttributeSpans(d, d + i.chars), c = 0; c < b.length; c++) {
                            var j = {};
                            for (var m in i.attributes) {
                                var n = i.attributes[m],
                                    o = b[c].attributes[m];
                                n === !1 ? o && (j[m] = o) : n !== o && (j[m] = o || !1)
                            }
                            f.retain(b[c].length, j), d += b[c].length
                        } else if (i.isInsert()) f["delete"](i.text.length);
                        else if (i.isDelete()) {
                    var p = e.getRange(e.posFromIndex(d), e.posFromIndex(d + i.chars));
                    b = this.rtcm.getAttributeSpans(d, d + i.chars);
                    var q = 0;
                    for (c = 0; c < b.length; c++) f.insert(p.substr(q, b[c].length), b[c].attributes), q += b[c].length;
                    d += i.chars
                }
            }
            return new l(f, a.meta.invert())
        }, b
    }();
    var a = a || {};
    a.Formatting = function() {
        function b(a) {
            return this instanceof b ? void(this.attributes = a || {}) : new b(a)
        }
        var c = a.AttributeConstants;
        return b.prototype.cloneWithNewAttribute_ = function(a, c) {
            var d = {};
            for (var e in this.attributes) d[e] = this.attributes[e];
            return c === !1 ? delete d[a] : d[a] = c, new b(d)
        }, b.prototype.bold = function(a) {
            return this.cloneWithNewAttribute_(c.BOLD, a)
        }, b.prototype.italic = function(a) {
            return this.cloneWithNewAttribute_(c.ITALIC, a)
        }, b.prototype.underline = function(a) {
            return this.cloneWithNewAttribute_(c.UNDERLINE, a)
        }, b.prototype.strike = function(a) {
            return this.cloneWithNewAttribute_(c.STRIKE, a)
        }, b.prototype.font = function(a) {
            return this.cloneWithNewAttribute_(c.FONT, a)
        }, b.prototype.fontSize = function(a) {
            return this.cloneWithNewAttribute_(c.FONT_SIZE, a)
        }, b.prototype.color = function(a) {
            return this.cloneWithNewAttribute_(c.COLOR, a)
        }, b.prototype.backgroundColor = function(a) {
            return this.cloneWithNewAttribute_(c.BACKGROUND_COLOR, a)
        }, b
    }();
    var a = a || {};
    a.Text = function() {
        function b(c, d) {
            return this instanceof b ? (this.text = c, void(this.formatting = d || a.Formatting())) : new b(c, d)
        }
        return b
    }();
    var a = a || {};
    a.LineFormatting = function() {
        function b(a) {
            return this instanceof b ? (this.attributes = a || {}, void(this.attributes[c.LINE_SENTINEL] = !0)) : new b(a)
        }
        var c = a.AttributeConstants;
        return b.LIST_TYPE = {
            NONE: !1,
            ORDERED: "o",
            UNORDERED: "u",
            TODO: "t",
            TODOCHECKED: "tc"
        }, b.prototype.cloneWithNewAttribute_ = function(a, c) {
            var d = {};
            for (var e in this.attributes) d[e] = this.attributes[e];
            return c === !1 ? delete d[a] : d[a] = c, new b(d)
        }, b.prototype.indent = function(a) {
            return this.cloneWithNewAttribute_(c.LINE_INDENT, a)
        }, b.prototype.align = function(a) {
            return this.cloneWithNewAttribute_(c.LINE_ALIGN, a)
        }, b.prototype.listItem = function(b) {
            return a.utils.assert(b === !1 || "u" === b || "o" === b || "t" === b || "tc" === b), this.cloneWithNewAttribute_(c.LIST_TYPE, b)
        }, b.prototype.getIndent = function() {
            return this.attributes[c.LINE_INDENT] || 0
        }, b.prototype.getAlign = function() {
            return this.attributes[c.LINE_ALIGN] || 0
        }, b.prototype.getListItem = function() {
            return this.attributes[c.LIST_TYPE] || !1
        }, b
    }();
    var a = a || {};
    a.Line = function() {
        function b(c, d) {
            return this instanceof b ? ("[object Array]" !== Object.prototype.toString.call(c) && (c = "undefined" == typeof c ? [] : [c]), this.textPieces = c, void(this.formatting = d || a.LineFormatting())) : new b(c, d)
        }
        return b
    }();
    var a = a || {};
    a.ParseHtml = function() {
        function b(b, c, d) {
            this.listType = b || i.UNORDERED, this.lineFormatting = c || a.LineFormatting(), this.textFormatting = d || a.Formatting()
        }

        function c() {
            this.lines = [], this.currentLine = [], this.currentLineListItemType = null
        }

        function d(d, f) {
            var g = (a.document || document).createElement("div");
            g.innerHTML = d, j = f;
            var h = new c,
                i = new b;
            return e(g, i, h), h.lines
        }

        function e(b, c, d) {
            if (b.nodeType === k.ELEMENT_NODE) {
                var e = j.fromElement(b);
                if (e) return void d.currentLine.push(new a.Text(a.sentinelConstants.ENTITY_SENTINEL_CHARACTER, new a.Formatting(e.toAttributes())))
            }
            switch (b.nodeType) {
                case k.TEXT_NODE:
                    var l = b.nodeValue.replace(/[ \n\t]+/g, " ");
                    d.currentLine.push(a.Text(l, c.textFormatting));
                    break;
                case k.ELEMENT_NODE:
                    var m = b.getAttribute("style") || "";
                    switch (c = h(c, m), b.nodeName.toLowerCase()) {
                        case "div":
                        case "h1":
                        case "h2":
                        case "h3":
                        case "p":
                            d.newlineIfNonEmpty(c), f(b, c, d), d.newlineIfNonEmpty(c);
                            break;
                        case "center":
                            c = c.withAlign("center"), d.newlineIfNonEmpty(c), f(b, c.withAlign("center"), d), d.newlineIfNonEmpty(c);
                            break;
                        case "b":
                        case "strong":
                            f(b, c.withTextFormatting(c.textFormatting.bold(!0)), d);
                            break;
                        case "u":
                            f(b, c.withTextFormatting(c.textFormatting.underline(!0)), d);
                            break;
                        case "i":
                        case "em":
                            f(b, c.withTextFormatting(c.textFormatting.italic(!0)), d);
                            break;
                        case "s":
                            f(b, c.withTextFormatting(c.textFormatting.strike(!0)), d);
                            break;
                        case "font":
                            var n = b.getAttribute("face"),
                                o = b.getAttribute("color"),
                                p = parseInt(b.getAttribute("size"));
                            n && (c = c.withTextFormatting(c.textFormatting.font(n))), o && (c = c.withTextFormatting(c.textFormatting.color(o))), p && (c = c.withTextFormatting(c.textFormatting.fontSize(p))), f(b, c, d);
                            break;
                        case "br":
                            d.newline(c);
                            break;
                        case "ul":
                            d.newlineIfNonEmptyOrListItem(c);
                            var q = "firepad-todo" === b.getAttribute("class") ? i.TODO : i.UNORDERED;
                            f(b, c.withListType(q).withIncreasedIndent(), d), d.newlineIfNonEmpty(c);
                            break;
                        case "ol":
                            d.newlineIfNonEmptyOrListItem(c), f(b, c.withListType(i.ORDERED).withIncreasedIndent(), d), d.newlineIfNonEmpty(c);
                            break;
                        case "li":
                            g(b, c, d);
                            break;
                        case "style":
                            break;
                        default:
                            f(b, c, d)
                    }
            }
        }

        function f(a, b, c) {
            if (a.hasChildNodes())
                for (var d = 0; d < a.childNodes.length; d++) e(a.childNodes[d], b, c)
        }

        function g(a, b, c) {
            c.newlineIfNonEmptyOrListItem(b);
            var d = "firepad-checked" === a.getAttribute("class") ? i.TODOCHECKED : b.listType;
            c.makeListItem(d);
            var e = c.currentLine;
            f(a, b, c), (e === c.currentLine || c.currentLine.length > 0) && c.newline(b)
        }

        function h(b, c) {
            for (var d = b.textFormatting, e = b.lineFormatting, f = c.split(";"), g = 0; g < f.length; g++) {
                var h = f[g].split(":");
                if (2 === h.length) {
                    var i = a.utils.trim(h[0]).toLowerCase(),
                        j = a.utils.trim(h[1]).toLowerCase();
                    switch (i) {
                        case "text-decoration":
                            var k = j.indexOf("underline") >= 0,
                                l = j.indexOf("line-through") >= 0;
                            d = d.underline(k).strike(l);
                            break;
                        case "font-weight":
                            var m = "bold" === j || parseInt(j) >= 600;
                            d = d.bold(m);
                            break;
                        case "font-style":
                            var n = "italic" === j || "oblique" === j;
                            d = d.italic(n);
                            break;
                        case "color":
                            d = d.color(j);
                            break;
                        case "background-color":
                            d = d.backgroundColor(j);
                            break;
                        case "text-align":
                            e = e.align(j);
                            break;
                        case "font-size":
                            var o = null,
                                p = ["px", "pt", "%", "em", "xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "smaller", "larger"];
                            a.utils.stringEndsWith(j, p) ? o = j : parseInt(j) && (o = parseInt(j) + "px"), o && (d = d.fontSize(o));
                            break;
                        case "font-family":
                            var q = a.utils.trim(j.split(",")[0]);
                            q = q.replace(/['"]/g, ""), q = q.replace(/\w\S*/g, function(a) {
                                return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase()
                            }), d = d.font(q)
                    }
                }
            }
            return b.withLineFormatting(e).withTextFormatting(d)
        }
        var i = a.LineFormatting.LIST_TYPE;
        b.prototype.withTextFormatting = function(a) {
            return new b(this.listType, this.lineFormatting, a)
        }, b.prototype.withLineFormatting = function(a) {
            return new b(this.listType, a, this.textFormatting)
        }, b.prototype.withListType = function(a) {
            return new b(a, this.lineFormatting, this.textFormatting)
        }, b.prototype.withIncreasedIndent = function() {
            var a = this.lineFormatting.indent(this.lineFormatting.getIndent() + 1);
            return new b(this.listType, a, this.textFormatting)
        }, b.prototype.withAlign = function(a) {
            var c = this.lineFormatting.align(a);
            return new b(this.listType, c, this.textFormatting)
        }, c.prototype.newlineIfNonEmpty = function(a) {
            this.cleanLine_(), this.currentLine.length > 0 && this.newline(a)
        }, c.prototype.newlineIfNonEmptyOrListItem = function(a) {
            this.cleanLine_(), (this.currentLine.length > 0 || null !== this.currentLineListItemType) && this.newline(a)
        }, c.prototype.newline = function(b) {
            this.cleanLine_();
            var c = b.lineFormatting;
            null !== this.currentLineListItemType && (c = c.listItem(this.currentLineListItemType), this.currentLineListItemType = null), this.lines.push(a.Line(this.currentLine, c)), this.currentLine = []
        }, c.prototype.makeListItem = function(a) {
            this.currentLineListItemType = a
        }, c.prototype.cleanLine_ = function() {
            if (this.currentLine.length > 0) {
                var a = this.currentLine.length - 1;
                this.currentLine[0].text = this.currentLine[0].text.replace(/^ +/, ""), this.currentLine[a].text = this.currentLine[a].text.replace(/ +$/g, "");
                for (var b = 0; b < this.currentLine.length; b++) this.currentLine[b].text = this.currentLine[b].text.replace(/\u00a0/g, " ")
            }
            1 === this.currentLine.length && "" === this.currentLine[0].text && (this.currentLine = [])
        };
        var j, k = k || {
            ELEMENT_NODE: 1,
            TEXT_NODE: 3
        };
        return d
    }();
    var a = a || {};
    a.SerializeHtml = function() {
        function b(a) {
            return a === i.ORDERED ? "<ol>" : a === i.UNORDERED ? "<ul>" : '<ul class="firepad-todo">'
        }

        function c(a) {
            return a === i.ORDERED ? "</ol>" : "</ul>"
        }

        function d(a, b) {
            return a === b || a === i.TODO && b === i.TODOCHECKED || a === i.TODOCHECKED && b === i.TODO
        }

        function e(a) {
            return a.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\u00a0/g, "&nbsp;")
        }

        function f(f, k) {
            for (var l = "", m = !0, n = [], o = !1, p = !0, q = !0, r = 0, s = f.ops[r], t = !1; s;) {
                g.assert(s.isInsert());
                var u = s.attributes;
                if (m) {
                    m = !1;
                    var v = 0,
                        w = null,
                        x = "left";
                    h.LINE_SENTINEL in u && (v = u[h.LINE_INDENT] || 0, w = u[h.LIST_TYPE] || null, x = u[h.LINE_ALIGN] || "left"), w && (v = v || 1), o ? (l += "</li>", o = !1) : p || (q && (l += "<br/>"), l += "</div>"), p = !1, g.assert(v >= 0, "Indent must not be negative.");
                    for (; n.length > v || v === n.length && null !== w && !d(w, n[n.length - 1]);) l += c(n.pop());
                    for (; n.length < v;) {
                        var y = w || i.UNORDERED;
                        t = w == i.TODO || w == i.TODOCHECKED || t, l += b(y), n.push(y)
                    }
                    var z = "left" !== x ? ' style="text-align:' + x + '"' : "";
                    if (w) {
                        var A = "";
                        switch (w) {
                            case i.TODOCHECKED:
                                A = ' class="firepad-checked"';
                                break;
                            case i.TODO:
                                A = ' class="firepad-unchecked"'
                        }
                        l += "<li" + A + z + ">", o = !0
                    } else l += "<div" + z + ">";
                    q = !0
                }
                if (h.LINE_SENTINEL in u) s = f.ops[++r];
                else if (h.ENTITY_SENTINEL in u) {
                    for (var B = 0; B < s.text.length; B++) {
                        var C = a.Entity.fromAttributes(u),
                            D = k.exportToElement(C);
                        l += D.outerHTML
                    }
                    s = f.ops[++r]
                } else {
                    var E = "",
                        F = "";
                    for (var G in u) {
                        var H, I, J = u[G];
                        G === h.BOLD || G === h.ITALIC || G === h.UNDERLINE || G === h.STRIKE ? (g.assert(J === !0), H = I = G) : G === h.FONT_SIZE ? (H = 'span style="font-size: ' + J, H += "string" != typeof J || -1 === J.indexOf("px", J.length - 2) ? 'px"' : '"', I = "span") : G === h.FONT ? (H = 'span style="font-family: ' + J + '"', I = "span") : G === h.COLOR ? (H = 'span style="color: ' + J + '"', I = "span") : G === h.BACKGROUND_COLOR ? (H = 'span style="background-color: ' + J + '"', I = "span") : g.log(!1, "Encountered unknown attribute while rendering html: " + G), H && (E += "<" + H + ">"), I && (F = "</" + I + ">" + F)
                    }
                    var K = s.text,
                        L = K.indexOf("\n");
                    L >= 0 ? (m = !0, s = L < K.length - 1 ? new a.TextOp("insert", K.substr(L + 1), u) : f.ops[++r], K = K.substr(0, L)) : s = f.ops[++r], K = K.replace(/  +/g, function(a) {
                        return new Array(a.length + 1).join("� ")
                    }).replace(/^ /, "� ").replace(/ $/, "� "), K.length > 0 && (q = !1), l += E + e(K) + F
                }
            }
            for (o ? l += "</li>" : p || (q && (l += "&nbsp;"), l += "</div>"); n.length > 0;) l += c(n.pop());
            return t && (l = j + l), l
        }
        var g = a.utils,
            h = a.AttributeConstants,
            i = a.LineFormatting.LIST_TYPE,
            j = '<style>ul.firepad-todo { list-style: none; margin-left: 0; padding-left: 0; } ul.firepad-todo > li { padding-left: 1em; text-indent: -1em; } ul.firepad-todo > li:before { content: "\\2610"; padding-right: 5px; } ul.firepad-todo > li.firepad-checked:before { content: "\\2611"; padding-right: 5px; }</style>\n';
        return f
    }();
    var a = a || {};
    a.textPiecesToInserts = function(b, c) {
        function d(c, d) {
            c instanceof a.Text && (d = c.formatting.attributes, c = c.text), f.push({
                string: c,
                attributes: d
            }), b = "\n" === c[c.length - 1]
        }

        function e(c, e) {
            b && d(a.sentinelConstants.LINE_SENTINEL_CHARACTER, c.formatting.attributes);
            for (var f = 0; f < c.textPieces.length; f++) d(c.textPieces[f]);
            e && d("\n")
        }
        for (var f = [], g = 0; g < c.length; g++) c[g] instanceof a.Line ? e(c[g], g < c.length - 1) : d(c[g]);
        return f
    };
    var a = a || {};
    a.Headless = function() {
        function b(a) {
            if (!(this instanceof b)) return new b(a);
            if ("string" == typeof a) {
                if ("function" != typeof Firebase) var c = require("firebase");
                else var c = Firebase;
                var f = new c(a)
            } else var f = a;
            this.entityManager_ = new e, this.firebaseAdapter_ = new d(f), this.ready_ = !1, this.zombie_ = !1
        }
        var c = a.TextOperation,
            d = a.FirebaseAdapter,
            e = a.EntityManager,
            f = a.ParseHtml;
        return b.prototype.getDocument = function(a) {
            var b = this;
            return b.ready_ ? a(b.firebaseAdapter_.getDocument()) : void b.firebaseAdapter_.on("ready", function() {
                b.ready_ = !0, a(b.firebaseAdapter_.getDocument())
            })
        }, b.prototype.getText = function(b) {
            if (this.zombie_) throw new Error("You can't use a firepad.Headless after calling dispose()!");
            this.getDocument(function(c) {
                var d = c.apply("");
                for (key in a.sentinelConstants) d = d.replace(new RegExp(a.sentinelConstants[key], "g"), "");
                b(d)
            })
        }, b.prototype.setText = function(a, b) {
            if (this.zombie_) throw new Error("You can't use a firepad.Headless after calling dispose()!");
            var d = c().insert(a);
            this.sendOperationWithRetry(d, b)
        }, b.prototype.initializeFakeDom = function(b) {
            "object" == typeof document || "object" == typeof a.document ? b() : require("jsdom").env("<head></head><body></body>", function(c, d) {
                return a.document ? (d.close(), b()) : (a.document = d.document, void b())
            })
        }, b.prototype.getHtml = function(b) {
            var c = this;
            if (this.zombie_) throw new Error("You can't use a firepad.Headless after calling dispose()!");
            c.initializeFakeDom(function() {
                c.getDocument(function(d) {
                    b(a.SerializeHtml(d, c.entityManager_))
                })
            })
        }, b.prototype.setHtml = function(b, d) {
            var e = this;
            if (this.zombie_) throw new Error("You can't use a firepad.Headless after calling dispose()!");
            e.initializeFakeDom(function() {
                for (var g = f(b, e.entityManager_), h = a.textPiecesToInserts(!0, g), i = new c, j = 0; j < h.length; j++) i.insert(h[j].string, h[j].attributes);
                e.sendOperationWithRetry(i, d)
            })
        }, b.prototype.sendOperationWithRetry = function(a, b) {
            var c = this;
            c.getDocument(function(d) {
                var e = a.clone()["delete"](d.targetLength);
                c.firebaseAdapter_.sendOperation(e, function(d, e) {
                    e ? "undefined" != typeof b && b(null, e) : c.sendOperationWithRetry(a, b)
                })
            })
        }, b.prototype.dispose = function() {
            this.zombie_ = !0, this.firebaseAdapter_.dispose()
        }, b
    }();
    var a = a || {};
    return a.Firepad = function(b) {
        function c(a, b, e) {
            if (!(this instanceof c)) return new c(a, b, e);
            if (!p && !q) throw new Error("Couldn't find CodeMirror or ACE.  Did you forget to include codemirror.js or ace.js?");
            if (this.zombie_ = !1, p && b instanceof p) {
                this.codeMirror_ = this.editor_ = b;
                var f = this.codeMirror_.getValue();
                if ("" !== f) throw new Error("Can't initialize Firepad with a CodeMirror instance that already contains text.")
            } else if (q && b && b.session instanceof q.EditSession) {
                if (this.ace_ = this.editor_ = b, f = this.ace_.getValue(), "" !== f) throw new Error("Can't initialize Firepad with an ACE instance that already contains text.")
            } else this.codeMirror_ = this.editor_ = new p(b);
            var i = this.codeMirror_ ? this.codeMirror_.getWrapperElement() : this.ace_.container;
            this.firepadWrapper_ = o.elt("div", null, {
                "class": "firepad"
            }), i.parentNode.replaceChild(this.firepadWrapper_, i), this.firepadWrapper_.appendChild(i), o.on(i, "dragstart", o.stopEvent), this.editor_.firepad = this, this.options_ = e || {}, this.getOption("richTextShortcuts", !1) && (p.keyMap.richtext || this.initializeKeyMap_(), this.codeMirror_.setOption("keyMap", "richtext"), this.firepadWrapper_.className += " firepad-richtext"), this.imageInsertionUI = this.getOption("imageInsertionUI", !0), this.getOption("richTextToolbar", !1) && (this.addToolbar_(), this.firepadWrapper_.className += " firepad-richtext firepad-with-toolbar"), this.addPoweredByLogo_(), this.codeMirror_ && this.codeMirror_.refresh();
            var n = this.getOption("userId", a.push().key()),
                r = this.getOption("userColor", d(n));
            this.entityManager_ = new m, this.firebaseAdapter_ = new k(a, n, r), this.codeMirror_ ? (this.richTextCodeMirror_ = new h(this.codeMirror_, this.entityManager_, {
                cssPrefix: "firepad-"
            }), this.editorAdapter_ = new g(this.richTextCodeMirror_)) : this.editorAdapter_ = new j(this.ace_), this.client_ = new l(this.firebaseAdapter_, this.editorAdapter_);
            var s = this;
            this.firebaseAdapter_.on("cursor", function() {
                s.trigger.apply(s, ["cursor"].concat([].slice.call(arguments)))
            }), this.codeMirror_ && this.richTextCodeMirror_.on("newLine", function() {
                s.trigger.apply(s, ["newLine"].concat([].slice.call(arguments)))
            }), this.firebaseAdapter_.on("ready", function() {
                s.ready_ = !0, this.ace_ && this.editorAdapter_.grabDocumentState();
                var a = s.getOption("defaultText", null);
                a && s.isHistoryEmpty() && s.setText(a), s.trigger("ready")
            }), this.client_.on("synced", function(a) {
                s.trigger("synced", a)
            }), "Microsoft Internet Explorer" == navigator.appName && navigator.userAgent.match(/MSIE 8\./) && (window.onload = function() {
                var a = document.getElementsByTagName("head")[0],
                    b = document.createElement("style");
                b.type = "text/css", b.styleSheet.cssText = ":before,:after{content:none !important;}", a.appendChild(b), setTimeout(function() {
                    a.removeChild(b)
                }, 0)
            })
        }

        function d(a) {
            for (var b = 1, c = 0; c < a.length; c++) b = 17 * (b + a.charCodeAt(c)) % 360;
            var d = b / 360;
            return f(d, 1, .75)
        }

        function e(a, b, c) {
            function d(a) {
                var b = Math.round(255 * a).toString(16);
                return 1 === b.length ? "0" + b : b
            }
            return "#" + d(a) + d(b) + d(c)
        }

        function f(a, b, c) {
            if (0 === b) return e(c, c, c);
            var d = .5 > c ? c * (1 + b) : c + b - b * c,
                f = 2 * c - d,
                g = function(a) {
                    return 0 > a && (a += 1), a > 1 && (a -= 1), 1 > 6 * a ? f + 6 * (d - f) * a : 1 > 2 * a ? d : 2 > 3 * a ? f + 6 * (d - f) * (2 / 3 - a) : f
                };
            return e(g(a + 1 / 3), g(a), g(a - 1 / 3))
        }
        if (!a.RichTextCodeMirrorAdapter) throw new Error("Oops! It looks like you're trying to include lib/firepad.js directly.  This is actually one of many source files that make up firepad.  You want dist/firepad.js instead.");
        var g = a.RichTextCodeMirrorAdapter,
            h = a.RichTextCodeMirror,
            i = a.RichTextToolbar,
            j = a.ACEAdapter,
            k = a.FirebaseAdapter,
            l = a.EditorClient,
            m = a.EntityManager,
            n = a.AttributeConstants,
            o = a.utils,
            p = (a.LineFormatting.LIST_TYPE, b.CodeMirror),
            q = b.ace;
        return o.makeEventEmitter(c), c.fromCodeMirror = c, c.fromACE = c, c.prototype.dispose = function() {
            this.zombie_ = !0;
            var a = this.codeMirror_ ? this.codeMirror_.getWrapperElement() : this.ace_.container;
            this.firepadWrapper_.removeChild(a), this.firepadWrapper_.parentNode.replaceChild(a, this.firepadWrapper_), this.editor_.firepad = null, this.codeMirror_ && "richtext" === this.codeMirror_.getOption("keyMap") && this.codeMirror_.setOption("keyMap", "default"), this.firebaseAdapter_.dispose(), this.editorAdapter_.detach(), this.richTextCodeMirror_ && this.richTextCodeMirror_.detach()
        }, c.prototype.setUserId = function(a) {
            this.firebaseAdapter_.setUserId(a)
        }, c.prototype.setUserColor = function(a) {
            this.firebaseAdapter_.setColor(a)
        }, c.prototype.getText = function() {
            return this.assertReady_("getText"), this.codeMirror_ ? this.richTextCodeMirror_.getText() : this.ace_.getSession().getDocument().getValue()
        }, c.prototype.setText = function(a) {
            return this.assertReady_("setText"), this.ace_ ? this.ace_.getSession().getDocument().setValue(a) : (this.codeMirror_.getWrapperElement().setAttribute("style", "display: none"), this.codeMirror_.setValue(""), this.insertText(0, a), this.codeMirror_.getWrapperElement().setAttribute("style", ""), this.codeMirror_.refresh(), void this.editorAdapter_.setCursor({
                position: 0,
                selectionEnd: 0
            }))
        }, c.prototype.insertTextAtCursor = function(a) {
            this.insertText(this.codeMirror_.indexFromPos(this.codeMirror_.getCursor()), a)
        }, c.prototype.insertText = function(b, c) {
            o.assert(!this.ace_, "Not supported for ace yet."), this.assertReady_("insertText"), "[object Array]" !== Object.prototype.toString.call(c) && (c = [c]);
            for (var d = 0 === b, e = a.textPiecesToInserts(d, c), f = 0; f < e.length; f++) {
                var g = e[f].string,
                    h = e[f].attributes;
                this.richTextCodeMirror_.insertText(b, g, h), b += g.length
            }
        }, c.prototype.getOperationForSpan = function(b, c) {
            for (var d = this.richTextCodeMirror_.getRange(b, c), e = this.richTextCodeMirror_.getAttributeSpans(b, c), f = 0, g = new a.TextOperation, h = 0; h < e.length; h++) g.insert(d.substr(f, e[h].length), e[h].attributes), f += e[h].length;
            return g
        }, c.prototype.getHtml = function() {
            return this.getHtmlFromRange(null, null)
        }, c.prototype.getHtmlFromSelection = function() {
            var a = this.codeMirror_.getCursor("start"),
                b = this.codeMirror_.getCursor("end"),
                c = this.codeMirror_.indexFromPos(a),
                d = this.codeMirror_.indexFromPos(b);
            return this.getHtmlFromRange(c, d)
        }, c.prototype.getHtmlFromRange = function(b, c) {
            this.assertReady_("getHtmlFromRange");
            var d = null != b && null != c ? this.getOperationForSpan(b, c) : this.getOperationForSpan(0, this.codeMirror_.getValue().length);
            return a.SerializeHtml(d, this.entityManager_)
        }, c.prototype.insertHtml = function(b, c) {
            var d = a.ParseHtml(c, this.entityManager_);
            this.insertText(b, d)
        }, c.prototype.insertHtmlAtCursor = function(a) {
            this.insertHtml(this.codeMirror_.indexFromPos(this.codeMirror_.getCursor()), a)
        }, c.prototype.setHtml = function(b) {
            var c = a.ParseHtml(b, this.entityManager_);
            this.setText(c)
        }, c.prototype.isHistoryEmpty = function() {
            return this.assertReady_("isHistoryEmpty"), this.firebaseAdapter_.isHistoryEmpty()
        }, c.prototype.bold = function() {
            this.richTextCodeMirror_.toggleAttribute(n.BOLD), this.codeMirror_.focus()
        }, c.prototype.italic = function() {
            this.richTextCodeMirror_.toggleAttribute(n.ITALIC), this.codeMirror_.focus()
        }, c.prototype.underline = function() {
            this.richTextCodeMirror_.toggleAttribute(n.UNDERLINE), this.codeMirror_.focus()
        }, c.prototype.strike = function() {
            this.richTextCodeMirror_.toggleAttribute(n.STRIKE), this.codeMirror_.focus()
        }, c.prototype.fontSize = function(a) {
            this.richTextCodeMirror_.setAttribute(n.FONT_SIZE, a), this.codeMirror_.focus()
        }, c.prototype.font = function(a) {
            this.richTextCodeMirror_.setAttribute(n.FONT, a), this.codeMirror_.focus()
        }, c.prototype.color = function(a) {
            this.richTextCodeMirror_.setAttribute(n.COLOR, a), this.codeMirror_.focus()
        }, c.prototype.highlight = function() {
            this.richTextCodeMirror_.toggleAttribute(n.BACKGROUND_COLOR, "rgba(255,255,0,.65)"), this.codeMirror_.focus()
        }, c.prototype.align = function(a) {
            if ("left" !== a && "center" !== a && "right" !== a) throw new Error('align() must be passed "left", "center", or "right".');
            this.richTextCodeMirror_.setLineAttribute(n.LINE_ALIGN, a), this.codeMirror_.focus()
        }, c.prototype.orderedList = function() {
            this.richTextCodeMirror_.toggleLineAttribute(n.LIST_TYPE, "o"), this.codeMirror_.focus()
        }, c.prototype.unorderedList = function() {
            this.richTextCodeMirror_.toggleLineAttribute(n.LIST_TYPE, "u"), this.codeMirror_.focus()
        }, c.prototype.todo = function() {
            this.richTextCodeMirror_.toggleTodo(), this.codeMirror_.focus()
        }, c.prototype.newline = function() {
            this.richTextCodeMirror_.newline()
        }, c.prototype.deleteLeft = function() {
            this.richTextCodeMirror_.deleteLeft()
        }, c.prototype.deleteRight = function() {
            this.richTextCodeMirror_.deleteRight()
        }, c.prototype.indent = function() {
            this.richTextCodeMirror_.indent(), this.codeMirror_.focus()
        }, c.prototype.unindent = function() {
            this.richTextCodeMirror_.unindent(), this.codeMirror_.focus()
        }, c.prototype.undo = function() {
            this.codeMirror_.undo()
        }, c.prototype.redo = function() {
            this.codeMirror_.redo()
        }, c.prototype.insertEntity = function(a, b, c) {
            this.richTextCodeMirror_.insertEntityAtCursor(a, b, c)
        }, c.prototype.insertEntityAt = function(a, b, c, d) {
            this.richTextCodeMirror_.insertEntityAt(a, b, c, d)
        }, c.prototype.registerEntity = function(a, b) {
            this.entityManager_.register(a, b)
        }, c.prototype.getOption = function(a, b) {
            return a in this.options_ ? this.options_[a] : b
        }, c.prototype.assertReady_ = function(a) {
            if (!this.ready_) throw new Error('You must wait for the "ready" event before calling ' + a + ".");
            if (this.zombie_) throw new Error("You can't use a Firepad after calling dispose()!  [called " + a + "]")
        }, c.prototype.makeImageDialog_ = function() {
            this.makeDialog_("img", "Insert image url")
        }, c.prototype.makeDialog_ = function(a, b) {
            var c = this,
                d = function() {
                    var a = document.getElementById("overlay");
                    a.style.visibility = "hidden", c.firepadWrapper_.removeChild(a)
                },
                e = function() {
                    var b = document.getElementById("overlay");
                    b.style.visibility = "hidden";
                    var d = document.getElementById(a).value;
                    null !== d && c.insertEntity(a, {
                        src: d
                    }), c.firepadWrapper_.removeChild(b)
                },
                f = o.elt("input", null, {
                    "class": "firepad-dialog-input",
                    id: a,
                    type: "text",
                    placeholder: b,
                    autofocus: "autofocus"
                }),
                g = o.elt("a", "Submit", {
                    "class": "firepad-btn",
                    id: "submitbtn"
                });
            o.on(g, "click", o.stopEventAnd(e));
            var h = o.elt("a", "Cancel", {
                "class": "firepad-btn"
            });
            o.on(h, "click", o.stopEventAnd(d));
            var i = o.elt("div", [g, h], {
                    "class": "firepad-btn-group"
                }),
                j = o.elt("div", [f, i], {
                    "class": "firepad-dialog-div"
                }),
                k = o.elt("div", [j], {
                    "class": "firepad-dialog",
                    id: "overlay"
                });
            this.firepadWrapper_.appendChild(k)
        }, c.prototype.addToolbar_ = function() {
            this.toolbar = new i(this.imageInsertionUI), this.toolbar.on("undo", this.undo, this), this.toolbar.on("redo", this.redo, this), this.toolbar.on("bold", this.bold, this), this.toolbar.on("italic", this.italic, this), this.toolbar.on("underline", this.underline, this), this.toolbar.on("strike", this.strike, this), this.toolbar.on("font-size", this.fontSize, this), this.toolbar.on("font", this.font, this), this.toolbar.on("color", this.color, this), this.toolbar.on("left", function() {
                this.align("left")
            }, this), this.toolbar.on("center", function() {
                this.align("center")
            }, this), this.toolbar.on("right", function() {
                this.align("right")
            }, this), this.toolbar.on("ordered-list", this.orderedList, this), this.toolbar.on("unordered-list", this.unorderedList, this), this.toolbar.on("todo-list", this.todo, this), this.toolbar.on("indent-increase", this.indent, this), this.toolbar.on("indent-decrease", this.unindent, this), this.toolbar.on("insert-image", this.makeImageDialog_, this), this.firepadWrapper_.insertBefore(this.toolbar.element(), this.firepadWrapper_.firstChild)
        }, c.prototype.addPoweredByLogo_ = function() {
            var a = o.elt("a", null, {
                "class": "powered-by-firepad"
            });
            a.setAttribute("href", "http://www.firepad.io/"), a.setAttribute("target", "_blank"), this.firepadWrapper_.appendChild(a)
        }, c.prototype.initializeKeyMap_ = function() {
            function a(a) {
                return function(b) {
                    setTimeout(function() {
                        a.call(b.firepad)
                    }, 0)
                }
            }
            p.keyMap.richtext = {
                "Ctrl-B": a(this.bold),
                "Cmd-B": a(this.bold),
                "Ctrl-I": a(this.italic),
                "Cmd-I": a(this.italic),
                "Ctrl-U": a(this.underline),
                "Cmd-U": a(this.underline),
                "Ctrl-H": a(this.highlight),
                "Cmd-H": a(this.highlight),
                Enter: a(this.newline),
                Delete: a(this.deleteRight),
                Backspace: a(this.deleteLeft),
                Tab: a(this.indent),
                "Shift-Tab": a(this.unindent),
                fallthrough: ["default"]
            }
        }, c
    }(this), a.Firepad.Formatting = a.Formatting, a.Firepad.Text = a.Text, a.Firepad.Entity = a.Entity, a.Firepad.LineFormatting = a.LineFormatting, a.Firepad.Line = a.Line, a.Firepad.TextOperation = a.TextOperation, a.Firepad.Headless = a.Headless, a.Firepad.RichTextCodeMirrorAdapter = a.RichTextCodeMirrorAdapter, a.Firepad.ACEAdapter = a.ACEAdapter, a.Firepad
}, this);