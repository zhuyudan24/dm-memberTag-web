webpackJsonp([4,28,30],{"9ZvA":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={name:"recommend-table",props:{data:Array},data:function(){return{tableData:[]}},watch:{data:{immediate:!0,handler:function(e){this.tableData=e}}},methods:{createMemberGroup:function(e){console.log(e)}}},s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-table",{attrs:{data:e.tableData}},[a("el-table-column",{attrs:{label:"查看详情",type:"expand",width:"200"}}),e._v(" "),a("el-table-column",{attrs:{prop:"groupName",label:"分组名称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"describle",label:"分组描述"}}),e._v(" "),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){e.createMemberGroup(t)}}},[e._v("创建会员分组")])]}}])})],1)},staticRenderFns:[]},o=a("VU/8")(n,s,!1,null,null,null);t.default=o.exports},"C5v+":function(e,t){},SJ7l:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("Dd8w"),s=a.n(n),o=a("lRwf"),r=a.n(o),i=a("zL8q"),c=a("2CGT");r.a.component(i.CollapseTransition.name,i.CollapseTransition);var l={name:"group-list",data:function(){return{lists:[],addGroupDialog:!1,expendTxt:"展开",groupName:"",title:"新增分组名称",currentIndex:0,active:!1}},computed:{expendClass:function(){return"展开"!=this.expendTxt?"is-caret":""}},methods:{handleNoEditClassifyName:function(){this.lists=this.lists.map(function(e){return s()({},e,{edit:!1})})},handleChangeIndex:function(e,t){this.active=!1,this.currentIndex=e,this.$emit("second-list",t)},editGroupName:function(e){if(e.edit)this.modifyName(e);else{if(!this.operatorName(e))return;e.edit=!0}},deleteGroupName:function(e){var t=this;if(this.operatorName(e))return e.edit?(e.edit=!1,void this.getMemberGroupList()):void this.$confirm("删除分组名称，包括该分组下的内容，确定删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.excludeName(e)}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},excludeName:function(e){var t=this,a={requestProject:"gic-member-tag-web",memberTagGroupClassifyId:e.memberTagGroupClassifyId};Object(c.k)(a).then(function(e){1==e.errorCode&&(t.getMemberGroupList(),t.$message({type:"success",message:"删除成功!"}))})},modifyName:function(e){var t=this;if(e.classifyName){var a={requestProject:"gic-member-tag-web",classifyName:e.classifyName,memberTagGroupClassifyId:e.memberTagGroupClassifyId};Object(c.m)(a).then(function(a){1==a.errorCode&&(e.edit=!1,t.getMemberGroupList(),t.$message({type:"success",message:"修改成功",duration:2e3}))})}else this.$message({message:"分组名称不能为空！",type:"warning",duration:2e3})},operatorName:function(e){return"0"!=e.memberTagGroupClassifyId||(this.$message({message:e.classifyName+"的不能操作",type:"warning",duration:2e3}),!1)},handleGroupDialog:function(){var e=this;if(this.groupName){var t={requestProject:"gic-member-tag-web",classifyName:this.groupName};Object(c.m)(t).then(function(t){1==t.errorCode&&(e.getMemberGroupList(),e.groupName="",e.addGroupDialog=!1,e.$message({type:"success",message:"添加成功"}))})}else this.$message({type:"warning",message:"分组名称不能为空"})},getMemberGroupList:function(){var e=this;Object(c.l)({requestProject:"gic-member-tag-web"}).then(function(t){1===t.errorCode&&(e.lists=t.result.map(function(e){return s()({},e,{edit:!1})}))})},handleExpend:function(){this.expendTxt="展开"===this.expendTxt?"收起":"展开"}},beforeMount:function(){this.getMemberGroupList()}},u={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"group-list"},[a("div",{staticClass:"member-group"},[a("i",{staticClass:"icon-list el-icon-caret-top icon-transform",class:e.expendClass,on:{click:e.handleExpend}}),e._v("\n    我的会员分组\n    "),a("i",{staticClass:"el-icon-plus icon-right icon-list",on:{click:function(t){e.addGroupDialog=!0}}})]),e._v(" "),a("el-collapseTransition",[a("ul",{directives:[{name:"show",rawName:"v-show",value:"展开"==e.expendTxt,expression:"expendTxt == '展开'"}],staticClass:"lists"},e._l(e.lists,function(t,n){return a("li",{key:n,class:["member-list",{"active-li":n==e.currentIndex}],on:{click:function(a){e.handleChangeIndex(n,t)}}},[a("span",{directives:[{name:"show",rawName:"v-show",value:!t.edit,expression:"!list.edit"}],staticClass:"name-txt",attrs:{title:t.classifyName}},[e._v(e._s(t.classifyName))]),e._v(" "),a("el-input",{directives:[{name:"show",rawName:"v-show",value:t.edit,expression:"list.edit"}],staticStyle:{width:"100px"},attrs:{size:"mini",maxLength:"10"},nativeOn:{keyup:function(a){if(!("button"in a)&&e._k(a.keyCode,"enter",13,a.key))return null;e.modifyName(t)}},model:{value:t.classifyName,callback:function(a){e.$set(t,"classifyName",a)},expression:"list.classifyName"}}),e._v(" "),"未分类"!==t.classifyName?a("div",{staticClass:"oper-area"},[a("i",{staticClass:"iconfont icon-list-oper",class:[t.edit?"icon-dagou":"icon-bianji1"],on:{click:function(a){a.stopPropagation(),e.editGroupName(t)}}}),e._v(" "),a("i",{staticClass:"iconfont icon-list-oper",class:[t.edit?"icon-guanbi1":"icon-guanbi"],on:{click:function(a){e.deleteGroupName(t)}}})]):e._e()],1)}))]),e._v(" "),a("el-dialog",{attrs:{title:e.title,visible:e.addGroupDialog,width:"320px",top:"30vh","close-on-click-modal":!1},on:{"update:visible":function(t){e.addGroupDialog=t}}},[a("div",[e._v("\n      分组名称：\n      "),a("el-input",{staticStyle:{width:"200px"},attrs:{placeholder:"请输入分组名称",maxlength:8,clearable:""},model:{value:e.groupName,callback:function(t){e.groupName=t},expression:"groupName"}})],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.addGroupDialog=!1}}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.handleGroupDialog}},[e._v("确 定")])],1)])],1)},staticRenderFns:[]};var m=a("VU/8")(l,u,!1,function(e){a("UZrL")},"data-v-0141d494",null);t.default=m.exports},UZrL:function(e,t){},oVck:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("Dd8w"),s=a.n(n),o=a("2CGT"),r={name:"batch-list",props:{batchVisiable:Boolean,operateNumber:Number,multipleSelection:Array},data:function(){return{batchDialog:!1,operNum:-1,groupList:[],groupName:"",listIndex:-1}},methods:{confirmBatch:function(){var e=this;console.log(this.operateNumber);var t=this.operateNumber,a={requestProject:"gic-member-tag-web",memberTagGroupIds:this.selectionList.map(function(e){return e.memberTagGroupId}).join(",")};if(0==t)a.effectiveStatus=0,Object(o.d)(a).then(function(t){1==t.errorCode&&e.$message.success({message:"修改成功"})}).catch(function(e){console.log(e)});else if(1==t)Object(o.c)(a).then(function(t){1==t.errorCode&&e.$message.success({message:"删除成功"})});else if(2==t){if(!this.groupName)return void this.$message.warning({message:"请先选择的会员分组的分类"});var n=this.groupList.findIndex(function(t){return t.classifyName===e.groupName});a.memberTagGroupClassifyId=this.groupList[n].memberTagGroupClassifyId,Object(o.b)(a).then(function(t){1==t.errorCode&&e.$message.success({message:"修改分类成功"})}).catch(function(e){console.log(e)})}this.closeBatch(),this.$emit("refresh-list")},chooseGroup:function(e,t){this.listIndex=t,this.groupName=e.classifyName},closeBatch:function(){this.batchDialog=!1,this.$emit("update:batchVisiable",!1)},getMemberGroupList:function(){var e=this;Object(o.l)({requestProject:"gic-member-tag-web"}).then(function(t){1===t.errorCode&&(e.groupList=t.result.filter(function(e){return"未分类"!=e.classifyName}).map(function(e){return s()({},e,{edit:!1})}))}).catch(function(e){console.log(e)})}},created:function(){this.selectionList=[]},watch:{batchVisiable:function(e){this.batchDialog=e,this.getMemberGroupList()},operateNumber:function(e){this.operNum=e},multipleSelection:{immediate:!0,handler:function(e){this.selectionList=e}}}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:"",width:"400px",top:"30vh","custom-class":"cre-dialog",visible:e.batchDialog,center:"","modal-append-to-body":!1,"before-close":e.closeBatch},on:{"update:visible":function(t){e.batchDialog=t}}},[a("p",{staticClass:"tips",attrs:{slot:"title"},slot:"title"},[e._v(e._s(0==e.operNum?"批量失效":1==e.operNum?"批量删除":"修改所属分类"))]),e._v(" "),a("div",{staticClass:"batch-content"},[0==e.operNum?a("div",[a("div",{staticClass:"el-message-box__status el-icon-warning"}),e._v(" "),a("p",{staticClass:"batch-txt"},[e._v("该分组失效后，不再更新数据，确认要失效吗？")])]):e._e(),e._v(" "),1==e.operNum?a("div",[a("div",{staticClass:"el-message-box__status el-icon-warning"}),e._v(" "),a("p",{staticClass:"batch-txt"},[e._v("一旦删除无法恢复，确认要批量删除分组吗？")])]):e._e(),e._v(" "),2==e.operNum?a("div",[a("p",{staticClass:"title"},[e._v("\n        我的会员分组\n      ")]),e._v(" "),a("ul",{staticClass:"batch-ul"},e._l(e.groupList,function(t,n){return a("li",{key:t.memberTagGroupClassifyId,staticClass:"batch-li",class:{"active-li":n==e.listIndex},on:{click:function(a){e.chooseGroup(t,n)}}},[e._v("\n          "+e._s(t.classifyName)+"\n        ")])})),e._v(" "),a("p",{staticClass:"group-name"},[e._v("选中的分组："+e._s(e.groupName))])]):e._e()]),e._v(" "),a("div",{staticClass:"cre-btn"},[a("el-button",{on:{click:e.closeBatch}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.confirmBatch}},[e._v("确 定")])],1)])},staticRenderFns:[]};var c=a("VU/8")(r,i,!1,function(e){a("C5v+")},"data-v-586b7225",null).exports,l=a("3Xzz"),u=a("Ch4/"),m=function(e,t){function a(e){return(e=e.toString())[1]?e:"0"+e}if(null!=e){var n=new Date(e),s=n.getFullYear(),o=n.getMonth()+1,r=n.getDate(),i=n.getHours(),c=n.getMinutes(),l=n.getSeconds();return[s,o,r].map(a).join(t||"-")+" "+[i,c,l].map(a).join(":")}return"--"},p=a("P9l9"),d=a("SJ7l"),f=a("9ZvA"),h={name:"memberGroupList",components:{navCrumb:l.a,GroupList:d.default,RecommendTable:f.default,BatchList:c},data:function(){return{operateNumber:-1,batchVisiable:!1,dialogVisible:!0,isRecommend:!1,recommendItems:[],recommendData:[],activeName:"",navpath:[{name:"首页",path:window.location.origin+"/report/#/memberSummary",relocation:!0},{name:"会员管理",path:""},{name:"会员分组",path:""}],tagSearch:"",groupTableData:[],multipleSelection:[],currentPage:1,pageSize:20,total:0,groupSetShow:!1,loading:!1,statusSelect:"",batchSelect:""}},watch:{tagSearch:function(e){this.params.groupName=e},batchVisiable:function(e){e||(this.batchSelect="")}},filters:{formatTimeYMD:function(e){return e&&"- -"!=e?e.split(" ")[0]:"--"},formatTimeHMS:function(e){return e&&"- -"!=e?e.split(" ")[1]:"--"},formatNum:function(e){return(e+"").replace(/\d{1,3}(?=(\d{3})+$)/g,"$&,")},formatUpdateFrequency:function(e){var t=e.updateType,a=e.updateDay;if(1===e.isRealTime)return"--";switch(t){case 1:return"每天一次";case 2:return a?"每周"+["一","二","三","四","五","六","日"][a-1]:"每周一次";case 3:return a?"每月"+a+"号":"每月一次";default:return"--"}}},methods:{getMemberGroupList:function(){var e=this;Object(o.l)({requestProject:"gic-member-tag-web"}).then(function(t){1===t.errorCode&&(e.options[2].children=t.result.filter(function(e){return"未分类"!=e.classifyName}))})},refershMember:function(){var e=this,t={requestProject:"gic-member-tag-web",memberTagGroupIds:this.groupTableData.map(function(e){return e.memberTagGroupId}).join(",")};Object(o.r)(t).then(function(t){1==t.errorCode&&(e.getGroupList(e.params),e.$message.success({message:"更新成功"}))})},refreshList:function(){this.getGroupList()},getsecondList:function(e){var t=this;this.isRecommend=!1,this.params.memberTagGroupClassifyId=e.memberTagGroupClassifyId,Object(o.h)(this.params).then(function(e){1==e.errorCode?(t.total=e.result.totalCount,t.groupTableData=e.result.result.map(function(e){return s()({},e,{createTime:m(e.createTime)})})):t.groupTableData=[]}).catch(function(e){console.log(e)})},handleTabClick:function(e){var t=this.checkTabIndex(e);t&&this.getRecommendList(t)},checkTabIndex:function(e){var t=this.recommendItems.findIndex(function(t){return t.recommendName==e.name});if(t>=0)return this.recommendItems[t].tagGroupRecommendId},getRecommend:function(){var e=this;this.isRecommend=!0,Object(o.p)().then(function(t){1==t.errorCode&&(e.recommendItems=t.result,e.recommendItems&&e.recommendItems.length?(e.activeName=e.recommendItems[0].recommendName,e.getRecommendList(e.recommendItems[0].tagGroupRecommendId)):e.recommendItems=[])}).catch(function(e){console.log(e)})},getRecommendList:function(e){var t=this,a={tagGroupRecommendId:e,requestProject:"gic-member-tag-web"};Object(o.q)(a).then(function(e){1==e.errorCode?t.recommendData=e.result:t.recommendData=[]}).catch(function(e){console.log(e)})},handleSelectionChange:function(e){this.multipleSelection=e},handleFocus:function(){if(!this.multipleSelection.length)return this.batchSelect="",this.$message.warning({message:"请先勾选分组",duration:2e3}),!1},batchHandleSelect:function(e){if(!this.multipleSelection.length)return this.batchSelect="",this.$message.warning({message:"请先勾选分组",duration:2e3}),!1;this.operateNumber=e,this.batchVisiable=!0},showGroupSet:function(){this.groupSetShow=!0},changeRoute:function(e){this.$router.push(e)},toAddGroup:function(){this.changeRoute("/memberGroupEdit")},clearSearch:function(){this.currentPage=1,this.params.pageNum=1,this.getGroupList()},searchEnterFun:function(e){this.currentPage=1,this.params.pageNum=1,this.getGroupList()},handleSizeChange:function(e){this.params.pageSize=e,this.pageSize=e,this.getGroupList()},handleCurrentChange:function(e){this.params.pageNum=e,this.currentPage=e,this.getGroupList()},toInvalid:function(e){var t=this;t.$confirm("该分组失效后，不再更新数据，确认要失效吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.loading=!0;var a={effectiveStatus:"0",memberTagGroupId:e.memberTagGroupId};t.updateGroup(a,e)}).catch(function(){})},switchAppStatus:function(e,t){this.loading=!0;var a={memberTagGroupId:t.memberTagGroupId,appStatus:e};this.updateGroup(a,t)},refreshGroup:function(e){var t=this;t.loading=!0;var a={memberTagGroupId:e.memberTagGroupId};Object(p.a)("/member-tag-member/getMemberCountByGroupId.json",a).then(function(a){e.memberCount=a.data.result,t.loading=!1}).catch(function(e){t.loading=!1})},updateGroup:function(e,t){var a=this;Object(p.a)("/member-tag-group/simpleUpdate.json",e).then(function(n){t.effectiveStatus=e.effectiveStatus||t.effectiveStatus,t.memberCount=e.memberCount||0==e.memberCount?e.memberCount:t.memberCount,a.loading=!1,a.$message.success({duration:1e3,message:"操作成功！"}),a.loading=!1}).catch(function(e){a.loading=!1})},cancelDelTag:function(e,t){t.popVisible=!1},toDelTag:function(e,t){var a=this;a.$confirm("该分组覆盖"+a.$options.filters.formatNum(e.memberCount||0)+"人，一旦删除无法恢复，确认要删除吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.loading=!0,a.delGroup(e.memberTagGroupId,t)}).catch(function(){})},delGroup:function(e,t){var a=this,n={memberTagGroupId:e};Object(p.a)("/member-tag-group/delete.json",n).then(function(e){var n=e.data;if(a.loading=!1,1==n.errorCode)return a.groupTableData.splice(t,1),void a.$message.success({duration:1e3,message:"删除成功！"});200003!=n.errorCode?u.a.errorMsg(n):a.$confirm("该分组正在被活动使用，无法删除！","提示",{confirmButtonText:"确定",type:"warning"})}).catch(function(e){a.loading=!1,a.$message.error({duration:1e3,message:e.message})})},searchByStatus:function(e){this.params.effectiveStatus=e,this.getGroupList()},getGroupList:function(){var e=this;Object(o.n)(this.params).then(function(t){1==t.errorCode&&(e.total=t.result.totalCount,e.groupTableData=t.result.result.map(function(e){return s()({},e,{latestUpdateTime:e.latestUpdateTime?e.latestUpdateTime:"--",createTime:m(e.createTime)})})),e.loading=!1}).catch(function(e){console.log(e)})}},created:function(){this.loading=!0,this.params={groupName:this.tagSearch,pageSize:20,pageNum:1,effectiveStatus:this.statusSelect,requestProject:"gic-member-tag-web",memberTagGroupClassifyId:"0"}},mounted:function(){this.getGroupList()}},g={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"memberGroupList-wrap common-wrap"},[a("nav-crumb",{attrs:{navpath:e.navpath}}),e._v(" "),a("div",{staticClass:"right-content"},[a("div",{staticClass:"left-box"},[a("group-list",{on:{getRecommend:e.getRecommend,"second-list":e.getsecondList}})],1),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:!e.isRecommend,expression:"!isRecommend"}],staticClass:"right-box"},[a("div",{staticClass:"common-wrap__opt"},[a("el-input",{staticClass:"w-220 m-r-8",attrs:{placeholder:"请输入关键字搜索人群","prefix-icon":"el-icon-search",clearable:""},on:{clear:e.clearSearch},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.searchEnterFun(t)}},model:{value:e.tagSearch,callback:function(t){e.tagSearch=t},expression:"tagSearch"}}),e._v(" "),a("el-select",{staticClass:"w-220 m-l-0",attrs:{placeholder:"请选择"},on:{change:e.searchByStatus},model:{value:e.statusSelect,callback:function(t){e.statusSelect=t},expression:"statusSelect"}},[a("el-option",{key:0,attrs:{label:"失效",value:0}}),e._v(" "),a("el-option",{key:1,attrs:{label:"有效",value:1}}),e._v(" "),a("el-option",{key:"",attrs:{label:"全部",value:""}})],1),e._v(" "),a("div",{staticClass:"batch-option"},[a("el-select",{staticClass:"w-180 m-l-0",attrs:{placeholder:"批量操作"},on:{change:e.batchHandleSelect,focus:e.handleFocus},model:{value:e.batchSelect,callback:function(t){e.batchSelect=t},expression:"batchSelect"}},[a("el-option",{key:0,attrs:{label:"失效",value:0}}),e._v(" "),a("el-option",{key:1,attrs:{label:"删除",value:1}}),e._v(" "),a("el-option",{key:2,attrs:{label:"修改所属分类",value:2}})],1),e._v(" "),a("el-button",{staticClass:"fr",attrs:{type:"primary"},on:{click:e.toAddGroup}},[e._v("新增分组")])],1)],1),e._v(" "),a("div",{staticClass:"common-wrap__table m-t-20"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",attrs:{data:e.groupTableData,"tooltip-effect":"dark"},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),e._v(" "),a("el-table-column",{attrs:{label:"分组名称"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-popover",{attrs:{placement:"top-start",width:"200",trigger:"hover"}},[a("div",[a("p",[e._v("名称："+e._s(t.row.groupName))]),e._v(" "),a("p",[e._v("描述："+e._s(t.row.describle))])]),e._v(" "),a("router-link",{staticClass:"a-href",attrs:{slot:"reference",to:"/memberGroupDetail?memberTagGroupId="+t.row.memberTagGroupId},slot:"reference"},[e._v("\n                    "+e._s(t.row.groupName)+"\n                  ")])],1)]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"是否实时"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(1===t.row.isRealTime?"实时":"非实时")+"\n              ")]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"最近更新时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",{staticClass:"h-18"},[e._v(e._s(e._f("formatTimeYMD")(t.row.latestUpdateTime)))]),e._v(" "),a("p",{staticClass:"h-18"},[e._v(e._s(e._f("formatTimeHMS")(t.row.latestUpdateTime)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"更新频率"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e._f("formatUpdateFrequency")(t.row))+"\n              ")]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"state",label:"状态"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{class:1==t.row.effectiveStatus?"dm-status--success":"dm-status--error"}),e._v("\n                "+e._s(1==t.row.effectiveStatus?"有效":"失效")+"\n              ")]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"peopleCover",label:"覆盖人数","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(e._f("formatNum")(t.row.memberCount||0))+" 人\n              ")]}}])},[a("template",{attrs:{slot:"header"},slot:"header"},[e._v("\n                覆盖人数\n                "),a("el-popover",{attrs:{width:"260",trigger:"hover"}},[a("div",{staticStyle:{color:"#909399"}},[e._v("\n                    默认显示上次页面缓存人数，可点击刷新按钮查看当页分组最新人数。\n                  ")]),e._v(" "),a("i",{staticClass:"iconfont icon-zhongzhi refresh",attrs:{slot:"reference"},on:{click:e.refershMember},slot:"reference"})])],1)],2),e._v(" "),a("el-table-column",{attrs:{prop:"appStatus",label:"好办展示"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-switch",{attrs:{"active-value":1,"inactive-value":0,"active-color":"#1890ff"},on:{change:function(a){e.switchAppStatus(t.row.appStatus,t.row)}},model:{value:t.row.appStatus,callback:function(a){e.$set(t.row,"appStatus",a)},expression:"scope.row.appStatus"}})]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"createTime",label:"创建时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",{staticClass:"h-18"},[e._v(e._s(e._f("formatTimeYMD")(t.row.createTime)))]),e._v(" "),a("p",{staticClass:"h-18"},[e._v(e._s(e._f("formatTimeHMS")(t.row.createTime)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"recentUpdateDate",label:"到期时间"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("p",{staticClass:"h-18"},[e._v(e._s(e._f("formatTimeYMD")(t.row.effectiveDate)))]),e._v(" "),a("p",{staticClass:"h-18"},[e._v(e._s(e._f("formatTimeHMS")(t.row.effectiveDate)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"150px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("router-link",{staticClass:"edit-btn el-button--text p-r-12",attrs:{to:"/memberGroupDetail?memberTagGroupId="+t.row.memberTagGroupId}},[e._v("\n                  详情\n                ")]),e._v(" "),a("router-link",{staticClass:"edit-btn el-button--text p-r-12",attrs:{to:"/memberGroupEdit?memberTagGroupId="+t.row.memberTagGroupId}},[e._v("\n                  编辑\n                ")])]}}])})],1)],1),e._v(" "),0!=e.groupTableData.length?a("div",{staticClass:"block common-wrap__page text-right"},[a("el-pagination",{attrs:{background:"","current-page":e.currentPage,"page-sizes":[10,20,30,40],"page-size":e.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1):e._e()]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.isRecommend,expression:"isRecommend"}],staticClass:"right-box recommend-box"},[a("el-tabs",{on:{"tab-click":e.handleTabClick},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},e._l(e.recommendItems,function(t){return a("el-tab-pane",{key:t.tagGroupRecommendId,attrs:{label:t.recommendName,name:t.recommendName}},[a("recommend-table",{attrs:{data:e.recommendData}})],1)}))],1)]),e._v(" "),a("vue-gic-footer"),e._v(" "),a("batch-list",{attrs:{batchVisiable:e.batchVisiable,operateNumber:e.operateNumber,multipleSelection:e.multipleSelection},on:{"update:batchVisiable":function(t){e.batchVisiable=t},"refresh-list":e.refreshList}})],1)},staticRenderFns:[]};var b=a("VU/8")(h,g,!1,function(e){a("oYAw")},null,null);t.default=b.exports},oYAw:function(e,t){}});