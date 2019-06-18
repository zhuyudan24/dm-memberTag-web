webpackJsonp([12],{"308P":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});a("J16i");var r=a("3E4D"),o=a("P9l9"),l={name:"manualTagEdit",props:{showPop:Boolean,options:Object},data:function(){return{ruleForm:{tagName:"",tagLevel:"test",tagTwoLevelGroupId:"",tagLevelGroupId:"",tagDescribe:"",pending:!1},rules:{tagName:[{required:!0,message:"请输入标签名称",trigger:"blur"}],tagLevel:[{required:!0,message:""}],tagLevelGroupId:[{required:!0,message:"请选择所属分类",trigger:"blur"}],tagTwoLevelGroupId:[{required:!0,message:"请选择所属分类",trigger:"blur"}]},optionsTwo:[],optionsThree:[],tagValTableData:[]}},watch:{options:{deep:!0,handler:function(e){this.ruleForm.tagTwoLevelGroupId=e.tagTwoLevelGroupId,this.ruleForm.tagLevelGroupId=e.tagLevelGroupId,e.tagId?this.getTagData(e.tagId):(this.ruleForm.tagName="",this.getOptionsThree(e.tagTwoLevelGroupId))}}},methods:{closePop:function(){this.$emit("update:showPop",!1)},confirmSave:function(){var e=this;this.ruleForm.pending||(this.ruleForm.pending=!0,this.$refs.ruleForm.validate(function(t){t&&e.saveApi()}))},saveApi:function(){var e=this,t={tagId:this.options.tagId,tagName:this.ruleForm.tagName,tagDescribe:this.ruleForm.tagDescribe,tagLevelGroupId:this.ruleForm.tagLevelGroupId};Object(o.a)("/memberTag/saveHandMemberTag",t).then(function(t){var a=t.data,o=a.errorCode,l=a.message;e.ruleForm.pending=!1,1===o?(r.a.showmsg("保存成功","success"),e.$emit("save"),e.closePop()):e.$message.error({duration:1e3,message:l})}).catch(function(t){e.ruleForm.pending=!1,e.$message.error({duration:1e3,message:t.message})})},getOptionsTwo:function(){var e=this;return Object(o.a)("/tagLevel/handSecondLevel",{}).then(function(t){var a=t.data,r=a.errorCode,o=a.result;1===r&&(e.optionsTwo=o)}).catch(function(t){e.$message.error({duration:1e3,message:t.message})})},changeTwo:function(e){this.ruleForm.tagLevelGroupId="",this.getOptionsThree(e)},getOptionsThree:function(e){var t=this;Object(o.a)("/tagLevel/handThirdLevel",{tagLevelGroupId:e}).then(function(e){var a=e.data,r=a.errorCode,o=a.result;1===r&&(t.optionsThree=o)}).catch(function(e){t.$message.error({duration:1e3,message:e.message})})},getTagData:function(e){var t=this;Object(o.a)("/memberTag/getTagById",{tagId:e}).then(function(e){var a=e.data,r=a.errorCode,o=a.result;1===r&&(t.ruleForm.tagName=o.tagName,t.ruleForm.tagLevelGroupId=o.tagLevelGroupId,t.ruleForm.tagTwoLevelGroupId=o.tagTwoLevelGroupId,t.ruleForm.tagDescribe=o.tagDescribe,t.getOptionsThree(o.tagTwoLevelGroupId))}).catch(function(e){console.log(e)})}},mounted:function(){this.getOptionsTwo()}},s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{visible:e.showPop,title:e.options.popTitle,width:"566px"},on:{"update:visible":function(t){e.showPop=t},close:e.closePop}},[a("div",{staticClass:"manualTagEdit-wrap"},[a("el-form",{ref:"ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"78px"}},[a("el-form-item",{staticClass:"w-329",attrs:{label:"标签名称",prop:"tagName"}},[a("el-input",{staticClass:"w-220",attrs:{placeholder:"请输入内容",maxlength:10},model:{value:e.ruleForm.tagName,callback:function(t){e.$set(e.ruleForm,"tagName",t)},expression:"ruleForm.tagName"}}),e._v(" "),a("label",{staticClass:"input-label"},[e._v(e._s(e.ruleForm.tagName.length)+"/10")])],1),e._v(" "),a("el-form-item",{attrs:{label:"所属分类",prop:"tagLevel"}},[a("el-form-item",{staticClass:"fl",attrs:{prop:"tagTwoLevelGroupId"}},[a("el-select",{staticClass:"w-220",attrs:{placeholder:"请选择"},on:{change:e.changeTwo},model:{value:e.ruleForm.tagTwoLevelGroupId,callback:function(t){e.$set(e.ruleForm,"tagTwoLevelGroupId",t)},expression:"ruleForm.tagTwoLevelGroupId"}},e._l(e.optionsTwo,function(e){return a("el-option",{key:e.tagLevelGroupId,attrs:{label:e.levelName,value:e.tagLevelGroupId}})}))],1),e._v(" "),a("el-form-item",{staticClass:"fl",attrs:{prop:"tagLevelGroupId"}},[a("el-select",{staticClass:"w-220 m-l-8",attrs:{placeholder:"请选择"},model:{value:e.ruleForm.tagLevelGroupId,callback:function(t){e.$set(e.ruleForm,"tagLevelGroupId",t)},expression:"ruleForm.tagLevelGroupId"}},e._l(e.optionsThree,function(e){return a("el-option",{key:e.tagLevelGroupId,attrs:{label:e.levelName,value:e.tagLevelGroupId}})}))],1)],1),e._v(" "),a("el-form-item",{staticClass:"w-560",attrs:{label:"标签描述",prop:"tagDescribe"}},[a("el-input",{staticClass:"w-447",attrs:{type:"textarea",row:"4",maxlength:200},model:{value:e.ruleForm.tagDescribe,callback:function(t){e.$set(e.ruleForm,"tagDescribe",t)},expression:"ruleForm.tagDescribe"}}),e._v(" "),a("label",{staticClass:"textarea-label"},[e._v(e._s(e.ruleForm.tagDescribe.length)+"/200")])],1)],1),e._v(" "),a("div",{staticClass:"manualTagEdit-btns"},[a("el-button",{on:{click:e.closePop}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.confirmSave}},[e._v("保存")])],1)],1)])},staticRenderFns:[]};var i=a("VU/8")(l,s,!1,function(e){a("UDLx")},"data-v-e78b0000",null);t.default=i.exports},UDLx:function(e,t){}});