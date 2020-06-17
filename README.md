
![node-red-contrib-web-babylonjs](https://github.com/ahmadsayed/node-red-contrib-web-babylonjs/workflows/node-red-contrib-web-babylonjs/badge.svg)

# node-red-contrib-web-babylonjs

Realize an IoT project with 3D objects, it is in very early stage

The aim of this project is build augemented reality nodes, for visualizing IoT real data in Realtime

![Initial snapshot](https://raw.githubusercontent.com/ahmadsayed/node-red-contrib-web-babylonjs/master/snapshots/node-red-3d.png)

# Try it 

![Demo](https://github.com/ahmadsayed/node-red-contrib-web-babylonjs/blob/master/snapshots/Demo.gif)

# Develop it

The core design principle, is to be very easy to use, and try to provide WYSWYG experience, with very minamlist yet powerful UI.
Also avoid depends only some magical JSON structure, to be injected to make things work as expected.
For example transform node is added to explicity provide the transformation, also it contains the paramter needed to be passed.
Still user can replace it with msg.payload.

Install node-red follow https://nodered.org/docs/getting-started/installation

git clone https://github.com/ahmadsayed/node-red-contrib-web-babylonjs.git

cd node-red-contrib-web-babylonjs

npm link

Then start your node-red, the 3d section will show up and start using it

To access the 3D scene from 

```
http://127.0.0.1:1880/scene
```
# Windows user

``` 
run.bat
```
