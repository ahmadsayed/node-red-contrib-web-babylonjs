var scene;
function connectToWs() {

    var ws;
    console.log("============== Establish Connection ============")
    if ("WebSocket" in window) {
        // Let us open a web socket
        //TODO: Remove localhost
        ws = new WebSocket("ws://" + location.host.split(":")[0] + ":9099");
        ws.onopen = function () {
            // Web Socket is connected, send data using send()
            status = {
                status: "Websocket Connected"
            }
            ws.send(JSON.stringify(status));
        };

        ws.onmessage = function (evt) {
            var received_msg = JSON.parse(evt.data);
            let mesh = scene.getMeshByName(received_msg.name);
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
                case 'reload':
                    console.log("Reload Recieved");
                    loadScene();
                    break;
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

    return scene;
};

var all_meshes = [];


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
        if (!materialMap.has(element.material.name)) {
            let mat = new BABYLON.StandardMaterial(element.material.name, scene);
            mat.diffuseColor = new BABYLON.Color3(element.material.diffuse.r, element.material.diffuse.g, element.material.diffuse.b);
            mat.alpha = element.material.alpha;
            materialMap.set(element.material.name, mat);
        }
        mesh.material = materialMap.get(element.material.name);

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
            name: pickResult.pickedMesh.name
        }
        ws.send(JSON.stringify(picked));
    }

});

