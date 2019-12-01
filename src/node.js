const node = {

    defaultProperties: {
        name: '',
        vertices: [],
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
     * adding Vertex object into the vertices array
     * returning the Vertext object added
     */
    addVertex(v) {
        const clone = this.vertices.slice(0);
        clone.push(v);
        this.vertices = clone;

        return v;
    },

    /**
     * getting the Vertex object by ending Node's name
     * return null if no result found
     */
    getVertex(name) {
        return this.vertices.find((v) => v.end.name === name) || null;
    },

};

module.exports = node;
