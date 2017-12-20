/**
 * Initial function look trying to make generic function to convert a config to babylonjs parameters
 * instead of making mapping for each components, I use the config directly and remove node-red specific parameters
 * @param {*} config 
 */
module.exports.getParameters = function (config) {
    var babylonParams = {};
    let confMarker = "_conf_";
    Object.keys(config).forEach(
        currentKey => {
            if (currentKey.includes(confMarker)) {
                let keyParts = currentKey.split("_");
                if (config[currentKey] !== "") {
                    (keyParts[2] === 'n') ?
                        babylonParams[keyParts[0]] = Number(config[currentKey]) :
                        babylonParams[keyParts[0]] = config[currentKey];
                }

            }

        }
    );
    return babylonParams;
} 