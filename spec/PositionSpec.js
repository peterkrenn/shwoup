describe("Position", function() {
  beforeEach(function() {
    this.position = new Position(0);
  });

  it("should be defined", function() {
    expect(Position).toBeDefined();
  });

  it("should be initialized with an index", function() {
    expect(this.position).toBeAPosition();
    expect(this.position.index).toBe(0);
    expect(function() { new Position(); }).toThrow("index parameter required");
  });

  it("should be initialized without an element", function() {
    expect(this.position.element).not.toBeDefined();
  });
});
