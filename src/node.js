const node = {

    defaultProperties: {
        name: '',
        vertices: [],
    },

    create(options = {}) {
        const self = Object.assign(Object.create(this), this.defaultProperties);

        Object.keys(options).forEach((key) => {
            self[key] = options[key];
        });

        return self;
    },

    addVertex(v) {
        const clone = this.vertices.slice(0);
        clone.push(v);
        this.vertices = clone;

        return v;
    },

    getVertex(name) {
        return this.vertices.find(v => v.end.name === name) || null;
    },

};

module.exports = node;
