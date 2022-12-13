define(['underscore','Magento_Ui/js/lib/spinner','rjsResolver','./adapter','uiCollection','mageUtils','jquery','Magento_Ui/js/core/app','mage/validation'],function(_,loader,resolver,adapter,Collection,utils,$,app){'use strict';function prepareParams(params){var result='?';_.each(params,function(value,key){result+=key+'='+value+'&';});return result.slice(0,-1);}
function collectData(items){var result={},name;items=Array.prototype.slice.call(items);items.forEach(function(item){switch(item.type){case'checkbox':result[item.name]=+!!item.checked;break;case'radio':if(item.checked){result[item.name]=item.value;}
break;case'select-multiple':name=item.name.substring(0,item.name.length-2);result[name]=_.pluck(item.selectedOptions,'value');break;default:result[item.name]=item.value;}});return result;}
function makeRequest(params,data,url){var save=$.Deferred();data=utils.serialize(data);data['form_key']=window.FORM_KEY;if(!url){save.resolve();}
$('body').trigger('processStart');$.ajax({url:url+prepareParams(params),data:data,dataType:'json',success:function(resp){if(resp.ajaxExpired){window.location.href=resp.ajaxRedirect;}
if(!resp.error){save.resolve(resp);return true;}
$('body').notification('clear');$.each(resp.messages,function(key,message){$('body').notification('add',{error:resp.error,message:message,insertMethod:function(msg){$('.page-main-actions').after(msg);}});});},complete:function(){$('body').trigger('processStop');}});return save.promise();}
function isValidFields(items){var result=true;_.each(items,function(item){if(!$.validator.validateSingleElement(item)){result=false;}});return result;}
return Collection.extend({defaults:{additionalFields:[],additionalInvalid:false,selectorPrefix:'.page-content',messagesClass:'messages',errorClass:'.admin__field._error',eventPrefix:'.${ $.index }',ajaxSave:false,ajaxSaveType:'default',imports:{reloadUrl:'${ $.provider}:reloadUrl'},listens:{selectorPrefix:'destroyAdapter initAdapter','${ $.name }.${ $.reloadItem }':'params.set reload'},exports:{selectorPrefix:'${ $.provider }:client.selectorPrefix',messagesClass:'${ $.provider }:client.messagesClass'}},initialize:function(){this._super().initAdapter();resolver(this.hideLoader,this);return this;},initObservable:function(){return this._super().observe(['responseData','responseStatus']);},initConfig:function(){this._super();this.selector='[data-form-part='+this.namespace+']';return this;},initAdapter:function(){adapter.on({'reset':this.reset.bind(this),'save':this.save.bind(this,true,{}),'saveAndContinue':this.save.bind(this,false,{})},this.selectorPrefix,this.eventPrefix);return this;},destroyAdapter:function(){adapter.off(['reset','save','saveAndContinue'],this.eventPrefix);return this;},hideLoader:function(){loader.get(this.name).hide();return this;},save:function(redirect,data){this.validate();if(!this.additionalInvalid&&!this.source.get('params.invalid')){this.setAdditionalData(data).submit(redirect);}else{this.focusInvalid();}},focusInvalid:function(){var invalidField=_.find(this.delegate('checkInvalid'));if(!_.isUndefined(invalidField)&&_.isFunction(invalidField.focused)){invalidField.focused(true);}
return this;},setAdditionalData:function(data){_.each(data,function(value,name){this.source.set('data.'+name,value);},this);return this;},submit:function(redirect){var additional=collectData(this.additionalFields),source=this.source;_.each(additional,function(value,name){source.set('data.'+name,value);});source.save({redirect:redirect,ajaxSave:this.ajaxSave,ajaxSaveType:this.ajaxSaveType,response:{data:this.responseData,status:this.responseStatus},attributes:{id:this.namespace}});},validate:function(){this.additionalFields=document.querySelectorAll(this.selector);this.source.set('params.invalid',false);this.source.trigger('data.validate');this.set('additionalInvalid',!isValidFields(this.additionalFields));},reset:function(){this.source.trigger('data.reset');$('[data-bind*=datepicker]').val('');},overload:function(){this.source.trigger('data.overload');},reload:function(){makeRequest(this.params,this.data,this.reloadUrl).then(function(data){app(data,true);});}});});