/* global expect, sinon */
/* eslint-disable no-unused-expressions */

const nodes = require('../src/nodes');
const node = require('../src/node');
const vertex = require('../src/vertex');

describe('##### NODES #####', () => {
    let myNodes;

    it('Load and create an instance', (done) => {
        expect(nodes).to.exist;

        myNodes = nodes.create();
        expect(nodes).to.exist;

        return done();
    });

    describe('create()', () => {
        it('Pass in properties, should reflect', (done) => {
            const myTestValue = 'my test value';

            myNodes = nodes.create({ test: myTestValue });

            // test for default properties
            expect(myNodes.nodes).to.exist.and.empty;

            expect(myNodes.test).to.be.equal(myTestValue);

            return done();
        });
    });

    describe('createNodes()', () => {
        let nodeMock;
        let vertexMock;

        before(() => {
            nodeMock = sinon.mock(node);
            vertexMock = sinon.mock(vertex);
        });

        it('Create nodes from map data, should reflect', (done) => {
            const mapData = ['AB5', 'BC4', 'CD8', 'DC8'];

            myNodes = nodes.create();

            nodeMock.expects('addVertex').exactly(4);
            vertexMock.expects('create').exactly(4);

            myNodes.createNodes(mapData);

            nodeMock.verify();
            vertexMock.verify();

            expect(myNodes.nodes).to.exist.and.have.lengthOf(4);

            return done();
        });

        after(() => {
            nodeMock.restore();
            vertexMock.restore();
        });
    });

    describe('addNode()', () => {
        it('Add node, should reflect', (done) => {
            myNodes = nodes.create();

            expect(myNodes.nodes).to.be.empty;

            const tempNode = {
                name: 'name',
                vertices: [],
            };

            const testNode = myNodes.addNode('name');

            expect(myNodes.nodes).to.not.be.empty;

            // work around for issue with chai
            expect(JSON.parse(JSON.stringify(myNodes.nodes[0]))).to.be.deep.equal(
                JSON.parse(JSON.stringify(tempNode)),
            );
            expect(JSON.parse(JSON.stringify(myNodes.nodes))).to.be.deep.include(
                JSON.parse(JSON.stringify(tempNode)),
            );
            expect(JSON.parse(JSON.stringify(testNode))).to.deep.equal(
                JSON.parse(JSON.stringify(tempNode)),
            );

            return done();
        });

        it('Add existing node, should return null', (done) => {
            myNodes = nodes.create({
                nodes: [
                    {
                        name: 'name',
                        vertices: [],
                    },
                ],
            });

            expect(myNodes.nodes).to.not.be.empty;
            expect(myNodes.nodes).to.have.lengthOf(1);

            const testNode = myNodes.addNode('name');

            expect(myNodes.nodes).to.not.be.empty;
            expect(myNodes.nodes).to.have.lengthOf(1);
            expect(testNode).to.be.null;

            return done();
        });
    });
});

/* eslint-enable */
