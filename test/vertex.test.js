/* global expect */
/* eslint-disable no-unused-expressions */

const vertex = require('../src/vertex');

describe('##### VERTEX #####', () => {
    let myVertex;

    it('Load and create an instance', (done) => {
        expect(vertex).to.exist;

        myVertex = vertex.create();
        expect(vertex).to.exist;

        return done();
    });

    describe('create()', () => {
        it('Pass in properties, should reflect', (done) => {
            const myTestValue = 'my test value';

            myVertex = vertex.create({ test: myTestValue });

            // test for default properties
            expect(myVertex.start).to.exist.and.empty;
            expect(myVertex.end).to.exist.and.empty;
            expect(myVertex.distance).to.exist.and.equal(0);

            expect(myVertex.test).to.equal(myTestValue);

            return done();
        });
    });
});

/* eslint-enable */
