google.maps.__gjsload__('stats', function(_){'use strict';var P3=function(a,b,c){var d=[];_.Ic(a,function(a,c){d.push(c+b+a)});return d.join(c)},Q3=function(a,b,c,d){var e={};e.host=window.document.location&&window.document.location.host||window.location.host;e.v=a;e.r=Math.round(1/b);c&&(e.client=c);d&&(e.key=d);return e},Xca=function(a){var b={};_.Ic(a,function(a,d){b[(0,window.encodeURIComponent)(d)]=(0,window.encodeURIComponent)(a).replace(/%7C/g,"|")});return P3(b,":",",")},Yca=function(a,b,c,d){var e=_.W.j[23],f=_.W.j[22];this.ka=a;this.ta=
b;this.ua=null!=e?e:500;this.U=null!=f?f:2;this.$=c;this.V=d;this.R=new _.dk;this.j=0;this.T=_.Ga();R3(this)},R3=function(a){window.setTimeout(function(){Zca(a);R3(a)},Math.min(a.ua*Math.pow(a.U,a.j),2147483647))},S3=function(a,b,c){a.R.set(b,c)},Zca=function(a){var b=Q3(a.ta,a.$,a.V,void 0);b.t=a.j+"-"+(_.Ga()-a.T);a.R.forEach(function(a,d){var e=a();0<e&&(b[d]=Number(e.toFixed(2))+(_.Jk()?"":"-if"))});a.ka.j({ev:"api_snap"},b);++a.j},T3=function(a,b,c,d,e){this.V=a;this.ka=b;this.U=c;this.R=d;this.T=
e;this.j=new _.dk;this.$=_.Ga()},U3=function(a,b,c){this.U=b;this.R=a+"/maps/gen_204";this.T=c},V3=function(){this.j=new _.dk},$ca=function(a){var b=0,c=0;a.j.forEach(function(a){b+=a.fr;c+=a.Gq});return c?b/c:0},W3=function(a,b,c,d,e){this.$=a;this.ka=b;this.V=c;this.T=d;this.U=e;this.R={};this.j=[]},X3=function(a,b,c,d){this.T=a;_.J.bind(this.T,"set_at",this,this.U);_.J.bind(this.T,"insert_at",this,this.U);this.$=b;this.ka=c;this.V=d;this.R=0;this.j={};this.U()},Y3=function(){this.T=_.Sf(_.W);var a;
_.X[35]?(a=_.Jf(_.W).j[11],a=null!=a?a:""):a=_.Ix;this.j=new U3(a,_.jj,window.document);new X3(_.gj,(0,_.u)(this.j.j,this.j),_.Ag,!!this.T);a=_.Of(_.Xf());this.ka=a.split(".")[1]||a;_.ij&&(this.U=new Yca(this.j,this.ka,this.va,this.T));this.ta={};this.$={};this.V={};this.ua={};this.va=_.Rf()};
T3.prototype.ta=function(a){var b=_.sa(void 0)?void 0:1;this.j.isEmpty()&&window.setTimeout((0,_.u)(function(){var a=Q3(this.ka,this.U,this.R,this.T);a.t=_.Ga()-this.$;var b=this.j;_.ek(b);for(var e={},f=0;f<b.j.length;f++){var g=b.j[f];e[g]=b.wa[g]}_.uB(a,e);this.j.clear();this.V.j({ev:"api_maprft"},a)},this),500);b=this.j.get(a,0)+b;this.j.set(a,b)};
U3.prototype.j=function(a,b){var c=b||{},d=_.Vk().toString(36);c.src="apiv3";c.token=this.U;c.ts=d.substr(d.length-6);a.cad=Xca(c);c=P3(a,"=","&");c=this.R+"?target=api&"+c;this.T.createElement("img").src=c;(d=_.Nc.__gm_captureCSI)&&d(c)};V3.prototype.R=function(a,b,c){this.j.set(_.pb(a),{fr:b,Gq:c})};W3.prototype.ta=function(a){this.R[a]||(this.R[a]=!0,this.j.push(a),2>this.j.length&&_.LB(this,this.ua,500))};
W3.prototype.ua=function(){for(var a=Q3(this.ka,this.V,this.T,this.U),b=0,c;c=this.j[b];++b)a[c]="1";a.hybrid=+((_.Mk()||!_.Nk())&&_.Nk());this.j.length=0;this.$.j({ev:"api_mapft"},a)};X3.prototype.U=function(){for(var a;a=this.T.removeAt(0);){var b=a.kq;a=a.timestamp-this.ka;++this.R;this.j[b]||(this.j[b]=0);++this.j[b];if(20<=this.R&&!(this.R%5)){var c={};c.s=b;c.sr=this.j[b];c.tr=this.R;c.te=a;c.hc=this.V?"1":"0";this.$({ev:"api_services"},c)}}};Y3.prototype.Ia=function(a){a=_.pb(a);this.ta[a]||(this.ta[a]=new W3(this.j,this.ka,this.va,this.T));return this.ta[a]};Y3.prototype.Ea=function(a){a=_.pb(a);this.$[a]||(this.$[a]=new T3(this.j,this.ka,1,this.T));return this.$[a]};Y3.prototype.R=function(a){if(this.U){this.V[a]||(this.V[a]=new _.MC,S3(this.U,a,function(){return b.qc()}));var b=this.V[a];return b}};Y3.prototype.ya=function(a){if(this.U){this.ua[a]||(this.ua[a]=new V3,S3(this.U,a,function(){return $ca(b)}));var b=this.ua[a];return b}};
var ada=new Y3;_.nc("stats",ada);});