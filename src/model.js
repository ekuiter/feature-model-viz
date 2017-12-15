function XmlModel(xml) {
    if (!(this instanceof XmlModel))
        return new XmlModel(xml);

    function getRoot(xml) {
        var struct = $(xml).find("featureModel struct").get();
        if (struct.length !== 1)
            throw "model does not have exactly one struct";
        var children = $(struct[0]).children().get();
        if (children.length !== 1)
            throw "model does not have exactly one root";
        return $(children[0]);
    }

    this.xml = xml;
    this.root = getRoot(xml);
}

XmlModel.prototype.traverse = function(fn) {    
    function traverse(node, parent, level) {
        if (["feature", "and", "or", "alt"].includes(node.prop("tagName")))
            fn(node, parent, level);
        
        if (node.children().length > 0) {            
            node.children().get().forEach(function(child) {
                traverse($(child), node, level + 1);
            });
        }
    }
    
    traverse(this.root, null, 0);
}

function Model(xmlModel) {
    if (!(this instanceof Model))
        return new Model(xmlModel);

    function buildFeatureList(xmlModel) {
        var features = [];
        xmlModel.traverse(function(node, parent) {
            features.push(new Feature(node, parent));
        });
        return features;
    }

    this.xmlModel = xmlModel;
    this.features = buildFeatureList(xmlModel);
}
