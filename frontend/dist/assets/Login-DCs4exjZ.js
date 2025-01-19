import{r as i,u as c,a as u,b as p,j as e,L as x}from"./index-xDXY4j5q.js";import{m as t}from"./motion-Cw7l5jrn.js";const h=()=>{const[o,n]=i.useState(""),[d,l]=i.useState("");c(),u();const{loading:a,error:s}=p(r=>r.auth),m=async r=>{};return e.jsx(t.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.5},className:"min-h-[80vh] flex items-center justify-center",children:e.jsx("div",{className:"bg-white p-8 rounded-lg shadow-lg w-full max-w-md",children:e.jsxs(t.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.2},children:[e.jsx("h2",{className:"text-3xl font-bold text-center text-gray-800 mb-8",children:"Welcome Back"}),s&&e.jsx(t.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4",children:s}),e.jsxs("form",{onSubmit:m,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700",children:"Email"}),e.jsx("input",{id:"email",type:"email",value:o,onChange:r=>n(r.target.value),className:"mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700",children:"Password"}),e.jsx("input",{id:"password",type:"password",value:d,onChange:r=>l(r.target.value),className:"mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500",required:!0})]}),e.jsx("button",{type:"submit",disabled:a,className:"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",children:a?e.jsx("div",{className:"w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"}):"Sign In"})]}),e.jsxs("p",{className:"mt-4 text-center text-sm text-gray-600",children:["Don't have an account?"," ",e.jsx(x,{to:"/register",className:"font-medium text-primary-600 hover:text-primary-500",children:"Sign up"})]})]})})})};export{h as default};
