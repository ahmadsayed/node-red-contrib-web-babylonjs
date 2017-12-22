/**
 * configuration is config parameter consist of name_config_(n|a)
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