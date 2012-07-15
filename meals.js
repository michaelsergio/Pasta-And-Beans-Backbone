var Meal = Backbone.Model.extend({
});

var Meals = Backbone.Collection.extend({
  model: Meal,
  localStorage: new Store("pastabeans-meal")
});

var MealAddView = Backbone.View.extend({
  el: $('#meal-add'),
  events: {
    "keypress": "newMeal"
  },

  initialize: function(options) {
    this.meals = options.collection;
  },

  newMeal: function(e) {
    if (e.charCode === 13) {
      var meal = {};
      _.map(this.$('form'), function(name, val) {meal.name = meal.val});
      this.meals.create(meal);
      console.log(this.meals.length);
    }
  },

});

if (!this.meals) this.meals = new Meals();
this.meals.fetch({ 
  success: function() {
    if (!this.mealAddView) {
      this.mealAddView = new MealAddView({collection: meals});
    }
  }
});
