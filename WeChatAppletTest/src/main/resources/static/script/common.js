Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
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
    u.invokeCloudFunction = function(name, param, success){
        var url = "/invokeCloudFunction";
        var data = {
            functionName: name,
            param: JSON.stringify(param),
        };
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
    window.$Common = u;
})(window);