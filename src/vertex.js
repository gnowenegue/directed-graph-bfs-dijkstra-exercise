const vertex = {

    start: {},
    end: {},
    distance: 0,

    create(options = {}) {
        const self = Object.create(this);

        self.start = this.start;
        self.end = this.end;
        self.distance = this.distance;

        Object.keys(options).forEach((key) => {
            self[key] = options[key];
        });

        return self;
    },

};

module.exports = vertex;
