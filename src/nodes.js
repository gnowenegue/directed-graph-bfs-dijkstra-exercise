const node = require('./node');
const vertex = require('./vertex');

const nodes = {

    nodes: [],

    create(options = {}) {
        const self = Object.create(this);

        self.nodes = this.nodes;

        Object.keys(options).forEach((key) => {
            self[key] = options[key];
        });

        return self;
    },

    createNodes(mapData) {
        mapData.forEach((data) => {
            const tempStartNodeName = data.split('')[0];
            const tempEndNodeName = data.split('')[1];
            const tempNodeDistance = data.split('')[2];

            if (!this.getNode(tempStartNodeName)) {
                this.addNode(node.create({ name: tempStartNodeName }));
            }

            if (!this.getNode(tempEndNodeName)) {
                this.addNode(node.create({ name: tempEndNodeName }));
            }

            const tempStartNode = this.getNode(tempStartNodeName);
            const tempEndNode = this.getNode(tempEndNodeName);

            const tempVertex = vertex.create({
                start: tempStartNode,
                end: tempEndNode,
                distance: parseInt(tempNodeDistance, 10),
            });

            tempStartNode.addVertex(tempVertex);
        });
    },

    addNode(n) {
        const tempNodes = this.nodes.slice(0);
        tempNodes.push(n);
        this.nodes = tempNodes;
    },

    getNode(name) {
        return this.nodes.find(n => n.name === name);
    },

};

module.exports = nodes;
