/*
  Swipey - Scott Pigeon - 2014

  It will add events to an element that listens for swipes and
  calls the function in the callback argument if conditions are
  met. If listing a named function in the callback argument, be
  sure to omit the parenthesis.

  Usage: swipey(targetId, direction, distanceInteger, callback)
  Example: swipey("#content", "right", 200, myFunction)
*/

// Holds info for each swipe.
var _swipeyObj = {};

// Holds callbacks
var _swipeyCallbacks = {};

// Function to listen for swipe events and determine if conditions are met.
function swipey(target, direction, distanceInteger, callback) {

  // Make it work regardless of # being present.
  if (target.substring(0,1) === "#") {
    target = document.getElementById(target.substring(1));
  } else {
    target = document.getElementById(target);
  }

  

  if (_swipeyCallbacks.hasOwnProperty(target) === false) {
    _swipeyCallbacks[target] = {};
    _swipeyCallbacks[target][direction] = {"distance": distanceInteger, "callback": callback};

    target.addEventListener("touchstart", function(){
      _swipeyObj.startX = event.changedTouches[0].pageX;
      _swipeyObj.startY = event.changedTouches[0].pageY;
    });

    target.addEventListener("touchend", function(){
      _swipeyObj.endX = event.changedTouches[0].pageX;
      _swipeyObj.endY = event.changedTouches[0].pageY;

      _swipeyCheck(target);
    });
  } else {
    _swipeyCallbacks[target][direction] = {"distance": distanceInteger, "callback": callback};
  }
}

function _swipeyCheck(target) {

  // Get Distance.
  var x = _swipeyObj.startX - _swipeyObj.endX;
  x *= x;

  var y = _swipeyObj.startY - _swipeyObj.endY;
  y *= y;

  _swipeyObj.distance = Math.sqrt(x + y);

  // Get Direction.
  var lr = _swipeyObj.startX - _swipeyObj.endX;
  var ud = _swipeyObj.startY - _swipeyObj.endY;

  if (Math.abs(lr) > Math.abs(ud)) {
    _swipeyObj.direction = (lr > 0) ? "left" : "right";
  } else {
    _swipeyObj.direction = (ud > 0) ? "up" : "down";
  }

  // See if conditions are met to call the callback.
  if (_swipeyCallbacks[target].hasOwnProperty(_swipeyObj.direction) && _swipeyObj.distance >= _swipeyCallbacks[target][_swipeyObj.direction].distance) {
    _swipeyCallbacks[target][_swipeyObj.direction].callback();
  }
}