/**
 * Initial function look trying to make generic function to convert a config to babylonjs parameters
 * instead of making mapping for each components, I use the config directly and remove node-red specific parameters
 * @param {*} config 
 */
module.exports.getParameters = function(config) {
    console.log(config);
    var parameter = JSON.parse(JSON.stringify(config));       
    console.log(parameter); 
    // delete node-red related params
    delete parameter.x;
    delete parameter.y;
    delete parameter.z;
    delete parameter.id;
    delete parameter.wires;
    delete parameter.scene;
    delete parameter.name;
    delete parameter.type;

    return parameter;
} 