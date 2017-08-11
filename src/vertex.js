const vertex = {

    defaultProperties: {
        start: {},
        end: {},
        distance: 0,
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

};

module.exports = vertex;
