const fs = require('fs');
const path = require('path');

const nodes = require('./nodes');

const mapReader = {

    defaultProperties: {
        mapName: '',
        mapData: [],
        map: [],
    },

    create(options = {}) {
        const self = Object.assign(Object.create(this), this.defaultProperties);

        Object.keys(options).forEach((key) => {
            self[key] = options[key];
        });

        if (options.mapName) {
            try {
                self.loadMap(options.mapName);
            } catch (e) {
                throw e;
            }
        }

        return self;
    },

    loadMap(map) {
        let mapData = {};

        try {
            const filePath = path.join(__dirname, '../', map);
            mapData = JSON.parse(fs.readFileSync(path.resolve(filePath))).map;
        } catch (e) {
            throw new Error('Unable to load map.');
        }

        const myNodes = nodes.create();
        myNodes.createNodes(mapData);

        this.mapData = mapData;
        this.map = myNodes;

        return mapData;
    },

    calculateDistance(...nodeNames) {
        if (nodeNames.length < 2) {
            return 0;
        }

        let currentNode = this.map.getNode(nodeNames[0]);
        const endNode = this.map.getNode(nodeNames[nodeNames.length - 1]);

        let distance = 0;
        let counter = 1;

        while (currentNode.name !== endNode.name) {
            const tempVertex = currentNode.getVertex(nodeNames[counter]);

            if (tempVertex === null) {
                // throw new Error('NO SUCH ROUTE');
                return 'NO SUCH ROUTE';
            }

            distance += tempVertex.distance;

            currentNode = this.map.getNode(nodeNames[counter]);

            counter++;
        }

        return distance;
    },

    calculateTrips(startNodeName, endNodeName, maxStops, exact = false) {
        const queue = [startNodeName];

        let numberOfTrips = 0;
        let countDown = 1;
        let depth = 0;

        while (queue.length > 0) {
            const tempNodeName = queue.shift();

            if (tempNodeName === endNodeName && depth > 0) {
                if ((!exact && depth - 1 <= maxStops) || (exact && depth === maxStops)) {
                    numberOfTrips += 1;
                }
            }

            const tempNode = this.map.getNode(tempNodeName);
            countDown -= 1;

            for (let i = 0; i < tempNode.vertices.length; i++) {
                queue.push(tempNode.vertices[i].end.name);
            }

            if (countDown === 0) {
                countDown = queue.length;
                depth += 1;

                if (depth === maxStops + 1) {
                    break;
                }
            }
        }

        return numberOfTrips;
    },

    calculateShortestRoute(startNodeName, endNodeName) {
        let allNodes = [];
        let result = null;

        this.map.nodes.forEach((n) => {
            if (n.name === startNodeName) {
                allNodes.push([n.name, 0]);
            } else {
                allNodes.push([n.name, Infinity]);
            }
        });

        // if starting and ending nodes are the same
        // push the node into the queue with infinity weight
        if (startNodeName === endNodeName) {
            allNodes.push([startNodeName, Infinity]);
        }

        while (allNodes.length > 0) {
            allNodes = allNodes.sort((a, b) => a[1] - b[1]);

            const currentNode = allNodes.shift();
            const currentNodeName = currentNode[0];
            const currentNodeWeight = currentNode[1];

            if (currentNodeName === endNodeName && currentNodeWeight > 0) {
                result = currentNodeWeight;
                break;
            }

            const tempNode = this.map.getNode(currentNodeName);

            for (let i = 0; i < tempNode.vertices.length; i++) {
                const tempNeighbourNode = allNodes.find(n => n[0]
                    === tempNode.vertices[i].end.name);

                if (tempNeighbourNode) {
                    const tempNeighbourNodeWeight = tempNeighbourNode[1];
                    const newWeight = tempNode.vertices[i].distance + currentNodeWeight;

                    if (newWeight < tempNeighbourNodeWeight) {
                        tempNeighbourNode[1] = newWeight;
                    }
                }
            }
        }

        /* if (result === null) {
            throw new Error('NO SUCH ROUTE');
        } */

        return (result === Infinity) ? 'NO SUCH ROUTE' : result;
    },

    calculateTripsByDistance(startNodeName, endNodeName, distance) {
        const queue = [[startNodeName, 0]];
        let numberOfTrips = 0;

        while (queue.length > 0) {
            const currentNode = queue.shift();
            const currentNodeName = currentNode[0];
            const currentNodeWeight = currentNode[1];

            const tempNode = this.map.getNode(currentNodeName);

            if (currentNodeName === endNodeName && currentNodeWeight > 0) {
                numberOfTrips += 1;
            }

            for (let i = 0; i < tempNode.vertices.length; i++) {
                const newWeight = currentNodeWeight + tempNode.vertices[i].distance;

                if (newWeight < distance) {
                    queue.push([tempNode.vertices[i].end.name, newWeight]);
                }
            }
        }

        return numberOfTrips;
    },

};

module.exports = mapReader;
