/* global expect, sinon */
/* eslint-disable no-unused-expressions */

const nodes = require('../src/nodes');
const node = require('../src/node');
const vertex = require('../src/vertex');

const mockNode = {
    name: 'name',
    vertices: [],
};

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

    beforeEach(() => {
        myNodes = nodes.create();
    });

    describe('createNodes()', () => {
        beforeEach(() => {
            sinon.stub(myNodes, 'addNode');
            sinon.stub(myNodes, 'getNode');

            sinon.stub(vertex, 'create');
        });

        it('Create nodes from map data, should reflect', (done) => {
            const mapData = ['AB5', 'BC4', 'CD8', 'DC8'];

            ['A', 'B', 'C', 'D'].forEach((a) => {
                myNodes.addNode.withArgs(a)
                    .onFirstCall()
                    .returns({
                        addVertex() {},
                    })
                    .onSecondCall()
                    .returns(null);

                myNodes.getNode.withArgs(a)
                    .returns({
                        addVertex() {},
                    });
            });

            myNodes.createNodes(mapData);

            expect(myNodes.addNode).to.have.callCount(8);
            expect(myNodes.getNode).to.have.callCount(4);

            return done();
        });

        afterEach(() => {
            myNodes.addNode.restore();
            myNodes.getNode.restore();

            vertex.create.restore();
        });
    });

    describe('addNode()', () => {
        beforeEach(() => {
            sinon.stub(myNodes, 'getNode');

            sinon.stub(node, 'create');
        });

        it('Add node, should reflect', (done) => {
            expect(myNodes.nodes).to.be.empty;

            myNodes.getNode.returns(null);
            node.create.returns(mockNode);

            const testNode = myNodes.addNode('name');

            expect(myNodes.nodes).to.not.be.empty;
            expect(myNodes.nodes[0]).to.be.deep.equal(mockNode);
            expect(myNodes.nodes).to.be.deep.include(mockNode);
            expect(testNode).to.be.deep.equal(mockNode);

            return done();
        });

        it('Add existing node, should return null', (done) => {
            myNodes = nodes.create({
                nodes: [mockNode],
            });

            sinon.stub(myNodes, 'getNode');

            expect(myNodes.nodes).to.not.be.empty;
            expect(myNodes.nodes).to.have.lengthOf(1);

            myNodes.getNode.returns(mockNode);

            const testNode = myNodes.addNode('name');

            expect(myNodes.nodes).to.not.be.empty;
            expect(myNodes.nodes).to.have.lengthOf(1);
            expect(testNode).to.be.null;

            return done();
        });

        afterEach(() => {
            myNodes.getNode.restore();

            node.create.restore();
        });
    });

    describe('getNode()', () => {
        it('Get node, should reflect', (done) => {
            myNodes = nodes.create({
                nodes: [mockNode],
            });

            const testNode = myNodes.getNode('name');

            expect(testNode).to.exist;
            expect(testNode).to.be.deep.equal(mockNode);

            return done();
        });

        it('Get invalid node, should return null', (done) => {
            const testNode = myNodes.getNode('Z');

            expect(testNode).to.be.null;

            return done();
        });
    });

    describe('validateNodes()', () => {
        it('Validate nodes, should return true', (done) => {
            myNodes = nodes.create({
                nodes: [mockNode],
            });

            const testResult = myNodes.validateNodes('name');

            expect(testResult).to.be.true;

            return done();
        });

        it('Validate invalid nodes, should return false', (done) => {
            const testResult = myNodes.validateNodes('Z');

            expect(testResult).to.be.false;

            return done();
        });
    });
});

/* eslint-enable */
