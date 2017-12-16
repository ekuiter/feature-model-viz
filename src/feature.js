function Feature(node, parent) {
    if (!(this instanceof Feature))
        return new Feature(node, parent, children);
    var self = this;

    function getDescription(node) {
        var description = node.find("> description").get();
        return description.length === 1 ?
            $(description[0]).text().split("\n").map(function(line) { return line.trim(); }).join("\n").trim() :
        null;
    }

    this.name = node.attr("name");
    this.description = getDescription(node);
    this.abstract = node.attr("abstract") === "true";
    this.mandatory = node.attr("mandatory") === "true";
    this.alternative = node.prop("tagName") === "alt";
    this.or = node.prop("tagName") === "or";
    this.parent = parent ? new Feature(parent) : null;
}

function featureGetter(key) {
    return function(name) {
        return this[key].find(featureFinder(name));
    };
}

function featureFinder(name) {
    return function(feature) {
        return feature.name === name;
    };
}
