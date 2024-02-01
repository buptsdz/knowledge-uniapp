import{q as s,u as e,n as t,o as a,e as l,w as o,i,b as n,l as r,d as u,f as c,I as d,h as p}from"./index-e7070bf1.js";import{_ as f}from"./logo-light.4630de23.js";import{_ as g,a as h,b as m}from"./apple-logo-raw.a5aa7133.js";import{_}from"./_plugin-vue_export-helper.1b428a4d.js";const w=_({data:()=>({user:{usernameOrPhone:"",password:""},passwordVisible:!1}),onLoad(){console.log("密码状态",this.passwordVisible)},methods:{togglePasswordVisibility(){this.passwordVisible=!this.passwordVisible,console.log("密码状态",this.passwordVisible)},async onSubmit(t){0!=this.user.usernameOrPhone.length&&0!=this.user.password?this.$service.post("/user-service/api/auth/login",{usernameOrPhone:this.user.usernameOrPhone,password:this.user.password}).then((t=>{if(console.log("登录信息：",t),1==t.data.isSuccess){var a=t.data.data.token;e("token",a),s({title:"登录成功！",icon:"success"}),this.$router.push("../basefunction/basefunction")}else s({title:t.data.message,icon:"none",duration:2e3})})).catch((e=>{console.log(e),s({title:"网络错误",icon:"none",duration:2e3})})):s({title:"输入的手机号或密码不能为空！",icon:"error",position:"top"})},goTores(){console.log("到注册页面"),t({url:"../register/register"})}}},[["render",function(s,e,t,_,w,b){const y=i,x=c,V=d,k=p;return a(),l(y,{class:"page"},{default:o((()=>[n(y,{class:"up-section"},{default:o((()=>[n(y,{class:"up-section-text"},{default:o((()=>[n(y,{class:"up-section-text-big"},{default:o((()=>[r("p",{class:"big-p"},"您好！"),r("p",{class:"big-p"},"欢迎来到儒升")])),_:1}),n(y,{class:"up-section-text-small"},{default:o((()=>[u(" 第一代数字化知识交互学习软件(鸿蒙版) ")])),_:1})])),_:1}),n(y,{class:"logo-section"},{default:o((()=>[n(x,{style:{height:"48vw"},src:f,alt:"",mode:"aspectFit"})])),_:1})])),_:1}),n(y,{class:"down-section"},{default:o((()=>[n(y,{class:"input-section"},{default:o((()=>[n(y,{class:"phone-num"},{default:o((()=>[n(y,{style:{"font-size":"20px","font-weight":"600"}},{default:o((()=>[u(" 手机号 ")])),_:1}),n(y,{class:"uni-input1"},{default:o((()=>[n(V,{type:"text",style:{"margin-left":"7%"},placeholder:"请输入您的手机号或用户名",modelValue:w.user.usernameOrPhone,"onUpdate:modelValue":e[0]||(e[0]=s=>w.user.usernameOrPhone=s)},null,8,["modelValue"])])),_:1})])),_:1}),n(y,{class:"pin-code"},{default:o((()=>[n(y,{style:{"font-size":"20px","font-weight":"600"}},{default:o((()=>[u(" 密码 ")])),_:1}),n(y,{class:"uni-input2"},{default:o((()=>[n(V,{password:!w.passwordVisible,style:{"margin-left":"7%"},focus:"",placeholder:"请输入您的密码",modelValue:w.user.password,"onUpdate:modelValue":e[1]||(e[1]=s=>w.user.password=s)},null,8,["password","modelValue"]),n(y,{style:{"flex-grow":"1",display:"flex","justify-content":"flex-end"}},{default:o((()=>[n(x,{style:{height:"18px",width:"18px",right:"20%"},onClick:b.togglePasswordVisibility,src:w.passwordVisible?"../../static/image/symple/pin-visible.png":"../../static/image/symple/pin-invisible.png",mode:"aspectFit"},null,8,["onClick","src"])])),_:1})])),_:1}),n(y,{class:"forget-pin",onClick:e[2]||(e[2]=e=>s.goTo())},{default:o((()=>[u("忘记密码?")])),_:1})])),_:1}),n(y,{class:"button-section"},{default:o((()=>[n(y,{class:"sign-in"},{default:o((()=>[n(k,{class:"bt-sign-in",onClick:b.onSubmit},{default:o((()=>[u("登录")])),_:1},8,["onClick"])])),_:1}),n(y,{class:"sign-up"},{default:o((()=>[n(k,{class:"bt-sign-up",onClick:e[3]||(e[3]=s=>b.goTores())},{default:o((()=>[u("注册")])),_:1})])),_:1})])),_:1}),n(y,{class:"otherway-sign-in"},{default:o((()=>[n(y,{class:"other-way"},{default:o((()=>[n(y,{class:"other-way-img"},{default:o((()=>[n(x,{style:{height:"25px",width:"25px"},src:g,mode:"aspectFit"})])),_:1}),n(y,{class:"other-way-img"},{default:o((()=>[n(x,{style:{height:"24px",width:"24px"},src:h,mode:"aspectFit"})])),_:1}),n(y,{class:"other-way-img"},{default:o((()=>[n(x,{style:{height:"22px",width:"22px","margin-top":"-5px"},src:m,mode:"aspectFit"})])),_:1})])),_:1}),n(y,{class:"split-line"},{default:o((()=>[u(" — 其他登录方式 — ")])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-80b9f52f"]]);export{w as default};
