const fs = require('fs');
const path = require('path');

const nodes = require('./nodes');

const mapReader = {

    mapData: [],
    map: [],

    create(options = {}) {
        const self = Object.create(this);

        self.mapData = this.mapData;
        self.map = this.map;

        Object.keys(options).forEach((key) => {
            self[key] = options[key];
        });

        if (options.mapName) {
            self.loadMap(options.mapName);
        }

        return self;
    },

    loadMap(map) {
        const mapData = JSON.parse(fs.readFileSync(path.resolve(__dirname, map))).map;

        const myNodes = nodes.create();
        myNodes.createNodes(mapData);

        // console.log('nodes', myNodes.nodes);

        this.mapData = mapData;
        this.map = myNodes;

        return mapData;
    },

    calculateDistance(...nodeNames) {
        if (nodeNames.length < 2) {
            return 0;
        }

        let startNode = this.map.getNode(nodeNames[0]);
        const endNode = this.map.getNode(nodeNames[nodeNames.length - 1]);

        let distance = 0;
        let counter = 1;

        while (startNode.name !== endNode.name) {
            const tempVertex = startNode.getVertex(nodeNames[counter]);

            if (tempVertex === undefined) {
                return new Error('NO SUCH ROUTE');
            }

            distance += tempVertex.distance;

            startNode = this.map.getNode(nodeNames[counter]);

            counter += 1;
        }

        return distance;
    },

    calculateTrips(startNodeName, endNodeName, maxStops, exact = false) {
        const queue = [startNodeName];
        const visited = [startNodeName];
        let numberOfTrips = 0;
        let countDown = 1;
        let depth = 0;

        while (queue.length > 0) {
            const tempNodeName = queue.shift();
            const tempNode = this.map.getNode(tempNodeName);

            countDown -= 1;

            if (tempNode.getVertex(endNodeName)) {
                if (!exact || (exact && depth === maxStops - 1)) {
                    numberOfTrips += 1;
                }
            }

            for (let i = 0; i < tempNode.vertices.length; i++) {
                // console.log('tempNode.vertices[i].end.name', tempNode.vertices[i].end.name);
                // const result = visited.find(n => n === tempNode.vertices[i].end.name);
                // if (result === undefined) {
                visited.push(tempNode.vertices[i].end.name);
                queue.push(tempNode.vertices[i].end.name);
                // }
            }

            if (countDown === 0) {
                countDown = queue.length;
                depth += 1;

                if (depth === maxStops) {
                    break;
                }
            }

            // console.log('queue', queue);
            // console.log('visited', visited);
        }

        // console.log('depth', depth);
        // console.log('numberOfTrips', numberOfTrips);

        return numberOfTrips;
    },

    calculateShortestRoute(startNodeName, endNodeName) {
        let allNodes = [];
        // const queue = [];
        let result = null;

        this.map.nodes.forEach((n) => {
            if (n.name === startNodeName) {
                allNodes.push([n.name, 0]);
            } else {
                allNodes.push([n.name, Infinity]);
            }
            // queue.push(n.name);
        });

        if (startNodeName === endNodeName) {
            allNodes.push([startNodeName, Infinity]);
        }

        // const testCounter = 0;

        while (allNodes.length > 0) {
            allNodes = allNodes
                .sort((a, b) => a[1] - b[1]);
            console.log('allNodes before', allNodes);

            // const currentNodeName = queue.splice(queue.indexOf(allNodes[0][0]), 1)[0];
            const currentNode = allNodes.shift();
            const currentNodeName = currentNode[0];

            // if (currentNodeName === startNodeName && currentNodeName === endNodeName) {
            // allNodes.push([currentNode[0], currentNode[1]]);
            // }

            if (currentNodeName === endNodeName && currentNode[1] > 0) {
                console.log('##### HIT!!!');
                result = currentNode[1];
                break;
            }

            // console.log('queue', queue);
            console.log('currentNodeName', currentNodeName);

            // const currentNode = this.map.getNode(currentNodeName);
            // const currentNodeWeight = allNodes.find(n => n[0] === currentNodeName);
            const currentNodeWeight = currentNode[1];
            console.log('currentNodeWeight', currentNodeWeight);

            const tempNode = this.map.getNode(currentNodeName);

            const neigbourNodeNames = tempNode.vertices.map(n => n.end.name);
            console.log('currentNode', currentNode);
            console.log('tempNode', tempNode);
            console.log('neigbourNodeNames', neigbourNodeNames);

            tempNode.vertices.forEach((v) => {
                const tempNode = allNodes.find(n => n[0] === v.end.name);

                if (tempNode) {
                    const newWeight = v.distance + currentNodeWeight;

                    console.log('##### find', tempNode);

                    if (newWeight < tempNode[1]) {
                        tempNode[1] = newWeight;
                    }
                }
            });

            console.log('allNodes after', allNodes);
            console.log('');
            console.log('');
            console.log('');

            // if (testCounter >= 1) {
            //     break;
            // }

            // testCounter += 1;
        }

        return result;
    },

    calculateTripsByDistance(startNodeName, endNodeName, distance) {
        const queue = [[startNodeName, 0]];
        // const visited = [startNodeName];
        let numberOfTrips = 0;
        // let countDown = 1;
        // let depth = 0;

        while (queue.length > 0) {
            const temp = queue.shift();
            const tempNodeName = temp[0];
            const tempNode = this.map.getNode(tempNodeName);
            const tempNodeWeight = temp[1];

            // countDown -= 1;

            // if (tempNode.getVertex(endNodeName)) {
            if (tempNodeName === endNodeName && tempNodeWeight > 0) {
                // if (!exact || (exact && depth === maxStops - 1)) {
                numberOfTrips += 1;
                // }
            }

            for (let i = 0; i < tempNode.vertices.length; i++) {
                // console.log('tempNode.vertices[i].end.name', tempNode.vertices[i].end.name);
                // const result = visited.find(n => n === tempNode.vertices[i].end.name);
                // if (result === undefined) {
                // visited.push(tempNode.vertices[i].end.name);
                const newWeight = tempNodeWeight + tempNode.vertices[i].distance;
                if (newWeight < distance) {
                    queue.push([tempNode.vertices[i].end.name, newWeight]);
                }
                // }
            }

            // if (countDown === 0) {
            //     countDown = queue.length;
            //     depth += 1;

            //     if (depth === maxStops) {
            //         break;
            //     }
            // }

            console.log('queue', queue);
            // console.log('visited', visited);
        }

        // console.log('depth', depth);
        // console.log('numberOfTrips', numberOfTrips);

        return numberOfTrips;
    },

};

module.exports = mapReader;
