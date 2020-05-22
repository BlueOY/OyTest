Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
function httpGet(url, data, success){
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
}
function httpPost(url, data, success){
  $.ajax({
    type: 'POST',
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
}