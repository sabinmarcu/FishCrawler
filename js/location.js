(function() {
  var LocationController, actions, engine, lastPos, offsets, peak, watch;

  engine = 'gps';

  peak = {
    x: 0,
    y: 0,
    z: 0
  };

  lastPos = null;

  watch = null;

  LocationController = (function() {

    function LocationController() {}

    LocationController.getLocation = function(args) {
      var _ref;
      if ((_ref = document.getElementsByTagName("footer")[0]) != null) {
        _ref.innerHTML = "Connecting to get location.";
      }
      if (engine === "gps") {
        document.removeEventListener("devicemotion");
        return watch = navigator.geolocation.watchPosition(function() {
          var coords;
          coords = {
            x: arguments[0].coords.longitude + offsets.x / 5000,
            y: arguments[0].coords.latitude + offsets.y / 5000
          };
          document.getElementsByTagName("footer")[0].innerHTML = "Location Debugging --------------------------------- <br>\nLatitude : " + coords.y + " <br>\nLongitude: " + coords.x + " <br>";
          newTick(coords);
          return lastPos = coords;
        }, function() {
          return document.getElementsByTagName("footer")[0].innerHTML = "Error in getting location";
        });
      } else {
        document.getElementById("footerinfo").innerHTML = "Going with metering";
        return window.addEventListener("devicemotion", function(event) {});
      }
    };

    LocationController.deviceMotion = function() {
      if (event.accelerationIncludingGravity.x > peak.x) {
        peak.x = event.accelerationIncludingGravity.x;
      }
      if (event.accelerationIncludingGravity.y > peak.y) {
        peak.y = event.accelerationIncludingGravity.y;
      }
      if (event.accelerationIncludingGravity.z > peak.z) {
        peak.z = event.accelerationIncludingGravity.z;
      }
      document.getElementById("footerinfo").innerHTML = "Metric Data : --------------------------------- <br>\nX : " + event.accelerationIncludingGravity.x + " <br>\nY : " + event.accelerationIncludingGravity.y + " <br>\nZ : " + event.accelerationIncludingGravity.z + " <br>\n<br><br>\nX Peak : " + peak.x + "\nY Peak : " + peak.y + "\nZ Peak : " + peak.z;
      lastPos = {
        x: lastPos.x + event.accelerationIncludingGravity.x / 10,
        y: lastPos.y + event.accelerationIncludingGravity.y / 10
      };
      return newTick(coords);
    };

    return LocationController;

  })();

  actions = [];

  offsets = {
    x: 0,
    y: 0
  };

  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 38:
        return offsets.y--;
      case 40:
        return offsets.y++;
      case 37:
        return offsets.x--;
      case 39:
        return offsets.x++;
    }
  };

  window.newTick = function(args) {
    var action, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = actions.length; _i < _len; _i++) {
      action = actions[_i];
      _results.push(action(args));
    }
    return _results;
  };

  window.addAction = function(action) {
    return actions.push(action);
  };

  window.switchEngine = function() {
    if (engine === "gps") {
      return engine = "meter";
    } else {
      engine = "gps";
      document.getElementById("engine").innerHTML = engine;
      return LocationController.getLocation();
    }
  };

  LocationController.getLocation();

  console.log("Loaded LocationController");

}).call(this);
