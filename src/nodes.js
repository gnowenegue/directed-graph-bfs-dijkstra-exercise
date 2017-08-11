const node = require('./node');
const vertex = require('./vertex');

const nodes = {

    defaultProperties: {
        nodes: [],
    },

    /**
     * constructor
     */
    create(options = {}) {
        const self = Object.assign(Object.create(this), this.defaultProperties);

        Object.keys(options).forEach((key) => {
            self[key] = options[key];
        });

        return self;
    },

    /**
     * sample map data: ['AB1', 'BC2']
     * create network of Node and Vertex objects from the map data
     * return nodes array
     */
    createNodes(mapData) {
        mapData.forEach((data) => {
            const [tempStartNodeName, tempEndNodeName, tempNodeDistance] = data;

            const tempStartNode = this.addNode(tempStartNodeName)
                || this.getNode(tempStartNodeName);
            const tempEndNode = this.addNode(tempEndNodeName)
                || this.getNode(tempEndNodeName);

            tempStartNode.addVertex(vertex.create({
                start: tempStartNode,
                end: tempEndNode,
                distance: parseInt(tempNodeDistance, 10),
            }));
        });

        return this.nodes;
    },

    /**
     * if the new Node does not exist in the nodes array
     * add it into the nodes array
     * returning the Node object added
     * else return null
     */
    addNode(n) {
        if (!this.getNode(n)) {
            const tempNode = node.create({ name: n });

            const clone = this.nodes.slice(0);
            clone.push(tempNode);
            this.nodes = clone;

            return tempNode;
        }

        return null;
    },

    /**
     * getting the Node object by Node's name
     * return null if no result found
     */
    getNode(name) {
        return this.nodes.find(n => n.name === name) || null;
    },

    /**
     * check if the nodes exist
     */
    validateNodes(...names) {
        let result = true;

        names.forEach((n) => {
            if (this.getNode(n) === null) {
                result = false;
            }
        });

        return result;
    },

};

module.exports = nodes;
