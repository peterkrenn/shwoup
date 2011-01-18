beforeEach(function() {
  this.addMatchers({
    toBeAGrid: function() {
      return this.actual instanceof Grid;
    },
    toBeAPosition: function() {
      return this.actual instanceof Position;
    }
  })
});
