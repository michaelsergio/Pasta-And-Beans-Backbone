var SleepItem = Backbone.Model.extend({
  initialize: function() {
    //dateStart: this.get('dtStart');
    //dateEnd: this.get('dtEnd')
  },

  hoursBetween: function() {
    return 0;
  }
  
}); 

var SleepLog = Backbone.Collection.extend({
  model: SleepItem,
  localStorage: new Store("sleep-backbone")
});

var SleepView = Backbone.View.extend({
  el: $('#sleep-app'),

  tagName: "li", 
  className: "sleep-row",
  
  initialize: function() { 
    this.input_start_date  = this.$("#start-date");
    this.input_end_date = this.$("#end-date");
    this.input_start_time = this.$("#start-time");
    this.input_end_time = this.$("#end-time");
    this.time_between = this.$("#time-between");

    this.inputReset();
    this.showTimeDiffInWords();
  },

  inputReset: function() {
    var today = Date.now();
    this.input_start_date.val(today.getMonth() +"/"+ today.getDay()+"/"+ today.getFullYear()); 
    this.input_end_date.val(today.getMonth() +"/"+ today.getDay()+"/"+ today.getFullYear()); 
    this.input_start_time.val("22:00");
    this.input_end_time.val("8:00");
  
  },

  events: {
    //"keypress .edit": "updateOnEnter",
    "blur #date-boxes": "showTimeDiffInWords",
  },

  startTime: function() {
    var dates = this.input_start_date.val().split("/");
    var day = dates[1], month = dates[0], year = dates[2];
    var times = this.input_start_time.val().split(":");
    var hour = times[0], minute = times[1];
    return new Date(year, month, day, hour, minute, 0, 0);
  },

  endTime: function() {
    var dates = this.input_end_date.val().split("/");
    var day = dates[1], month = dates[0], year = dates[2];
    var times = this.input_end_time.val().split(":");
    var hour = times[0], minute = times[1];
    return new Date(year, month, day, hour, minute, 0, 0);
  },

  timeDiff: function() {
    return this.endTime() - this.startTime();
  },

  showTimeDiffInWords: function() {
    //FIXME for negative numbers
    // no integer division in javascript :(
    var diff = this.timeDiff();

    if (isNaN(diff)) {
      this.time_between.text("Fix the bad input dates");
    }
    else {
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor(diff / 3600000 % 24);
      var minutes = Math.floor(diff / 60000 % 60);

      var time_str = hours + " hours " + minutes + " minutes";
      if (days) {
        time_str = days + " days " + time_str;
      }

      this.time_between.text(time_str);
    }
  },

  close: function() {
    if (isNaN(diff)) {
      return;
    }

    this.
    
    this.inputReset();
  },

  render: function(e) {
    if (e.keyCode == 13) this.close();
  }
});

var SleepApp = new SleepView;
