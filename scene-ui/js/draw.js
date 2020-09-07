var scene;

function connectToWs() {

    var ws;
    console.log("============== Establish Connection ============")
    if ("WebSocket" in window) {
        // Let us open a web socket
        //TODO: Remove localhost
        ws = new WebSocket("ws://" + location.host + "/ws-stream");
        ws.onopen = function () {
            // Web Socket is connected, send data using send()
            status = {
                status: "Websocket Connected"
            }
            ws.send(JSON.stringify(status));
        };

        ws.onmessage = function (evt) {
            var received_msg = JSON.parse(evt.data);
            if (received_msg.type === 'reload') {
                loadScene();
            } else {
                let mesh = scene.getMeshByName(received_msg.name);
                //Setting Pivote for translation rotation and scaling.
                pivotAt = new BABYLON.Vector3(received_msg.pivot.x, received_msg.pivot.y, received_msg.pivot.z);
                //translation = mesh.position.subtract(pivotAt)
                mesh.setPivotMatrix(BABYLON.Matrix.Translation(pivotAt.x, pivotAt.y, pivotAt.z));

                switch (received_msg.type) {
                    case 'position':
                        if (received_msg.relative) {
                            mesh.position.x += received_msg.values.x;
                            mesh.position.y += received_msg.values.y;
                            mesh.position.z += received_msg.values.z;

                        } else {
                            mesh.position.x = received_msg.values.x;
                            mesh.position.y = received_msg.values.y;
                            mesh.position.z = received_msg.values.z;
                        }
                        break;
                    case 'rotate':     
                        // Some Strange popping happens when reaching Math.PI, Math.PI/2 , Math.PI/4 (90,180,270), try to do the relative logic in backend
                        if (received_msg.relative) {
                            mesh.rotation.x += received_msg.values.x;
                            mesh.rotation.y += received_msg.values.y;
                            mesh.rotation.z += received_msg.values.z
                        } else {
                            mesh.rotation.x = received_msg.values.x;
                            mesh.rotation.y = received_msg.values.y;
                            mesh.rotation.z = received_msg.values.z;
                        }
                        break;
                    case 'scale':
                        if (received_msg.relative) {
                            mesh.scaling.x += received_msg.values.x;
                            mesh.scaling.y += received_msg.values.y;
                            mesh.scaling.z += received_msg.values.z;
                        } else {
                            mesh.scaling.x = received_msg.values.x;
                            mesh.scaling.y = received_msg.values.y;
                            mesh.scaling.z = received_msg.values.z;
                        }
                        break;
                }

            }
        };

        ws.onclose = function () {
            // websocket is closed.
            console.log("Connection is closed...");
        };
        window.onbeforeunload = function (event) {
            socket.close();
        };
    }

    else {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    }
    return ws;
}

var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
/******* Add the create scene function ******/
var createScene = function () {
    // Create the scene space
    scene = new BABYLON.Scene(engine);
    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    scene.onKeyboardObservable.add((kbInfo) => {
        console.log(kbInfo)
        eventMsg = {
            type: kbInfo.event.type,
            key: kbInfo.event.key,
            code: kbInfo.event.code
        }
        ws.send(JSON.stringify(eventMsg));
    });

    return scene;
};

var all_meshes = [];

var applyMaterial = function (scene, material, mesh, /*Map*/ materialMap) {
    if (!materialMap.has(material.name)) {
        let mat = new BABYLON.StandardMaterial(material.name, scene);
        if (material.diffuse != null) {
            mat.diffuseColor = new BABYLON.Color3(material.diffuse.r, material.diffuse.g, material.diffuse.b);
        }
        if (material.specular != null) {
            mat.specularColor = new BABYLON.Color3(material.specular.r, material.specular.g, material.specular.b);
        }
        mat.alpha = material.alpha;
        materialMap.set(material.name, mat);
    }
    mesh.material = materialMap.get(material.name);
}

var drawMeshes = function (scene, sceneData) {
    // Delete all Meshes to support redraw
    all_meshes.forEach(mesh => {
        mesh.dispose();
    });

    materialMap = new Map();

    // Add and manipulate meshes in the scene
    sceneData.objects.forEach(element => {
        let mesh = null;
        switch (element.type) {
            case 'sphere':
                mesh = BABYLON.MeshBuilder.CreateSphere(element.name, element.param, scene);
                break;
            case 'box':
                mesh = BABYLON.MeshBuilder.CreateBox(element.name, element.param, scene);
                break;
            case 'plane':
                mesh = BABYLON.MeshBuilder.CreatePlane(element.name, element.param, scene);
                break;
            case 'cone':
                mesh = BABYLON.MeshBuilder.CreateCylinder(element.name, element.param, scene);
                break;
        }
        if (element.material != null) {
            applyMaterial(scene, element.material, mesh, materialMap);
        }

        if (element.position != null) {
            mesh.position.x = element.position.x;
            mesh.position.y = element.position.y;
            mesh.position.z = element.position.z;
        }

        if (element.rotation != null) {
            mesh.rotation.x = element.rotation.x;
            mesh.rotation.y = element.rotation.y;
            mesh.rotation.z = element.rotation.z;
        }

        if (element.scaling != null) {
            mesh.scaling.x = element.scaling.x;
            mesh.scaling.y = element.scaling.y;
            mesh.scaling.z = element.scaling.z;
        }

        all_meshes.push(mesh);
    });
};
/********** Connect/Reconnect with Heartbeat ****/
var ws = connectToWs();
setInterval(() => {
    if (ws.readyState === WebSocket.CLOSED) {
        ws = connectToWs();
    }
}, 2000);

var loadScene = function () {

    fetch('/sceneServe').then(res => res.json()).then(res => {
        drawMeshes(scene, res);
        let divFps = document.getElementById("fps");
        engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
            if (res.overlay) {
                divFps.style.visibility = 'visible';
                divFps.innerHTML = engine.getFps().toFixed() + " fps";
            } else {
                divFps.style.visibility = 'hidden';
            }

            scene.render();
        });

    });
}


/******* Load scene from backend *********/
var scene = createScene();
loadScene();

window.addEventListener("resize", function () { // Watch for browser/canvas resize events
    engine.resize();
});


//When click event is raised
window.addEventListener("click", function () {
    // We try to pick an object
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    // We try to pick an object
    if (pickResult.hit) {
        // pickResult.pickedMesh.name;
        console.log(pickResult.pickedMesh);
        picked = {
            type: "click-pick",
            name: pickResult.pickedMesh.name
        }
        ws.send(JSON.stringify(picked));
    }

});

