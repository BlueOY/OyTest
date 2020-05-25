Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
//时间类型转字符串的函数
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
(function(window){
    var u = {};
    u.httpGet = function(url, data, success){
        $.ajax({
            type: 'GET',
            url: url,
            data: data,
            // dataType: "json",
            success: function(data){
                if(success){
                    success(data)
                }
            },
            error: function(){
                alert("error");
            }
        });
    };
    u.httpPost = function(url, data, success){
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            // dataType: "json",
            // contentType : "application/json",
            success: function(data){
                if(success){
                    success(data)
                }
            },
            error: function(){
                alert("error");
            }
        });
    };
    u.invokeCloudFunction = function(name, param, success, async){
        if (async == undefined) {
            async = true;
        }
        var url = "/invokeCloudFunction";
        var data = {
            functionName: name,
            param: JSON.stringify(param),
        };
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            async: async,
            // dataType: "json",
            // contentType : "application/json",
            success: function(data){
                // data = decodeURI(data);
                if(success){
                    success(data)
                }
            },
            error: function(){
                alert("error");
            }
        });
    };
    //获取url参数
    u.getQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (undefined);
    },
    window.$Common = u;
})(window);