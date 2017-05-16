!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.SplitArticle=n()}(this,function(){"use strict";function t(t){n()?t():(t.done=!1,document.addEventListener("readystatechange",function(){n()&&!t.done&&(t.done=!0,t())}))}var n=function(){return["interactive","complete"].includes(document.readyState)},r=function(t){return new RegExp(t.source,(t.global?"g":"")+(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.sticky?"y":"")+(t.unicode?"u":""))},e=function(t){return null!=t&&"object"==typeof t&&!0===t["@@functional/placeholder"]},u=function(t){return function n(r){return 0===arguments.length||e(r)?n:t.apply(this,arguments)}},o=u(function(t){return null===t?"Null":void 0===t?"Undefined":Object.prototype.toString.call(t).slice(8,-1)}),i=function t(n,e,u,i){var c=function(r){for(var o=e.length,c=0;c<o;){if(n===e[c])return u[c];c+=1}e[c+1]=n,u[c+1]=r;for(var a in n)r[a]=i?t(n[a],e,u,!0):n[a];return r};switch(o(n)){case"Object":return c({});case"Array":return c([]);case"Date":return new Date(n.valueOf());case"RegExp":return r(n);default:return n}},c=u(function(t){return null!=t&&"function"==typeof t.clone?t.clone():i(t,[],[],!0)}),a=function(t,n){switch(t){case 0:return function(){return n.apply(this,arguments)};case 1:return function(t){return n.apply(this,arguments)};case 2:return function(t,r){return n.apply(this,arguments)};case 3:return function(t,r,e){return n.apply(this,arguments)};case 4:return function(t,r,e,u){return n.apply(this,arguments)};case 5:return function(t,r,e,u,o){return n.apply(this,arguments)};case 6:return function(t,r,e,u,o,i){return n.apply(this,arguments)};case 7:return function(t,r,e,u,o,i,c){return n.apply(this,arguments)};case 8:return function(t,r,e,u,o,i,c,a){return n.apply(this,arguments)};case 9:return function(t,r,e,u,o,i,c,a,f){return n.apply(this,arguments)};case 10:return function(t,r,e,u,o,i,c,a,f,l){return n.apply(this,arguments)};default:throw new Error("First argument to _arity must be a non-negative integer no greater than ten")}},f=function(t,n){return function(){return n.call(this,t.apply(this,arguments))}},l=function(t){return function n(r,o){switch(arguments.length){case 0:return n;case 1:return e(r)?n:u(function(n){return t(r,n)});default:return e(r)&&e(o)?n:e(r)?u(function(n){return t(n,o)}):e(o)?u(function(n){return t(r,n)}):t(r,o)}}},s=function(t){return function n(r,o,i){switch(arguments.length){case 0:return n;case 1:return e(r)?n:l(function(n,e){return t(r,n,e)});case 2:return e(r)&&e(o)?n:e(r)?l(function(n,r){return t(n,o,r)}):e(o)?l(function(n,e){return t(r,n,e)}):u(function(n){return t(r,o,n)});default:return e(r)&&e(o)&&e(i)?n:e(r)&&e(o)?l(function(n,r){return t(n,r,i)}):e(r)&&e(i)?l(function(n,r){return t(n,o,r)}):e(o)&&e(i)?l(function(n,e){return t(r,n,e)}):e(r)?u(function(n){return t(n,o,i)}):e(o)?u(function(n){return t(r,n,i)}):e(i)?u(function(n){return t(r,o,n)}):t(r,o,i)}}},p=function(){function t(t){this.f=t}return t.prototype["@@transducer/init"]=function(){throw new Error("init not implemented on XWrap")},t.prototype["@@transducer/result"]=function(t){return t},t.prototype["@@transducer/step"]=function(t,n){return this.f(t,n)},function(n){return new t(n)}}(),y=l(function(t,n){return a(t.length,function(){return t.apply(n,arguments)})}),h=Array.isArray||function(t){return null!=t&&t.length>=0&&"[object Array]"===Object.prototype.toString.call(t)},g=function(t){return"[object String]"===Object.prototype.toString.call(t)},d=u(function(t){return!!h(t)||!!t&&("object"==typeof t&&(!g(t)&&(1===t.nodeType?!!t.length:0===t.length||t.length>0&&(t.hasOwnProperty(0)&&t.hasOwnProperty(t.length-1)))))}),b=function(){function t(t,n,r){for(var e=0,u=r.length;e<u;){if((n=t["@@transducer/step"](n,r[e]))&&n["@@transducer/reduced"]){n=n["@@transducer/value"];break}e+=1}return t["@@transducer/result"](n)}function n(t,n,r){for(var e=r.next();!e.done;){if((n=t["@@transducer/step"](n,e.value))&&n["@@transducer/reduced"]){n=n["@@transducer/value"];break}e=r.next()}return t["@@transducer/result"](n)}function r(t,n,r){return t["@@transducer/result"](r.reduce(y(t["@@transducer/step"],t),n))}var e="undefined"!=typeof Symbol?Symbol.iterator:"@@iterator";return function(u,o,i){if("function"==typeof u&&(u=p(u)),d(i))return t(u,o,i);if("function"==typeof i.reduce)return r(u,o,i);if(null!=i[e])return n(u,o,i[e]());if("function"==typeof i.next)return n(u,o,i);throw new TypeError("reduce: list must be array or iterable")}}(),v=s(b),m=function(t,n){return function(){var r=arguments.length;if(0===r)return n();var e=arguments[r-1];return h(e)||"function"!=typeof e[t]?n.apply(this,arguments):e[t].apply(e,Array.prototype.slice.call(arguments,0,r-1))}},j=s(m("slice",function(t,n,r){return Array.prototype.slice.call(r,t,n)})),w=u(m("tail",j(1,1/0))),O=function(){if(0===arguments.length)throw new Error("pipe requires at least one argument");return a(arguments[0].length,v(f,arguments[0],w(arguments)))},S=u(function(t){return g(t)?t.split("").reverse().join(""):Array.prototype.slice.call(t,0).reverse()}),A=function(t){return"[object Function]"===Object.prototype.toString.call(t)},x=function t(n,r,u){return function(){for(var o=arguments,i=[],c=0,f=n,l=0;l<r.length||c<arguments.length;){var s;l<r.length&&(!e(r[l])||c>=o.length)?s=r[l]:(s=o[c],c+=1),i[l]=s,e(s)||(f-=1),l+=1}return f<=0?u.apply(this,i):a(f,t(n,i,u))}},E=l(function(t,n){return 1===t?u(n):a(t,x(t,[],n))}),C=function(t){for(var n,r=[];!(n=t.next()).done;)r.push(n.value);return r},k=function(t){var n=String(t).match(/^function (\w*)/);return null==n?"":n[1]},T=function(t,n){return Object.prototype.hasOwnProperty.call(n,t)},U=l(function(t,n){return t===n?0!==t||1/t==1/n:t!==t&&n!==n}),N=function(){var t=Object.prototype.toString;return"[object Arguments]"===t.call(arguments)?function(n){return"[object Arguments]"===t.call(n)}:function(t){return T("callee",t)}}(),q=function(){var t=!{toString:null}.propertyIsEnumerable("toString"),n=["constructor","valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],r=function(){return arguments.propertyIsEnumerable("length")}(),e=function(t,n){for(var r=0;r<t.length;){if(t[r]===n)return!0;r+=1}return!1};return u("function"!=typeof Object.keys||r?function(u){if(Object(u)!==u)return[];var o,i,c=[],a=r&&N(u);for(o in u)!T(o,u)||a&&"length"===o||(c[c.length]=o);if(t)for(i=n.length-1;i>=0;)o=n[i],T(o,u)&&!e(c,o)&&(c[c.length]=o),i-=1;return c}:function(t){return Object(t)!==t?[]:Object.keys(t)})}(),I=function t(n,r,e,u){if(U(n,r))return!0;if(o(n)!==o(r))return!1;if(null==n||null==r)return!1;if("function"==typeof n.equals||"function"==typeof r.equals)return"function"==typeof n.equals&&n.equals(r)&&"function"==typeof r.equals&&r.equals(n);switch(o(n)){case"Arguments":case"Array":case"Object":if("function"==typeof n.constructor&&"Promise"===k(n.constructor))return n===r;break;case"Boolean":case"Number":case"String":if(typeof n!=typeof r||!U(n.valueOf(),r.valueOf()))return!1;break;case"Date":if(!U(n.valueOf(),r.valueOf()))return!1;break;case"Error":return n.name===r.name&&n.message===r.message;case"RegExp":if(n.source!==r.source||n.global!==r.global||n.ignoreCase!==r.ignoreCase||n.multiline!==r.multiline||n.sticky!==r.sticky||n.unicode!==r.unicode)return!1;break;case"Map":case"Set":if(!t(C(n.entries()),C(r.entries()),e,u))return!1;break;case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"ArrayBuffer":break;default:return!1}var i=q(n);if(i.length!==q(r).length)return!1;for(var c=e.length-1;c>=0;){if(e[c]===n)return u[c]===r;c-=1}for(e.push(n),u.push(r),c=i.length-1;c>=0;){var a=i[c];if(!T(a,r)||!t(r[a],n[a],e,u))return!1;c-=1}return e.pop(),u.pop(),!0},D=l(function(t,n){return I(t,n,[],[])}),F=function(t,n,r){var e,u;if("function"==typeof t.indexOf)switch(typeof n){case"number":if(0===n){for(e=1/n;r<t.length;){if(0===(u=t[r])&&1/u===e)return r;r+=1}return-1}if(n!==n){for(;r<t.length;){if("number"==typeof(u=t[r])&&u!==u)return r;r+=1}return-1}return t.indexOf(n,r);case"string":case"boolean":case"function":case"undefined":return t.indexOf(n,r);case"object":if(null===n)return t.indexOf(n,r)}for(;r<t.length;){if(D(t[r],n))return r;r+=1}return-1},P=function(t,n){return F(n,t,0)>=0},M=function(t,n){for(var r=0,e=n.length,u=Array(e);r<e;)u[r]=t(n[r]),r+=1;return u},B=function(t){return'"'+t.replace(/\\/g,"\\\\").replace(/[\b]/g,"\\b").replace(/\f/g,"\\f").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t").replace(/\v/g,"\\v").replace(/\0/g,"\\0").replace(/"/g,'\\"')+'"'},R=function(){var t=function(t){return(t<10?"0":"")+t};return"function"==typeof Date.prototype.toISOString?function(t){return t.toISOString()}:function(n){return n.getUTCFullYear()+"-"+t(n.getUTCMonth()+1)+"-"+t(n.getUTCDate())+"T"+t(n.getUTCHours())+":"+t(n.getUTCMinutes())+":"+t(n.getUTCSeconds())+"."+(n.getUTCMilliseconds()/1e3).toFixed(3).slice(2,5)+"Z"}}(),W=function(t){return function(){return!t.apply(this,arguments)}},L=function(t){return"function"==typeof t["@@transducer/step"]},$=function(t,n){for(var r=0,e=n.length,u=[];r<e;)t(n[r])&&(u[u.length]=n[r]),r+=1;return u},z=function(t){return"[object Object]"===Object.prototype.toString.call(t)},H={init:function(){return this.xf["@@transducer/init"]()},result:function(t){return this.xf["@@transducer/result"](t)}},X=function(){function t(t,n){this.xf=n,this.f=t}return t.prototype["@@transducer/init"]=H.init,t.prototype["@@transducer/result"]=H.result,t.prototype["@@transducer/step"]=function(t,n){return this.f(n)?this.xf["@@transducer/step"](t,n):t},l(function(n,r){return new t(n,r)})}(),Y=l(function(t,n,r){return function(){if(0===arguments.length)return r();var e=Array.prototype.slice.call(arguments,0),u=e.pop();if(!h(u)){for(var o=0;o<t.length;){if("function"==typeof u[t[o]])return u[t[o]].apply(u,e);o+=1}if(L(u)){return n.apply(null,e)(u)}}return r.apply(this,arguments)}}(["filter"],X,function(t,n){return z(n)?b(function(r,e){return t(n[e])&&(r[e]=n[e]),r},{},q(n)):$(t,n)})),Z=l(function(t,n){return Y(W(t),n)}),_=function t(n,r){var e=function(e){var u=r.concat([n]);return P(e,u)?"<Circular>":t(e,u)},u=function(t,n){return M(function(n){return B(n)+": "+e(t[n])},n.slice().sort())};switch(Object.prototype.toString.call(n)){case"[object Arguments]":return"(function() { return arguments; }("+M(e,n).join(", ")+"))";case"[object Array]":return"["+M(e,n).concat(u(n,Z(function(t){return/^\d+$/.test(t)},q(n)))).join(", ")+"]";case"[object Boolean]":return"object"==typeof n?"new Boolean("+e(n.valueOf())+")":n.toString();case"[object Date]":return"new Date("+(isNaN(n.valueOf())?e(NaN):B(R(n)))+")";case"[object Null]":return"null";case"[object Number]":return"object"==typeof n?"new Number("+e(n.valueOf())+")":1/n==-1/0?"-0":n.toString(10);case"[object String]":return"object"==typeof n?"new String("+e(n.valueOf())+")":B(n);case"[object Undefined]":return"undefined";default:if("function"==typeof n.toString){var o=n.toString();if("[object Object]"!==o)return o}return"{"+u(n,q(n)).join(", ")+"}"}},G=u(function(t){return _(t,[])}),J=l(function(t,n){return E(t+1,function(){var r=arguments[t];if(null!=r&&A(r[n]))return r[n].apply(r,Array.prototype.slice.call(arguments,0,t));throw new TypeError(G(r)+' does not have a method named "'+n+'"')})}),K=J(1,"join"),Q=function(t){var n=arguments;if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var r=Object(t),e=1,u=arguments.length;e<u;){var o=n[e];if(null!=o)for(var i in o)T(i,o)&&(r[i]=o[i]);e+=1}return r},V="function"==typeof Object.assign?Object.assign:Q,tt=l(function(t,n){return V({},t,n)}),nt=u(function(t){return function(){return t}}),rt=l(function(t,n){var r,e=Number(n),u=0;if(e<0||isNaN(e))throw new RangeError("n must be a non-negative number");for(r=new Array(e);u<e;)r[u]=t(u),u+=1;return r}),et=l(function(t,n){return rt(nt(t),n)}),ut=function(){if(0===arguments.length)throw new Error("compose requires at least one argument");return O.apply(this,S(arguments))}(K(""),et("a")),ot=function(t,n){var r=document.createElement("div");r.textContent=ut(n),r.style="position:absolute;visibility:hidden";var e;return t.appendChild(r),e=r.scrollWidth,t.removeChild(r),e},it=function(n){var r=this;this.config=tt({width:50},n),t(function(){r.children=Array.from(r.config.source.children),r.config.source.style="height:0;position:absolute;overflow:hidden",r.resizeSource();var t=r.children[0].innerHTML.match(/(?:<[^>]+>|\S+)/g),n=[],e=[];t.forEach(function(t){null!==t.match(/^<\//)?n.pop():null!==t.match(/^</)?n.push(t):e.push([c(n),t,c(n.reverse().map(function(t){return"</"+t.replace(/^<(\w+).+$/,"$1")+">"}))])})})};return it.prototype.resizeSource=function(){this.measuredWidth=ot(this.config.source,this.config.width),this.config.source.style.width=this.measuredWidth+"px"},it});
//# sourceMappingURL=split-article.js.map
