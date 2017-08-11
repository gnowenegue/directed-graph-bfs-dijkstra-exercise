/* global expect */
/* eslint-disable no-unused-expressions */

const node = require('../src/node');

const mockVertex = {
    start: {
        name: 'start',
    },
    end: {
        name: 'end',
    },
    distance: 99,
};

describe('##### NODE #####', () => {
    let myNode;

    it('Load and create an instance', (done) => {
        expect(node).to.exist;

        myNode = node.create();
        expect(node).to.exist;

        return done();
    });

    describe('create()', () => {
        it('Pass in properties, should reflect', (done) => {
            const myTestValue = 'my test value';

            myNode = node.create({ test: myTestValue });

            // test for default properties
            expect(myNode.name).to.exist.and.empty;
            expect(myNode.vertices).to.exist.and.empty;

            expect(myNode.test).to.be.equal(myTestValue);

            return done();
        });
    });

    beforeEach(() => {
        myNode = node.create();
    });

    describe('addVertex()', () => {
        it('Add vertex, should reflect', (done) => {
            expect(myNode.vertices).to.be.empty;

            myNode.addVertex(mockVertex);

            expect(myNode.vertices).to.not.be.empty;
            expect(myNode.vertices[0]).to.be.deep.equal(mockVertex);
            expect(myNode.vertices).to.be.deep.include(mockVertex);

            return done();
        });
    });

    describe('getVertex()', () => {
        it('Get vertex, should reflect', (done) => {
            myNode.vertices = [mockVertex];

            const resultVertex = myNode.getVertex('end');

            expect(resultVertex).to.exist;
            expect(resultVertex).to.be.deep.equal(mockVertex);

            return done();
        });

        it('Get invalid vertex, should return null', (done) => {
            const resultVertex = myNode.getVertex('end');

            expect(resultVertex).to.be.null;

            return done();
        });
    });
});

/* eslint-enable */
