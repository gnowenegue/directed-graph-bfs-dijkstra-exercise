const node = {

    name: '',
    vertices: [],

    create(options = {}) {
        const self = Object.create(this);

        self.name = this.name;
        self.vertices = this.vertices;

        Object.keys(options).forEach((key) => {
            self[key] = options[key];
        });

        return self;
    },

    addVertex(v) {
        const tempVertices = this.vertices.slice(0);
        tempVertices.push(v);
        this.vertices = tempVertices;
    },

    getVertex(name) {
        return this.vertices.find(v => v.end.name === name);
    },

};

module.exports = node;
