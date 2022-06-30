const Utils = {
  JsonReq (submitUrl, json, method, callback, sessionToken){

    var self = this;

    var return_object = {'error': null, 'data': null}
    
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open(method, submitUrl,  true);
    req.setRequestHeader("Content-Type", "application/json");

    if (sessionToken) {
      req.setRequestHeader("Authorization", "Token " + sessionToken);
    }

    req.onload = function (e) {
      if (req.readyState === 4) {
        if (req.status === 200) {
          return_object.data = req.responseText;
          callback(return_object);
        } else {
          return_object.error = req.statusText;
          return_object.data = req.responseText;
          callback(return_object);
        }
      }
    }

    req.onerror = function (e) {
      return_object.error = req.statusText;
      return_object.data = req.responseText;
      callback(return_object);
    }

    req.send(json ? JSON.stringify(json) : null);
  },

  formatDate(date) {

    var date_obj = new Date(date);
    var day = date_obj.getDate();
    var monthIndex = date_obj.getMonth();
    var year = date_obj.getFullYear();

    return day + '/' + (monthIndex + 1) + '/' + year;
  }

}

export default Utils;