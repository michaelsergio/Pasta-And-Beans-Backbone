var SleepItem = Backbone.Model.extend({
  initialize: function() {
    dtStart: this.get('dtStart');
    dtEnd: this.get('dtEnd')
  },

  validate: function(attrs) {
    if (new Date(attrs.dtEnd) - new Date (attrs.dtStart) <= 0) {
      return "end date must come after start date";
    }
  },

  timeBetween: function() {
    return new Date(this.get('dtEnd')) - new Date(this.get('dtStart'));
  },

  clear: function() {
    this.destroy();
  }
  
}); 

var SleepLog = Backbone.Collection.extend({
  model: SleepItem,
  localStorage: new Store("sleep-backbone")
});

//var SleepLog = new SleepLog;


var SleepItemView = Backbone.View.extend({
  tagName: "li", 
  className: "sleep-row",

  events: {
    "dblclick" : "remove"
  },

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    var start = new Date(this.model.get('dtStart'));
    var between = this.model.timeBetween();
    this.$el.text(start.toDateString() + ": " + between);
    return this;
  }

});

var SleepAddView = Backbone.View.extend({ 
  
});

var SleepView = Backbone.View.extend({
  
  initialize: function() { 
    this.input_start_date  = this.$("#start-date");
    this.input_end_date = this.$("#end-date");
    this.input_start_time = this.$("#start-time");
    this.input_end_time = this.$("#end-time");
    this.time_between = this.$("#time-between");
    this.inputReset();

    this.model.bind('add', this.addOne, this);
    this.model.bind('reset', this.addAll, this);
  },

  inputReset: function() {
    var today = Date.now();
    var tommorow = new Date(today.getTime() + 86400000);
    this.input_start_date.val(today.getMonth() +"/"+ today.getDay()+"/"+ today.getFullYear()); 
    this.input_end_date.val(tommorow.getMonth() +"/"+ tommorow.getDay()+"/"+ tommorow.getFullYear()); 
    this.input_start_time.val("22:00");
    this.input_end_time.val("8:00");
    this.showTimeDiffInWords();
  },

  events: {
    "keypress #date-boxes": "createOnEnter",
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


  addAll: function() {
    this.model.each(this.addOne);
  },

  addOne: function(sleep) {
    var view = new SleepItemView({model: sleep});
    var elem = view.render().el;
    console.log(elem);
    this.$("#sleep-log").append(elem);
  },

  createOnEnter: function(e) {
    if (e.keyCode == 13) {
      if (this.timeDiff() > 0) {
        var sleep = this.model.create({
          dtStart: this.startTime(),
          dtEnd: this.endTime()
        });

        this.model.add(sleep);

        this.inputReset();
      }
    }
  },

  render: function() {
    return this;
  }
});


var AppRoutes = Backbone.Router.extend({
  routes: {
    "sleep/log": "sleepLog",
    "sleep/add": "addSleep"
  },

  addSleep: function() {
    //$('#pastabeans').children().addClass('hidden');
    //$('#hi-app').removeClass('hidden');
  },

  sleepLog: function() {
    var sleepLog = new SleepLog();
    sleepLog.fetch(
    { 
      success: function() {
        $("#sleep-log").html(new SleepView({el: $('#sleep-app'), model: sleepLog}));
      }
    });
  },
});

var routes = new AppRoutes();
Backbone.history.start();
//Backbone.history.start({pushState: true});

