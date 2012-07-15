var Food = Backbone.Model.extend({
});

var Foods = Backbone.Collection.extend({
  model: Food,
  localStorage: new Store("pastabeans-food")
});

var FoodAddView = Backbone.View.extend({
  el: $('#food-add'),
  events: {
    "keypress": "newFood"
  },

  initialize: function(options) {
    this.foods = options.collection;
  },

  newFood: function(e) {
    if (e.charCode === 13) {
      var food = {};
      _.each(this.$el.serializeArray(), function(obj) {
        food[obj.name] = obj.value;
      });
      this.foods.create(food);
      console.log(this.foods.length);
    }
  },

});

var FoodCheckItem = Backbone.View.extend({
  template: function() {
    return '<label class="checkbox"><input type="checkbox">' + 
           this.model.get('name') + '</input></label>';
  },

  render: function() {
    return this.template();
  }

});

var FoodCheckList = Backbone.View.extend({
  el: '#meal-foods',
  initialize: function() {
    this.collection.bind('reset', this.render, this);
    this.collection.bind('add', this.render, this);
    this.render();
  },

  render: function() {
    var self = this;
    self.$el.empty();
    self.collection.each(function(food) {
      var item = new FoodCheckItem({model:food});
      self.$el.append(item.render());
    });
  }
});

this.foods = new Foods();
this.foods.fetch({ 
  success: function() {
    if (!this.foodCheckList) { this.foodCheckList = new FoodCheckList({collection: foods});}
    if (!this.foodAddView) { this.foodAddView = new FoodAddView({collection: foods});}
  }
});
