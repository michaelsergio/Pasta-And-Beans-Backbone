var timelineId = function(date) {
  return $.datepicker.formatDate('yy-mm-dd', date);
};

var MealItemView = Backbone.View.extend({
  template: function(meal) {
    var template = _.template([
      '<div class="type"><%= type %></div>',
      '<div class="meal-item">',
      '<span class="meal-name"><%= name %></span>',
      ' - ',
      '<span class="meal-ingredients"><%= ingredients %></span>',
      '</div>'].join(''));
    return template({ 
              name: meal.get('name'), 
              ingredients: meal.get('ingredients'),
              type: meal.get('type')});
  },

});

var TimelineView = Backbone.View.extend({
  el: '#timeline',
  events: {
    "change" : "render"
  },

  dayTemplate: function() {
    return ['<div id="<%= date_id %>" class="timeline-day">',
             '<div class="timeline-date label label-info date-string">',
               '<%= date %>',
             '</div>',
           '</div>'].join('');
  },

  initialize: function() {
    this.collection.on("change", this.render, this);
    this.render();
  },

  render: function() {
    this.$el.empty();
    var range = this.collection;
    // create unique dates
    var days = range.map(function(meal) {
      return Date.parse(meal.get('date')).getTime();
    });

    days = _.uniq(days.sort(), true);

    var compiled = _.template(this.dayTemplate());
    _.each(days, function(dayMs) {
      var dateStr, dateId, today, dateDiv;
      today = new Date(dayMs);
      dateStr = today.toDateString();
      dateId = timelineId(today); 
      dateDiv = compiled({
        date: dateStr,
        date_id: dateId });
      this.$el.append(dateDiv);
    }, this);

    this.collection.each(function(meal) {
      var mealDate =  timelineId(meal.getDate());
      // TODO change append order based on meal type (ie. breakfast at bottom)
      // TODO group meals
      this.$el.find("#" + mealDate).append(new MealItemView().template(meal));
    }, this);
  }
});

