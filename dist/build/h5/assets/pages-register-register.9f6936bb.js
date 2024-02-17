import{q as e,o as s,e as t,w as o,i as a,b as i,l,d as n,v as d,t as u,f as c,I as r,h as p}from"./index-5c9c0eef.js";import{_ as h}from"./logo-light.4630de23.js";import{_ as m,a as f,b as g}from"./apple-logo-raw.a5aa7133.js";import{_ as w}from"./_plugin-vue_export-helper.1b428a4d.js";const _=w({data:()=>({user:{username:"",password:"",vercode:"",phonenum:""},phoneIstrue:0,sendcode:{isButtonDisabled:!1,countdown:0},passwordVisible:!1}),methods:{togglePasswordVisibility(){this.passwordVisible=!this.passwordVisible,console.log("密码状态",this.passwordVisible)},registOnSubmit(){const s={username:this.user.username,password:this.user.password,code:this.user.vercode,phone:this.user.phonenum};s.username&&s.password&&s.code&&s.phone&&(this.isPhone(this.user.phonenum),0!=this.phoneIstrue?this.$service.post("/user-service/api/auth/register",s).then((s=>{1==s.data.isSuccess?(e({title:"注册成功",icon:"success",duration:2e3}),this.$router.push("../basefunction/basefunction")):e({title:"注册失败: "+s.data.message,icon:"none",duration:2200})})).catch((s=>{e({title:"请求错误"+response.data.message,icon:"none",duration:2e3}),console.error("注册请求失败:",s)})):e({title:"请输入正确的手机号！",icon:"error",position:"top"}))},isPhone(e){11==e.length?/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(e)?(this.phoneIstrue=1,console.log("电话号码输入正确！")):(this.phoneIstrue=0,console.log("电话号码输入错误！")):(console.log("电话号码输入错误！"),this.phoneIstrue=0)},async getVercode(){try{if(this.isPhone(this.user.phonenum),0==this.phoneIstrue)return void e({title:"请输入正确的手机号！",icon:"error",position:"top"});1==(await this.$service.post("/user-service/api/auth/sms",{phone:this.user.phonenum})).data.isSuccess?(this.startCountdown(),e({title:"验证码已发送",icon:"success",duration:2e3})):e({title:"发送失败,请重试",icon:"none",duration:2e3})}catch(s){console.log(s),e({title:"请求出错",icon:"none",duration:2e3})}},startCountdown(){this.sendcode.isButtonDisabled=!0,this.sendcode.countdown=60;const e=setInterval((()=>{this.sendcode.countdown--,0===this.sendcode.countdown&&(clearInterval(e),this.sendcode.isButtonDisabled=!1)}),1e3)}}},[["render",function(e,w,_,b,y,x){const V=a,v=c,I=r,C=p;return s(),t(V,{class:"page"},{default:o((()=>[i(V,{class:"up-section"},{default:o((()=>[i(V,{class:"up-section-text"},{default:o((()=>[i(V,{class:"up-section-text-big"},{default:o((()=>[l("p",{class:"big-p"},"您好！"),l("p",{class:"big-p"},"欢迎来到儒升")])),_:1}),i(V,{class:"up-section-text-small"},{default:o((()=>[n(" 第一代数字化知识交互学习软件(鸿蒙版) ")])),_:1})])),_:1}),i(V,{class:"logo-section"},{default:o((()=>[i(v,{style:{height:"48vw"},src:h,alt:"",mode:"aspectFit"})])),_:1})])),_:1}),i(V,{class:"down-section"},{default:o((()=>[i(V,{class:"input-section"},{default:o((()=>[i(V,{class:"user-name"},{default:o((()=>[i(V,{style:{"font-size":"20px","font-weight":"600"}},{default:o((()=>[n(" 用户名 ")])),_:1}),i(V,{class:"uni-input1"},{default:o((()=>[i(I,{style:{"margin-left":"7%"},focus:"",placeholder:"请输入您的用户名",modelValue:y.user.username,"onUpdate:modelValue":w[0]||(w[0]=e=>y.user.username=e)},null,8,["modelValue"])])),_:1})])),_:1}),i(V,{class:"pass-word"},{default:o((()=>[i(V,{style:{"margin-top":"15px","font-size":"20px","font-weight":"600"}},{default:o((()=>[n(" 密码 ")])),_:1}),i(V,{class:"uni-input2"},{default:o((()=>[i(I,{password:!y.passwordVisible,style:{"margin-left":"7%"},placeholder:"请输入您的密码",modelValue:y.user.password,"onUpdate:modelValue":w[1]||(w[1]=e=>y.user.password=e)},null,8,["password","modelValue"]),i(V,{style:{"flex-grow":"1",display:"flex","justify-content":"flex-end"}},{default:o((()=>[i(v,{style:{height:"18px",width:"18px",right:"20%"},src:y.passwordVisible?"../../static/image/symple/pin-visible.png":"../../static/image/symple/pin-invisible.png",mode:"aspectFit",onClick:x.togglePasswordVisibility},null,8,["src","onClick"])])),_:1})])),_:1})])),_:1}),i(V,{class:"phone-num"},{default:o((()=>[i(V,{style:{"margin-top":"15px","font-size":"20px","font-weight":"600"}},{default:o((()=>[n(" 验证码 ")])),_:1}),i(V,{class:"uni-input3"},{default:o((()=>[i(I,{type:"tel",style:{"margin-left":"7%"},placeholder:"请输入您的手机号",modelValue:y.user.phonenum,"onUpdate:modelValue":w[2]||(w[2]=e=>y.user.phonenum=e)},null,8,["modelValue"]),i(V,{class:"get-verification-code"},{default:o((()=>[i(C,{class:d(["get-verification-code-button",{"button-disabled":y.sendcode.isButtonDisabled}]),onClick:x.getVercode,disabled:y.sendcode.isButtonDisabled},{default:o((()=>[n(u(y.sendcode.countdown?`${y.sendcode.countdown}`:"获取验证码"),1)])),_:1},8,["class","onClick","disabled"])])),_:1})])),_:1})])),_:1}),i(V,{class:"verification-ensure"},{default:o((()=>[i(V,{class:"uni-input4"},{default:o((()=>[i(I,{style:{"margin-left":"7%"},placeholder:"请输入验证码",modelValue:y.user.vercode,"onUpdate:modelValue":w[3]||(w[3]=e=>y.user.vercode=e)},null,8,["modelValue"])])),_:1})])),_:1})])),_:1}),i(V,{class:"button-section"},{default:o((()=>[i(V,{class:"sign-up"},{default:o((()=>[i(C,{class:"bt-sign-up",onClick:x.registOnSubmit},{default:o((()=>[n("注册")])),_:1},8,["onClick"])])),_:1})])),_:1}),i(V,{class:"otherway-sign-up"},{default:o((()=>[i(V,{class:"other-way"},{default:o((()=>[i(V,{class:"other-way-img"},{default:o((()=>[i(v,{style:{height:"25px",width:"25px"},src:m,mode:"aspectFit"})])),_:1}),i(V,{class:"other-way-img"},{default:o((()=>[i(v,{style:{height:"24px",width:"24px"},src:f,mode:"aspectFit"})])),_:1}),i(V,{class:"other-way-img"},{default:o((()=>[i(v,{style:{height:"22px",width:"22px","margin-top":"-5px"},src:g,mode:"aspectFit"})])),_:1})])),_:1}),i(V,{class:"split-line"},{default:o((()=>[n(" — 其他注册方式 — ")])),_:1})])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-911a7abd"]]);export{_ as default};