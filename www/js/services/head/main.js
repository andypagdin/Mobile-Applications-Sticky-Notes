app.factory('Css', function(){
  var url = 'css/style';
  return {
    url: function() { return url; },
    setUrl: function(newUrl) { url = newUrl; }
  };
});