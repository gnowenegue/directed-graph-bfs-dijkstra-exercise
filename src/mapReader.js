const fs = require('fs');
const path = require('path');

const nodes = require('./nodes');

const NO_SUCH_ROUTE = 'NO SUCH ROUTE';

const mapReader = {

    defaultProperties: {
        mapName: '',
        mapData: [],
        map: [],
    },

    /**
     * constructor
     */
    create(options = {}) {
        const self = Object.assign(Object.create(this), this.defaultProperties);

        Object.keys(options).forEach((key) => {
            self[key] = options[key];
        });

        if (options.mapName) {
            /* eslint-disable no-useless-catch */
            try {
                self.loadMap(options.mapName);
            } catch (e) {
                throw e;
            }
            /* eslint-enable no-useless-catch */
        }

        return self;
    },

    /**
     * load JSON file into map data
     * create the network of Node and Vertex objects from the map data
     * will throw error if unable to open file
     * return map data
     */
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

    /**
     * calculate distance based on route
     * sample route: 'A' to 'B' to 'C'
     * if no route found, return 'NO SUCH ROUTE'
     */
    calculateDistance(...nodeNames) {
        if (!this.map.validateNodes(...nodeNames)) {
            return NO_SUCH_ROUTE;
        }

        if (nodeNames.length < 2) {
            return 0;
        }

        let currentNode = this.map.getNode(nodeNames[0]);
        const endNode = this.map.getNode(nodeNames[nodeNames.length - 1]);

        let distance = 0;
        let counter = 1;

        while (
            currentNode.name !== endNode.name
            || distance === 0
            || counter !== nodeNames.length
        ) {
            const tempVertex = currentNode.getVertex(nodeNames[counter]);

            if (tempVertex === null) {
                return NO_SUCH_ROUTE;
            }

            distance += tempVertex.distance;

            currentNode = this.map.getNode(nodeNames[counter]);

            counter++;
        }

        return distance;
    },

    /**
     * calculate number of trips
     * if exact, only consider trips at exactly `maxStops`
     * else, consider all trips up to `maxStops`
     * if no trip found, return 0
     */
    calculateTrips(startNodeName, endNodeName, maxStops, exact = false) {
        if (!this.map.validateNodes(startNodeName, endNodeName)) {
            return 0;
        }

        const queue = [startNodeName];

        let numberOfTrips = 0;
        let countDown = 1;
        let depth = 0;

        while (queue.length > 0) {
            const tempNodeName = queue.shift();
            const tempNode = this.map.getNode(tempNodeName);

            if (tempNode === null) {
                return 0;
            }

            // exclude the first trip if starting Node's name is same as ending Node's name
            if (tempNodeName === endNodeName && depth > 0) {
                // if exact, only consider when depth equals `maxStops`
                // else, consider all trips all to depth `maxStops`
                // - 1 because the depth has already + 1 when evaluating the Node
                if ((!exact && depth - 1 <= maxStops) || (exact && depth === maxStops)) {
                    numberOfTrips++;
                }
            }

            countDown--;

            for (let i = 0; i < tempNode.vertices.length; i++) {
                queue.push(tempNode.vertices[i].end.name);
            }

            if (countDown === 0) {
                countDown = queue.length;
                depth++;

                // + 1 because we need to traverse another level
                // in order for the queue to be able to evaluate the Node objects
                if (depth === maxStops + 1) {
                    break;
                }
            }
        }

        return numberOfTrips;
    },

    /**
     * calculate distance of shortest route
     * if no route found, return 'NO SUCH ROUTE'
     */
    calculateShortestRoute(startNodeName, endNodeName) {
        if (!this.map.validateNodes(startNodeName, endNodeName)) {
            return NO_SUCH_ROUTE;
        }

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

            // exclude the first trip if starting Node's name is same as ending Node's name
            if (currentNodeName === endNodeName && currentNodeWeight > 0) {
                result = currentNodeWeight;
                break;
            }

            const tempNode = this.map.getNode(currentNodeName);

            for (let i = 0; i < tempNode.vertices.length; i++) {
                const tempNeighbourNode = allNodes.find((n) => n[0]
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

        return (result === Infinity) ? NO_SUCH_ROUTE : result;
    },

    /**
     * calculate number of trips within distance limit
     * if no trips found, return 0
     */
    calculateTripsByDistance(startNodeName, endNodeName, distance) {
        if (!this.map.validateNodes(startNodeName, endNodeName)) {
            return 0;
        }

        const queue = [[startNodeName, 0]];
        let numberOfTrips = 0;

        while (queue.length > 0) {
            const currentNode = queue.shift();
            const currentNodeName = currentNode[0];
            const currentNodeWeight = currentNode[1];

            const tempNode = this.map.getNode(currentNodeName);

            if (tempNode === null) {
                return 0;
            }

            // exclude the first trip if starting Node's name is same as ending Node's name
            if (currentNodeName === endNodeName && currentNodeWeight > 0) {
                numberOfTrips++;
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
