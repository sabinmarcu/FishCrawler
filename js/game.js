(function() {
  var GameController, dots, index;

  GameController = (function() {

    function GameController() {}

    GameController.addDot = function() {
      return navigator.geolocation.getCurrentPosition(function() {
        var coords;
        coords = {
          x: arguments[0].coords.longitude + (Math.random() * 10) / 2000,
          y: arguments[0].coords.latitude + (Math.random() * 10) / 2000
        };
        return dots.push(coords);
      });
    };

    GameController.verify = function(newCoords) {
      var d, d1, d2, dist, distance, string;
      if (index === dots.length) return;
      dist = Math.sqrt(Math.pow(dots[index].x - newCoords.x, 2) + Math.pow(dots[index].y - newCoords.y, 2)) * 1000;
      if (dots.length - index > 1 && index > 0) {
        d1 = Math.sqrt(Math.pow(dots[index].x - newCoords.x, 2) + Math.pow(dots[index].y - newCoords.y, 2)) * 1000;
        d2 = Math.sqrt(Math.pow(dots[index - 1].x - newCoords.x, 2) + Math.pow(dots[index - 1].y - newCoords.y, 2)) * 1000;
        d = Math.sqrt(Math.pow(dots[index].x - dots[index - 1].x, 2) + Math.pow(dots[index].y - dots[index - 1].y, 2)) * 1000;
        distance = Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2) - Math.pow(d, 2) / 2);
      } else {
        distance = dist;
      }
      if (distance > 10) {
        string = "Foarte rece in puii mei";
      } else if (distance > 7) {
        string = "Rece";
      } else if (distance > 5) {
        string = "Normal ca la Băsescu";
      } else if (distance > 3) {
        string = "Se încălzește ca pe la Castro";
      } else if (distance > 1) {
        string = "Ești aproape acolo (that's what she said)";
      } else {
        alert("Done, you hit the sweet spot, the G string and the God Molecule!");
      }
      if (dist < 1) {
        index++;
        string = "All done, go home and sleep!";
      }
      string = "" + string + " <br> Distance : " + dist + " / " + distance;
      if ((string != null) && string) {
        document.getElementsByTagName("article")[0].innerHTML = string;
        return document.getElementsByTagName("progress")[0].value = 10 - distance;
      }
    };

    return GameController;

  })();

  dots = [];

  index = 0;

  GameController.addDot();

  window.addDot = GameController.addDot;

  window.dot = dots;

  addAction(GameController.verify);

}).call(this);
