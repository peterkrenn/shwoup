describe("Grid", function() {
  beforeEach(function() {
    this.element = new Element("div");
    this.grid = new Grid(this.element, 2, 1, 90);
  });

  it("should be defined", function() {
    expect(Grid).toBeDefined();
  });

  it("should be initialized with an element, width, height and elementWidth", function() {
    expect(this.grid).toBeAGrid();
    expect(this.grid.element).toEqual(this.element);
    expect(this.grid.width).toBeDefined();
    expect(this.grid.height).toBeDefined();
    expect(this.grid.elementWidth).toBeDefined();
    expect(function() { new Grid(); }).toThrow("required parameter missing");
    expect(function() { new Grid(this.element, 2); }).toThrow("required parameter missing");
    expect(function() { new Grid(this.element, 2, 1); }).toThrow("required parameter missing");
  });

  it("should be initialized with zero items", function() {
    expect(this.grid.items().size()).toBe(0);
  });

  it("should be initialized with width * height undefined positions", function() {
    expect(this.grid.positions.size()).toBe(this.grid.width * this.grid.height);
    expect(this.grid.positions.select(function(item) { return item[1] == undefined; }).size())
      .toBe(this.grid.width * this.grid.height);
  });

  describe("#add", function() {
    it("should add an element", function() {
      expect(this.grid.items().size()).toBe(0);
      this.grid.add(new Element("img"));
      expect(this.grid.items().size()).toBe(1);
    });

    it("should place an element in a random empty position", function() {
      expect(this.grid.emptyPositions().size())
        .toBe(this.grid.width * this.grid.height);
      this.grid.add(new Element("img"));
      expect(this.grid.emptyPositions().size())
        .toBe(1);
      this.grid.add(new Element("img"));
      expect(this.grid.emptyPositions().size())
        .toBe(0);
    });

    it("should fade in elements for an empty position", function() {
      this.grid.add(new Element("img"));
      expect(this.grid.element.firstDescendant().getStyle("opacity")).toBe(0);

      waits(1100);

      runs(function() {
        expect(this.grid.element.firstDescendant().getStyle("opacity")).toBe(1);
      });
    });

    it("should set DOM position for an added element", function() {
      this.grid.add(new Element("img"));
      var index = this.grid.positions
        .select(function(position) { return !position.empty(); })[0].index;
      var left = index % this.grid.width * this.grid.elementWidth + "px";
      var top = Math.floor(index / this.grid.width) * this.grid.elementWidth + "px";

      var element = this.grid.element.firstDescendant();
      expect(element.getStyle("position")).toBe("absolute");
      expect(element.getStyle("left")).toBe(left);
      expect(element.getStyle("top")).toBe(top);
    });

    it("should replace a random element if there are no empty positions and fade in/out",
      function() {
      this.grid.add(new Element("img", {alt: 1}));
      this.grid.add(new Element("img", {alt: 2}));
      expect(this.grid.emptyPositions().size())
        .toBe(0);
      var element = new Element("img", {alt: 3});
      this.grid.add(element);

      expect(this.grid.positions.map(function(position) { return position.element; })
        .include(element)).toBeFalsy();

      waits(2100);

      runs(function() {
        expect(this.grid.positions.map(function(position) { return position.element; })
          .include(element)).toBeTruthy();
        expect(this.grid.items().size()).toBe(2);
      });
    });
  });

  describe("#emptyPositions", function() {
    it("should return all empty positions", function() {
      expect(this.grid.emptyPositions().size()).toBe(this.grid.width * this.grid.height);
      this.grid.add(new Element("img"));
      this.grid.emptyPositions().each(function(position) {
        expect(position.empty()).toBeTruthy();
      });
      expect(this.grid.emptyPositions().size()).toBe(this.grid.width * this.grid.height - 1);
    });
  });
});
