var Grid = Class.create({
  initialize: function(element, width, height, elementWidth) {
    if ([element, width, height, elementWidth]
      .select(function(parameter) { return parameter == undefined; })
      .include(undefined)) {
      throw new Error("required parameter missing");
    }

    this.element = element;
    this.width = width;
    this.height = height;
    this.elementWidth = elementWidth;

    this.positions = [];
    (this.width * this.height).times(function(index) {
      this.positions.push(new Position(index));
    }.bind(this));


  },

  items: function() {
    return this.element.childElements();
  },

  add: function(element) {
    if (this.emptyPositions().size() > 0) {
      var position = this.emptyPositions()[(Math.random() * this.emptyPositions().size()).floor()];

      position.element = element;
      position.element.setStyle({
        position: "absolute",
        left: position.index % this.width * this.elementWidth + "px",
        top: Math.floor(position.index / this.width) * this.elementWidth + "px"});
      this.element.insert(position.element);
      position.element.appear({duration: 1, engine: "javascript"});
    }
    else {
      var position = this.positions[(Math.random() * this.positions.size()).floor()];

      position.element.fade({duration: 1, engine: "javascript", after: function() {
        position.element.remove()

        position.element = element;
        position.element.setStyle({
          position: "absolute",
          left: position.index % this.width * this.elementWidth + "px",
          top: Math.floor(position.index / this.width) * this.elementWidth + "px"});
        this.element.insert(element);
        position.element.appear({duration: 1});
      }.bind(this)});
    }
  },

  emptyPositions: function() {
    return this.positions.select(function(position) { return position.empty(); });
  },

  update: function(url) {
    new Ajax.JSONRequest(url, {
      callbackParamName: "jsoncallback",
      onComplete: function(response) {
        this.add(response.responseJSON.photos.photo.map(function(photo) {
          return new Element("img", {
            src: "http://farm" + photo.farm + ".static.flickr.com/" + photo.server +
              "/" + photo.id + "_" + photo.secret + "_s.jpg",
            alt: photo.title});
        }).first());
      }.bind(this)
    });
  }
});

var Position = Class.create({
  initialize: function(index) {
    if (index == undefined) {
      throw new Error("index parameter required");
    }

    this.index = index;
  },

  empty: function() {
    return this.element == undefined;
  }
});


