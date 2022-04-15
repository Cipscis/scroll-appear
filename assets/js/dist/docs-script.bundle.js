(()=>{"use strict";const e=function(e,t){let s=null,i=null;return function(...n){s?(i&&clearTimeout(i),i=setTimeout((()=>{e.apply(this,n),i=null}),t)):(e.apply(this,n),s=setTimeout((()=>{s=null}),t))}};let t=!1;try{const e={get passive(){return t=!0,!1}},s=()=>{};window.addEventListener("test",s,e),window.removeEventListener("test",s)}catch(e){t=!1}const s=t,i="data-scroll-appear-state";var n;!function(e){e.UNINITIALISED="uninitialised",e.HIDDEN="hidden",e.APPEARING="appearing",e.VISIBLE="visible"}(n||(n={}));class a{#e;#t;#s;#i;constructor(){this.#e=[],this.#t=null,this.#s=null,this.#i=0}push(e){this.#n(e)||e.getState()===n.HIDDEN&&(this.#e.push(e),this.#a())}catchUp(){for(let e=0;e<this.#e.length;e++){const t=this.#e[e];!1===t.isInViewport()&&(0===e?this.#o():(this.#e.splice(e,1),t.appear()),e-=1)}}#n(e){return this.#e.includes(e)}#a(){0!==this.#e.length?null===this.#t&&(this.#t=setTimeout((()=>this.#o()),this.#i)):this.#s=setTimeout((()=>{this.#i=0,this.#s=null}),this.#i)}#o(){this.#s&&(clearTimeout(this.#s),this.#s=null),this.#t&&clearTimeout(this.#t),this.#t=null;let e=this.#e.shift();for(;e?.getState()===n.VISIBLE;)e=this.#e.shift();e&&(e.appear(),this.#i=e.delay,this.#a())}}const o=new Map,l=new a;function r(e=document){const t=o.get(e)||new a;return!1===o.has(e)&&o.set(e,t),t}function u(){const e=[];for(const t of o.values())e.push(t);return e}o.set(document,l);const c=new Map;function h(e){return c.get(e)||new m(e)}class m{#l;#r;#u;constructor(e){if(c.has(e))throw new Error("Cannot create a second `ScrollAppearItem` for the same `Element`");c.set(e,this),this.#l=e,this.#r=this.#c(),this.#u=Number(e.getAttribute("data-scroll-appear-delay"))||0,this.getState()===n.UNINITIALISED&&this.#h(n.HIDDEN),this.#l.addEventListener("focusin",(()=>this.appear()),{once:!0})}get delay(){return this.#u}isInViewport(e=0){const t=window.innerHeight/2-50;e>t&&(e=t);const s=this.#l.getBoundingClientRect(),i=e,n=(window.innerHeight||document.documentElement.clientWidth)-e,a=s.bottom>=i,o=s.top<=n;return a&&o}appear(){this.getState()!==n.VISIBLE&&(matchMedia("(prefers-reduced-motion)").matches?this.#h(n.VISIBLE):(this.#h(n.APPEARING),"0s"!==getComputedStyle(this.#l).transitionDuration?this.#l.addEventListener("transitionend",(()=>this.#h(n.VISIBLE)),{once:!0}):this.#h(n.VISIBLE)))}#h(e){this.#l.setAttribute(i,e)}getState(){const e=this.#l.getAttribute(i);return t=e,Object.values(n).includes(t)?e:n.UNINITIALISED;var t}#c(){const e=this.#l.getAttribute("data-scroll-appear-queue");if(e)return r(e);const t=this.#l.closest(".js-scroll-appear__container");return t?r(t):r()}queue(){this.#r.push(this)}}const d=new MutationObserver((function(e,t){let s=!1;for(const t of e)if(t.addedNodes.length>0){s=!0;break}if(!0===s){const e=document.querySelectorAll(".js-scroll-appear:not([data-scroll-appear-state])");e.length>0&&p(e)}}));function p(e){const t=function(e){return e||(e=document.querySelectorAll(".js-scroll-appear")),Array.from(e).map(h)}(e);!function(e){e.filter((e=>e.getState()===n.HIDDEN)).filter((e=>e.isInViewport())).forEach((e=>e.queue()))}(t)}function I(e){p()}function f(){const e=u();for(const t of e)t.catchUp()}p(),function(){const t=!s||{passive:!0},i=e(I,200);window.addEventListener("scroll",i,t),window.addEventListener("resize",i,t);const n=e(f,200);window.addEventListener("scroll",n,t),window.addEventListener("resize",n,t)}(),d.observe(document,{childList:!0,subtree:!0}),window.setTimeout((()=>{const e=document.createElement("div");e.classList.add("js-scroll-appear"),e.classList.add("example"),e.setAttribute("data-scroll-appear-queue","example-queue");const t=document.querySelectorAll(".example__grid");t.length&&t[t.length-1].appendChild(e)}),2e3)})();
//# sourceMappingURL=docs-script.bundle.js.map