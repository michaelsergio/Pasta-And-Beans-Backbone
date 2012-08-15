$(function() {
  var meals = new Meals();
  meals.fetch({ 
    success: function() {
      if (!this.mealAddView) {
        var mealAddBtn = new MealAddButton({collection: meals});
        var timeline = new TimelineView({collection: meals});
      }
    }
  });
});
