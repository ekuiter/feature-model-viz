function ModelViz(model, elem, size) {
    if (!(this instanceof ModelViz))
        return new ModelViz(model, elem);

    elem = elem || $("body");
    this.model = model;
    this.renderTo(elem, size);
}

ModelViz.prototype.toDot = function() {
    function quote(str) {
        return "\"" + str.replace(/"/g, '\\"') + '"';
    }

    function node(feature) {
        return quote(feature.name) + ' [fillcolor="' + (feature.abstract ? "#f2f2ff" : "#ccccff") + '"' +
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

ModelViz.prototype.renderTo = function(elem, size) {
    var svgString = Viz(this.toDot());
    var svgElem = new DOMParser().parseFromString(svgString, "image/svg+xml").documentElement;
    if (size)
        svgElem.style.width = svgElem.style.height = size;
    $(svgElem).find(".edge > title, .graph > title").remove();
    elem.empty().append(svgElem);
};
