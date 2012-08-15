var Meal = Backbone.Model.extend({
  parseIngrediants: function() {
    // parse comma seperated list
    // quantity type name
  },

  getDate: function() {
    return Date.parse(this.get('date'));
  }
});

var Meals = Backbone.Collection.extend({
  model: Meal,
  localStorage: new Store("pastabeans-meal")
});

var MealAddButton = Backbone.View.extend({
  el: $('#meal-add-button'),
  events: {
    "click": "mealPopup",
  },
  mealPopup: function() {
    new MealAddView({collection: this.collection}).$el.
      dialog({modal: true,
              title: 'New Meal',
              position: 'center',
              show: {
                effect: 'drop',
                direction:'up'
              },
              hide: {
                effect: 'drop',
                direction:'up'
              },
              width: 'auto' });
  },
});

var MealAddView = Backbone.View.extend({
  el: $('#meal-add'),
  events: {
    "keypress": "newMeal",
    "click #meal-add-btn": "newMeal",
    "click #meal-add-close-btn": "closeDialog",
  },

  initialize: function(options) {
    this.meals = options.collection;
    this.$el.find(".date").datepicker({dateFormat: "yy-mm-dd"});
    this.$el.find('.date').datepicker('setDate', new Date());
  },

  newMeal: function(e) {
    if (e.charCode === 13) {
      this.meals.create({
        name: this.$el.find('#meal-add-name').val(),
        type: this.$el.find('#meal-add-type').val(),
        ingredients: this.$el.find('#meal-add-ingredients').val(),
        date: this.$el.find('#meal-add-date').val()
      });

      //clear inputs
      this.$el.find('#meal-add-name').val('');
      this.$el.find('#meal-add-type').val('');
      this.$el.find('#meal-add-ingredients').val('');
      this.$el.find('#meal-add-date').setDate(new Date());

      this.closeDialog();
    }
  },

  closeDialog: function() {
    this.$el.dialog('close');
  },

});
