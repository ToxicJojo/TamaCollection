function cycleObjectProperties(object, callbackFunction) {
  Object.entries(object).forEach(([key, value]) => {
    callbackFunction(key, value);
  });
}


exports.cycleObjectProperties = cycleObjectProperties;
