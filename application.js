var chat = {
  module: function() {
    var modules {};

    return function(name) {
      if (modules[name]) {
        return modules[name];
      }

      return modules[name] = { Views: {} };
    };
  }()
}

jQuery(function($)) {
  // initialize app here
}
