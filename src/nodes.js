const node = require('./node');
const vertex = require('./vertex');

const nodes = {

    defaultProperties: {
        nodes: [],
    },

    create(options = {}) {
        const self = Object.assign(Object.create(this), this.defaultProperties);

        Object.keys(options).forEach((key) => {
            self[key] = options[key];
        });

        return self;
    },

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

    getNode(name) {
        return this.nodes.find(n => n.name === name) || null;
    },

};

module.exports = nodes;
