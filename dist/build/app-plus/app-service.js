if("undefined"==typeof Promise||Promise.prototype.finally||(Promise.prototype.finally=function(e){const t=this.constructor;return this.then((n=>t.resolve(e()).then((()=>n))),(n=>t.resolve(e()).then((()=>{throw n}))))}),"undefined"!=typeof uni&&uni&&uni.requireGlobal){const e=uni.requireGlobal();ArrayBuffer=e.ArrayBuffer,Int8Array=e.Int8Array,Uint8Array=e.Uint8Array,Uint8ClampedArray=e.Uint8ClampedArray,Int16Array=e.Int16Array,Uint16Array=e.Uint16Array,Int32Array=e.Int32Array,Uint32Array=e.Uint32Array,Float32Array=e.Float32Array,Float64Array=e.Float64Array,BigInt64Array=e.BigInt64Array,BigUint64Array=e.BigUint64Array}uni.restoreGlobal&&uni.restoreGlobal(Vue,weex,plus,setTimeout,clearTimeout,setInterval,clearInterval),function(e){"use strict";const t=(e,t)=>{const n=e.__vccOpts||e;for(const[o,i]of t)n[o]=i;return n};const n=t({data:()=>({title:"Hello"}),onLoad(){},methods:{goTo(){uni.navigateTo({url:"../signin/signin"})}}},[["render",function(t,n,o,i,a,r){return e.openBlock(),e.createElementBlock("view",{class:"content"},[e.createElementVNode("image",{class:"logo",src:"/static/logo.png"}),e.createElementVNode("view",{class:"text-area"},[e.createElementVNode("text",{class:"title"},e.toDisplayString(a.title),1)]),e.createElementVNode("view",null,[e.createElementVNode("button",{onClick:n[0]||(n[0]=e=>r.goTo())},"点我跳转")])])}]]);function o(e,t,...n){uni.__log__?uni.__log__(e,t,...n):console[e].apply(console,[...n,t])}const i=t({data:()=>({}),methods:{goTo1(){o("log","at pages/signin/signin.vue:65","到注册页面1"),uni.navigateTo({url:"../signup/signup"})},goTo2(){o("log","at pages/signin/signin.vue:71","到注册页面2"),uni.navigateTo({url:"../signup/signup"})}}},[["render",function(t,n,o,i,a,r){return e.openBlock(),e.createElementBlock("view",{class:"page"},[e.createElementVNode("view",{class:"up-section"},[e.createElementVNode("view",{class:"up-section-text"},[e.createElementVNode("view",{class:"up-section-text-big"},[e.createElementVNode("p",{class:"big-p"},"您好！"),e.createElementVNode("p",{class:"big-p"},"欢迎来到儒升")]),e.createElementVNode("view",{class:"up-section-text-small"}," 第一代数字化知识交互学习软件(鸿蒙版) ")])]),e.createElementVNode("view",{class:"down-section"},[e.createElementVNode("view",{class:"input-section"},[e.createElementVNode("view",{class:"phone-num"},[e.createElementVNode("view",{style:{"font-size":"20px","font-weight":"600"}}," 手机号 "),e.createElementVNode("view",{class:"uni-input1"},[e.createElementVNode("input",{style:{"margin-left":"7%"},placeholder:"请输入您的手机号"})])]),e.createElementVNode("view",{class:"pin-code"},[e.createElementVNode("view",{style:{"font-size":"20px","font-weight":"600"}}," 密码 "),e.createElementVNode("view",{class:"uni-input2"},[e.createElementVNode("input",{style:{"margin-left":"7%"},focus:"",placeholder:"请输入您的密码"})])]),e.createElementVNode("view",{class:"forget-pin",onClick:n[0]||(n[0]=e=>t.goTo())},"忘记密码?")]),e.createElementVNode("view",{class:"button-section"},[e.createElementVNode("view",{class:"sign-in"},[e.createElementVNode("button",{class:"bt-sign-in",onClick:n[1]||(n[1]=e=>r.goTo1())},"登录")]),e.createElementVNode("view",{class:"sign-up"},[e.createElementVNode("button",{class:"bt-sign-up",onClick:n[2]||(n[2]=e=>r.goTo2())},"注册")])]),e.createElementVNode("view",{class:"otherway-sign-in"},[e.createElementVNode("view",{class:"other-way"},[e.createElementVNode("image",{class:"other-way-img",src:"/static/logo.png",mode:"aspectFit"}),e.createElementVNode("image",{class:"other-way-img",src:"/static/logo.png",mode:"aspectFit"}),e.createElementVNode("image",{class:"other-way-img",src:"/static/logo.png",mode:"aspectFit"})]),e.createElementVNode("view",{class:"split-line"}," — 其他登录方式 — ")])])])}]]);const a=t({data:()=>({}),methods:{}},[["render",function(t,n,o,i,a,r){return e.openBlock(),e.createElementBlock("view")}]]);__definePage("pages/index/index",n),__definePage("pages/signin/signin",i),__definePage("pages/signup/signup",a);const r={onLaunch:function(){o("log","at App.vue:4","App Launch")},onShow:function(){o("log","at App.vue:7","App Show")},onHide:function(){o("log","at App.vue:10","App Hide")}};const{app:l,Vuex:s,Pinia:c}={app:e.createVueApp(r)};uni.Vuex=s,uni.Pinia=c,l.provide("__globalStyles",__uniConfig.styles),l._component.mpType="app",l._component.render=()=>{},l.mount("#app")}(Vue);