// Generated by CoffeeScript 1.3.1
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

    LocationController.name = 'LocationController';

    function LocationController() {}

    LocationController.getLocation = function(args) {
      var _ref, _ref1;
      if ((_ref = document.getElementsByTagName("footer")[0]) != null) {
        _ref.innerHTML = "Connecting to get location.";
      }
      if (engine === "gps") {
        document.removeEventListener("devicemotion", LocationController.deviceMotion);
        watch = null;
        return watch = navigator.geolocation.getCurrentPosition(LocationController.deviceLocation);
      } else {
        if ((_ref1 = document.getElementById("footerinfo")) != null) {
          _ref1.innerHTML = "Going with metering";
        }
        watch = null;
        return window.addEventListener("devicemotion", LocationController.deviceMotion);
      }
    };

    LocationController.deviceLocation = function(ev) {
      var coords, _ref;
      coords = {
        x: ev.coords.longitude,
        y: ev.coords.latitude
      };
      if ((_ref = document.getElementsByTagName("footer")[0]) != null) {
        _ref.innerHTML = "Location Debugging --------------------------------- <br>\nLatitude : " + coords.y + " <br>\nLongitude: " + coords.x + " <br>";
      }
      newTick(coords);
      return lastPos = coords;
    };

    LocationController.deviceMotion = function(event) {
      if (event.accelerationIncludingGravity.x > peak.x) {
        peak.x = event.accelerationIncludingGravity.x;
      }
      if (event.accelerationIncludingGravity.y > peak.y) {
        peak.y = event.accelerationIncludingGravity.y;
      }
      if (event.accelerationIncludingGravity.z > peak.z) {
        peak.z = event.accelerationIncludingGravity.z;
      }
      document.getElementById("footerinfo").innerHTML = "Metric Data : --------------------------------- <br>\nX : " + event.accelerationIncludingGravity.x + " <br>\nY : " + event.accelerationIncludingGravity.y + " <br>\nZ : " + event.accelerationIncludingGravity.z + " <br>\n<br><br>\nX Peak : " + peak.x + " <br>\nY Peak : " + peak.y + " <br>\nZ Peak : " + peak.z + " <br>\n<br><br>\nCurrent X : " + lastPos.x + " <br>\nCurrent Y : " + lastPos.y + " <br>";
      lastPos = {
        x: lastPos.x + event.accelerationIncludingGravity.x / 200000,
        y: lastPos.y + event.accelerationIncludingGravity.y / 200000
      };
      return newTick(lastPos);
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
    console.log("Tick");
    console.log(offsets);
    args.x += offsets.x / 10000;
    args.y += offsets.y / 10000;
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

  setInterval(LocationController.getLocation, 500);

  console.log("Loaded LocationController");

}).call(this);
