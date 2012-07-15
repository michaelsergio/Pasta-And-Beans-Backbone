_.mixin({timeDiffInWords: function(diff) {
    //FIXME for negative numbers
    // no integer division in javascript :(
    if (isNaN(diff)){ return "Fix the bad input dates";}

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor(diff / 3600000 % 24);
    var minutes = Math.floor(diff / 60000 % 60);

    var time_arr = [hours, "hours"];
    if (minutes) {
      time_arr = time_arr.concat([minutes, "minutes"]);
    }
    if (days) {
      time_arr = [days, "days "].concat(time_arr);
    }

    return time_arr.join(" ");
    }
});

var SleepItem = Backbone.Model.extend({
  initialize: function() {
  },

  validate: function(attrs) {
    if (new Date(attrs.dtEnd) - new Date (attrs.dtStart) <= 0) {
      return "end date must come after start date";
    }
  },

  timeBetween: function() {
    return new Date(this.get('dtEnd')) - new Date(this.get('dtStart'));
  },

  timeDiffInWords: function() {
    var diff = this.timeBetween();
    return _(diff).timeDiffInWords();

  },

  clear: function() {
    this.destroy();
  }
  
}); 

var SleepLog = Backbone.Collection.extend({
  model: SleepItem,
  localStorage: new Store("sleep-backbone")
});


var SleepItemView = Backbone.View.extend({
  tagName: "li", 
  className: "sleep-row",

  events: {
    "click a.remove" : "clear"
  },

  template: _.template('\
             <a href="#" class="remove"><i class="icon-remove"></i></a> \
             <%= started %>: <%= time_in_words %>'),

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    var started = new Date(this.model.get('dtStart')).toDateString();
    var between = this.model.timeDiffInWords();
    this.$el.html(this.template({started: started, time_in_words: between}));
    return this;
  },

  clear: function() {
    this.model.clear();
  }

});

var SleepAddView = Backbone.View.extend({ 
  initialize: function() {
  },

  template:
        '<div id="date-boxes"> \
          <input id="start-date" type="text" /> \
          <input id="start-time" type="text" /> \
          - \
          <input id="end-date" type="text" /> \
          <input id="end-time" type="text" /> \
        </div> \
        <p id="time-between"></p> \
        ',

  render: function() {
    this.$el.html(this.template);
    this.input_start_date  = this.$("#start-date");
    this.input_end_date = this.$("#end-date");
    this.input_start_time = this.$("#start-time");
    this.input_end_time = this.$("#end-time");
    this.time_between = this.$("#time-between");
    this.inputReset();
  },

  inputReset: function() {
    var today = Date.now();
    var tommorow = new Date(today.getTime() + 86400000);
    this.input_start_date.val(today.getMonth() + "/" + 
                              today.getDay() + "/" + 
                              today.getFullYear()); 
    this.input_end_date.val(tommorow.getMonth() + "/" + 
                            tommorow.getDay() + "/" + 
                            tommorow.getFullYear()); 
    this.input_start_time.val("22:00");
    this.input_end_time.val("8:00");
    this.showTimeDiffInWords();
  },

  events: {
    "keydown #date-boxes": "createOnEnter",
    "keyup #date-boxes": "showTimeDiffInWords",
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
    var diff = this.timeDiff();
    var time_diff_str = _(diff).timeDiffInWords();

    this.time_between.text(time_diff_str);
  },

  createOnEnter: function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (this.timeDiff() > 0) {
        this.model.create({
          dtStart: this.startTime(),
          dtEnd: this.endTime()
        });

        this.inputReset();
      }
    }
  },


});

var SleepView = Backbone.View.extend({
  initialize: function() { 
    this.model.bind('add', this.addOne, this);
    this.model.bind('remove', this.render,this);
  },

  renderCount: function(count) {
    var count_str;
    if (count === 0){ count_str = "No Log Entries";}
    else if (count === 1){ count_str = "1 Log Entry";}
    else { count_str = count + " Log Entries";}
    $('#sleep-log-count').text(count_str);
  },

  render:function() {
    this.renderCount(this.model.length);
    var log = this.$("#sleep-log");
    log.empty();
    this.model.each(function(sleep) {
      var view = new SleepItemView({model: sleep});
      log.append(view.render().el);
    });
  },

  addOne: function(sleep) {
    this.renderCount(this.model.length);
    var view = new SleepItemView({model: sleep});
    this.$("#sleep-log").append(view.render().el);
  },

});


//var sleepLog = new SleepLog();

var AppRoutes = Backbone.Router.extend({
  routes: {
    "sleep/log": "showSleepLog",
    "sleep/add": "addSleep"
  },

  addSleep: function() {
    if (!this.sleepLog) { 
      this.showSleepLog();
    }
    if (!this.sleepView) { 
      this.sleepView = new SleepAddView({el: $('#sleep-add'), 
                                         model: this.sleepLog});
    }
    this.sleepView.render();
  },

  showSleepLog: function() {
    $('#sleep-add').empty();
    if (!this.sleepLog){ this.sleepLog = new SleepLog();}
    var log = this.sleepLog;
    this.sleepLog.fetch({ 
      success: function() {
        if (!this.sleepView) { 
          this.sleepView = new SleepView({el: $('#sleep-app'), model: log});
        }
        this.sleepView.render();
      }
    });
  },
});

var routes = new AppRoutes();
Backbone.history.start();
