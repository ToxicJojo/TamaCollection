function cycleObjectProperties(object, callbackFunction) {
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
        callbackFunction(property, object[property]);
    }
  }
}


exports.cycleObjectProperties = cycleObjectProperties;
