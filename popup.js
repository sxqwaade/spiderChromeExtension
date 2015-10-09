/**
 * Created by songxiaoqiang on 2015/9/29.
 */
    "use strict";
var prolist = [],
    checkStatus = 0;
Array.prototype.indexOf = function(val){
    for(var i=0;i<this.length;i++){
        if(this[i] == val) return i;
    }
    return -1;
}
Array.prototype.remove = function(index){
    if(isNaN(index) || index >= this.length){
        return false
    }
    for(var i = 0,n=0;i<this.length;i++){
        if(this[i] != this[this]){
            this[n++] = this[i];
        }
    }
    this.length -= 1;
}
function bindEvent(){
    var data = chrome.extension.getBackgroundPage().proData;
    $("button#btn").click(function(){
        if("undefined" == typeof data.title){
            $("#message").text("请进入商品页面抓取");
            return false
        }else{
            $("#message").text("");
        }
        for(var i =0;i<prolist.length;i++){
            if(data.title == prolist[i].title){
                $("#message").text("您已经抓取过当前页面商品的数据");
                return false
            }
        }
        if(checkStatus == 0){
            appendInfo(data,"append");
            prolist.push(data);
            var str = JSON.stringify(prolist);
            window.localStorage["kaluliprolist"] = str;
            $("#message").text("");
            var h = $(window).height();
            $("body,html").scrollTop(h);
        }else{
            $("#message").text("您已经抓取过当前页面商品的数据");
        }
        checkStatus = 1;
    });

    $("button.del").on('click',function(){
        var index = $(this).parents("tr").index();
        $("tbody tr:eq("+index+")").remove();
        prolist.remove(index);
        var str = JSON.stringify(prolist);
        window.localStorage["kaluliprolist"] = str;
    });

    $("button#removeall").click(function(){
        var checkclick = window.confirm("你确定要删除所有数据吗？");
        if(checkclick){
            $("tbody tr").remove();
            prolist = [];
            window.localStorage.kaluliprolist = "[]";
        }
    });

    $("button.introBtn").on('click',function(){
        var index = $(this).parents("tr").index(),
            context = $(this).siblings().val();
        prolist[index].sellad = context;
        var str = JSON.stringify(prolist);
        window.localStorage["kaluliprolist"] = str;
    });

    $("body").on("click",".sectionBtn",function(){
        var index =  $(this).parents("tr").index(),
            context = $(this).siblings().val();
        prolist[index].sectionname = context;
        var str = JSON.stringify(prolist);
        window.localStorage["kaluliprolist"] = str;
        //console.log(prolist[index].sectionname);
    });


    $("#checkout").click(function(){
        $(".filelink").text("请稍等...");
        $.post("http://192.168.9.3:3000/kaluliactivity/prolist",{prolist:prolist},function(data){
            //console.log(data);
            if("undefined" != typeof data){
                $(".filelink").text("prolist.xls").attr("href",data.filepath).css("display","inline");
                window.localStorage.xlspath = data.filepath;
            }
        });
    });
}

function appendInfo(data,event){
    var ele = "<tr>\
                  <td><button class='del'>删除</button></td>\
                  <td><input class='sectionname' type='text' value="+data.sectionname+"><button class='sectionBtn'>提交修改</button></td>\
                  <td><img height='50' src="+data.pic+" /></td>\
                  <td><a href="+data.url+" target='_blank'>"+data.title+"</a></td>\
                  <td><textarea>"+data.sellad+"</textarea><button class='introBtn'>提交修改</button></td>\
                  <td>"+data.price+"</td>\
                  <td>"+data.discount_price+"</td>\
                  <td>"+data.stock+"</td>\
                  <td>"+data.url+"</td>\
               </tr>";
    event == "prepend" ?  $("tbody").prepend(ele) : $("tbody").append(ele);
}

function init(){
    if("undefined" != typeof localStorage.kaluliprolist){
        var datas = $.parseJSON(localStorage.kaluliprolist);
        //console.log(datas);
        for(var i=0;i<datas.length;i++) {
            appendInfo(datas[i],"append");
        }
        prolist = datas;
    }
    if("undefined" != typeof localStorage.xlspath){
        $(".filelink").attr("href",localStorage.xlspath).css("display","inline");
    }else{
        $(".filelink").hide();
    }

    //appendInfo(datas,"append");


    bindEvent();
}

$(function(){
   init();
});
