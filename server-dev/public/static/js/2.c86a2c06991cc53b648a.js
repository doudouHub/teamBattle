webpackJsonp([2],{518:function(t,n,a){a(542);var e=a(200)(a(527),a(555),"data-v-6201733a",null);t.exports=e.exports},527:function(t,n,a){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var e=a(138),i=a.n(e),s=a(137);n.default={data:function(){return{}},computed:i()({},a.i(s.a)(["rankList"])),methods:{},mounted:function(){}}},533:function(t,n,a){n=t.exports=a(512)(void 0),n.push([t.i,"\nhtml[data-v-6201733a] {\n  background-color: #f4f4f4;\n}\n.battle-rankings[data-v-6201733a] {\n  max-width: 640px;\n  border-radius: 5px;\n  border: 1px solid #ddd;\n  background-color: #fff;\n  margin: 20px auto 50px;\n}\n.battle-rank-list[data-v-6201733a] {\n  margin: 0;\n  padding: 0;\n}\n.battle-rank-list .item[data-v-6201733a] {\n    border-bottom: 1px solid #ddd;\n    line-height: 50px;\n    padding: 0 15px;\n    font-size: 18px;\n    overflow: hidden;\n}\n.battle-rank-list .item .item-score[data-v-6201733a] {\n      font-weight: bold;\n}\n.battle-rank-list .item[data-v-6201733a]:last-child {\n      border-bottom: none;\n}\n",""])},542:function(t,n,a){var e=a(533);"string"==typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);a(513)("0f92ab44",e,!0)},555:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement,a=t._self._c||n;return a("div",[a("h1",{staticClass:"text-center"},[t._v("对战用户排名")]),t._v(" "),a("div",{staticClass:"battle-rankings"},[a("div",{staticClass:"battle-head"}),t._v(" "),a("div",{staticClass:"battle-content"},[a("ul",{staticClass:"battle-rank-list list-none"},t._l(t.rankList,function(n){return a("li",{key:n.userId,staticClass:"item"},[a("div",{staticClass:"item-name pull-left"},[t._v(t._s(n.userName))]),t._v(" "),a("div",{staticClass:"item-score pull-right"},[t._v(t._s(n.score))])])}))])])])},staticRenderFns:[]}}});