
var SleepItem = Backbone.Model.extend({
  initialize: function() {
    dateStart: this.get('dtStart'),
    dateEnd: this.get('dtEnd')
  },

  hoursBetween: function() {
    return 0;
  }
  
}); 

var SleepCollection = Backbone.Collection.extend({
  model: SleepItem,
  localStorage: new Store("sleep-backbone")
});

var SleepView = Backbone.View.extend({
  events: {
    "keypress .edit": "updateOnEnter",
  }

  render: function() {

  }
});
