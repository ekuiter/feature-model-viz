function ModelViz(model, options, configuration) {
    if (!(this instanceof ModelViz))
        return new ModelViz(model, options, configuration);

    options.target = options.target || $("body");
    this.model = model;
    this.options = options;
    this.render(configuration);
}

ModelViz.prototype.toDot = function(configuration) {
    function quote(str) {
        return "\"" + str.replace(/"/g, '\\"') + '"';
    }

    function nodeColor(feature) {
        if (configuration.enabledFeatures.find(featureFinder(feature.name)))
            return feature.abstract ? "#e6ffe7" : "#b3e6b4"; // base #ccffcd
        if (configuration.disabledFeatures.find(featureFinder(feature.name)))
            return feature.abstract ? "#ffe6e6" : "#e6b3b3"; // base #ffcccc
        return feature.abstract ? "#f2f2ff" : "#ccccff";
    }

    function node(feature) {
        return quote(feature.name) + ' [fillcolor="' + nodeColor(feature) + '"' +
            (feature.description ? ' tooltip=' + quote(feature.description) : '') +
            ' shape=' + (feature.alternative || feature.or ? "invhouse" : "box") +
            '];\n';
    }

    function edge(feature) {
        var arrowHead =
            feature.parent.alternative ? "none" :
            feature.parent.or ? "none" :
            feature.mandatory ? "dot" : "odot";
        var arrowTail =
            feature.parent.alternative ? "odot" :
            feature.parent.or ? "dot" : "none";
        return quote(feature.parent.name) + " -> " + quote(feature.name) +
            ' [arrowhead=' + arrowHead + ', arrowtail=' + arrowTail + ', dir=both];\n';
    }
    
    var dot = "digraph {\n";
    dot += 'node [style=filled fontname="Arial Unicode MS, Arial"];\n';
    this.model.features.forEach(function(feature) {
        dot += node(feature);
        if (feature.parent)
            dot += edge(feature);
    });
    dot += "}";
    
    return dot;
};

ModelViz.prototype.render = function(configuration) {
    configuration = configuration || new Configuration(this.model);
    
    var svgString = Viz(this.toDot(configuration));
    var svgElem = new DOMParser().parseFromString(svgString, "image/svg+xml").documentElement;
    if (this.options.size)
        svgElem.style.width = svgElem.style.height = this.options.size;
    $(svgElem).find(".edge > title, .graph > title").remove();
    this.options.target.empty().append(svgElem);
};
