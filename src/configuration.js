function Configuration(model, enabledFeatures, disabledFeatures) {
    if (!(this instanceof Configuration))
        return new Configuration(model, enabledFeatures, disabledFeatures);

    this.model = model;
    this.enabledFeatures = enabledFeatures || [];
    this.disabledFeatures = disabledFeatures || [];
}

Configuration.fromXml = function(model, xml) {
    var enabledFeatures = [], disabledFeatures = [];
    
    $(xml).find("feature").each(function() {
        var feature = model.getFeature($(this).attr("name"));
        
        if ($(this).attr("manual") === "selected" ||
            $(this).attr("automatic") === "selected")
            enabledFeatures.push(feature);
        else if ($(this).attr("manual") === "unselected" ||
                 $(this).attr("automatic") === "unselected")
            disabledFeatures.push(feature);
    });

    return new Configuration(model, enabledFeatures, disabledFeatures);
};
