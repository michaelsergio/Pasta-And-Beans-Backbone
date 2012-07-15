describe("SleepView", function () {
  var sleeps, view;

  beforeEach(function() {
    sleeps = new SleepLog();
    spyOn(sleeps, 'fetch');

    view = new SleepView({model: sleeps});


  });

  describe("#sleep-log", function(){
    it("should fetch the sleep log", function() {
      expect(sleeps.fetch).toHaveBeenCalled();
    });

    it("should render the view", function() {
      expect($(view.el).find("sleep-row").length).toBeGreaterThan(0);
      expect($(view.el).find("sleep-row")).toHaveText("hi");
    });
  });
});
