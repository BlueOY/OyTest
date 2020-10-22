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
    u.showLog = function(msg){
        //输出Log，Log将显示在APICloud Studio控制台
        console.log(msg);
    };
    //字符串转json
    u.strToJson = function(str){
        // 去掉转义字符
        str = str.replace(/\\/g, "");
        str = str.replace(/^\"|\"$/g,'');
        var json = JSON.parse(str);
        return json;
    };
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
                alert("error：url="+url);
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
                alert("error：url="+url);
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
                alert("error：name="+name);
            }
        });
    };
    u.getCloudFile = function(fileid, success, async){
        if (async == undefined) {
            async = true;
        }
        var url = "/getCloudFile";
        var data = {
            fileid: fileid,
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
                alert("error：fileid="+fileid);
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
    };
    //自动填写表单数据
    u.setFormData = function (jsonObj) {
        //var obj = eval("(" + jsonStr + ")");
        var obj = jsonObj;
        var key, value, tagName, type, arr;
        for (x in obj) {
            key = x;
            value = obj[x];

            $("[name='" + key + "'],[name='" + key + "[]']").each(function () {
                tagName = $(this)[0].tagName;
                type = $(this).attr('type');
                if (tagName == 'INPUT') {
                    if (type == 'radio') {
                        //$(this).attr('checked', $(this).val() == value);
                        if ($(this).val() == value) {
                            $(this).attr('checked', true);
                        }
                    } else if (type == 'checkbox') {
                        if (typeof (value) == 'string' && value.indexOf(",") != -1) {
                            arr = value.split(',');
                            for (var i = 0; i < arr.length; i++) {
                                if ($(this).val() == arr[i]) {
                                    $(this).attr('checked', true);
                                    break;
                                }
                            }
                        } else if (value instanceof Array) {
                            arr = value;
                            for (var i = 0; i < arr.length; i++) {
                                if ($(this).val() == arr[i]) {
                                    $(this).attr('checked', true);
                                    break;
                                }
                            }
                        } else {
                            if ($(this).val() == value) {
                                $(this).attr('checked', true);
                            }
                        }
                    } else {
                        if (value != "-1") {
                            $(this).val(value);
                        }
                    }
                } else if (tagName == 'TEXTAREA') {
                    $(this).val(value);
                } else if (tagName == 'DIV' || tagName == 'SPAN' || tagName == 'TH' || tagName == 'TD') {
                    if (value != null) {
                        $(this).text(value);
                    }
                } else if (tagName == 'SELECT') {
                    $(this).find("option[value='" + value + "']").attr("selected", true);
                }

            });
        }
    };
    window.$Common = u;
})(window);