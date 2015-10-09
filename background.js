/**
 * Created by songxiaoqiang on 2015/9/29.
 */
var proData = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
    proData = request;
});