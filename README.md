## feature-model-viz

This tool takes a [FeatureIDE](https://featureide.github.io) feature model
([like this](https://raw.githubusercontent.com/FeatureIDE/FeatureIDE/develop/featuremodels/FeatureIDE/model.xml))
and visualizes it as a graph (similar to FeatureIDE's feature model editor).
Configurations (i.e. feature selections) can be visualized as well.

[Click here](https://ekuiter.github.io/feature-model-viz) for an online
demonstration. You should be able to load any consistent FeatureIDE feature
model.

### Intention

Similar to
[ekuiter/feature-configurator](https://github.com/ekuiter/feature-configurator),
this project brings an aspect of feature-oriented software development into the
browser.

It may be used in concert with feature-configurator to visualize a user's
feature selection or reason about a feature model without installing Eclipse and
FeatureIDE first.

### Implementation

Feature models (given as XML data) are first transformed into the [DOT
language](https://en.wikipedia.org/wiki/DOT_(graph_description_language)), then
passed to [Viz.js](https://github.com/mdaines/viz.js/)
([Graphviz](http://www.graphviz.org/) compiled for JavaScript) to create an SVG
representation of the graph. Finally, this SVG is injected into the web page.

Note that Viz.js is quite a heavy library (~1.6MB). It is recommended to enable
gzip on the server, this way only ~500KB are transferred. If you need a
server-side solution, you may have a look at
[graphp/graphviz](https://github.com/graphp/graphviz).

### Usage

Run `npm install feature-model-viz` in your project directory
([NPM](https://www.npmjs.com/) required). Then include the `bundle.js` file as
shown in the example below. Additionally, [jQuery](http://jquery.com/) needs to
be included.

#### XmlModel

To retrieve and parse a feature model, use the XmlModel class:

```js
var xmlModel = new XmlModel(
  $.parseXML("<featureModel>(...)</featureModel>") // you can use jQuery to parse an XML string
);
// ... use xmlModel ...
```

To load a feature model stored on the server at `./model.xml`:

```js
$.ajax("model.xml").then(function(xml) {
  var xmlModel = new XmlModel(
    xml // this is already parsed by jQuery
  );
  // ... use xmlModel ...
});
```

#### ModelViz

Then use the ModelViz class as follows to render the feature model graph to a
target element:

```js
var modelViz = new ModelViz( // the model visualization
  model, // contains the feature model and its constraints
  { // additional options
    target: $("#some-element"), // where to render the configurator, defaults to $("body")
    size: "100%" // optional size (CSS width and height) to override Graphviz default
  },
  Configuration.fromXml(model, configurationXml) // optional configuration, can be omitted
);
```

### Example

[This
example](https://github.com/ekuiter/feature-model-viz/blob/gh-pages/index.html)
loads a given feature model and then renders a visualization for it. You can
[try it online](https://ekuiter.github.io/feature-model-viz).

### License

The rules from
[uvr2web](https://github.com/ekuiter/uvr2web/blob/master/LICENSE.txt) apply.