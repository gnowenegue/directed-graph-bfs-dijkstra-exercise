/* global expect, sinon */
/* eslint-disable no-unused-expressions */

const mapReader = require('../src/mapReader');
const nodes = require('../src/nodes');

describe('##### MAP READER #####', () => {
    let myMapReader;

    it('Load and create an instance', (done) => {
        expect(mapReader).to.exist;

        myMapReader = mapReader.create();
        expect(myMapReader).to.exist;

        return done();
    });

    describe('create()', () => {
        it('Pass in properties, should reflect', (done) => {
            const myTestValue = 'my test value';

            myMapReader = mapReader.create({ test: myTestValue });

            // test for default properties
            expect(myMapReader.mapName).to.exist.and.empty;
            expect(myMapReader.mapData).to.exist.and.empty;
            expect(myMapReader.map).to.exist.and.empty;

            expect(myMapReader.test).to.be.equal(myTestValue);

            return done();
        });

        it('Pass in invalid mapName, should throw error', (done) => {
            const mapName = 'nosuchmapexists.json';

            expect(() => mapReader.create({ mapName })).to.throw(Error, 'Unable to load map.');

            return done();
        });

        let nodesMock;

        before(() => {
            nodesMock = sinon.mock(nodes);
        });

        it('Pass in mapName, should loadMap()', (done) => {
            const mapName = '../src/map.json';

            const myNodes = nodesMock.expects('create');
            const tempMyNodes = {
                createNodes() { },
            };
            myNodes.returns(tempMyNodes);

            myMapReader = mapReader.create({ mapName });
            nodesMock.verify();

            expect(myMapReader.mapName).to.be.equal(mapName);
            expect(myMapReader.mapData).to.exist;
            expect(myMapReader.map).to.be.deep.equal(tempMyNodes);

            return done();
        });

        after(() => {
            nodesMock.restore();
        });
    });

    describe('calculateDistance()', () => {
        it('Calculate the distance for one node, should return 0', (done) => {
            const distance = myMapReader.calculateDistance('A');

            expect(distance).to.equal(0);

            return done();
        });

        it('Calculate the distance from node to node', (done) => {
            myMapReader = mapReader.create({
                map: {
                    nodes: [
                        {
                            name: 'A',
                            vertices: [{
                                end: {
                                    name: 'B',
                                },
                                distance: 10,
                            }],
                            getVertex() { return this.vertices[0]; },
                        },
                        {
                            name: 'B',
                            vertices: [],
                            getVertex() { return null; },
                        },
                    ],
                    getNode() { },
                },
            });

            const getNodeStub = sinon.stub(myMapReader.map, 'getNode');
            getNodeStub.withArgs('A').returns(myMapReader.map.nodes[0]);
            getNodeStub.withArgs('B').returns(myMapReader.map.nodes[1]);

            const distance = myMapReader.calculateDistance('A', 'B');

            expect(distance).to.equal(10);

            getNodeStub.restore();

            return done();
        });

        it('Calculate the distance of invalid route, should throw error', (done) => {
            myMapReader = mapReader.create({
                map: {
                    nodes: [
                        {
                            name: 'A',
                            vertices: [],
                            getVertex() { return null; },
                        },
                        {
                            name: 'B',
                            vertices: [],
                            getVertex() { return null; },
                        },
                    ],
                    getNode() { },
                },
            });

            const getNodeStub = sinon.stub(myMapReader.map, 'getNode');
            getNodeStub.withArgs('A').returns(myMapReader.map.nodes[0]);
            getNodeStub.withArgs('B').returns(myMapReader.map.nodes[1]);

            expect(() => { myMapReader.calculateDistance('A', 'B') }).to.throw(Error, 'NO SUCH ROUTE');

            getNodeStub.restore();

            return done();
        });
    });

    describe('calculateTrips()', () => {
        it('Calculate number of trips within number of stops', (done) => {
            myMapReader = mapReader.create({
                map: {
                    nodes: [
                        {
                            name: 'A',
                            vertices: [{
                                end: {
                                    name: 'B',
                                },
                                distance: 10,
                            },
                            {
                                end: {
                                    name: 'C',
                                },
                                distance: 1,
                            }],
                        },
                        {
                            name: 'B',
                            vertices: [{
                                end: {
                                    name: 'C',
                                },
                                distance: 10,
                            }],
                        },
                        {
                            name: 'C',
                            vertices: [],
                        },
                    ],
                    getNode() { },
                },
            });

            const getNodeStub = sinon.stub(myMapReader.map, 'getNode');
            getNodeStub.withArgs('A').returns(myMapReader.map.nodes[0]);
            getNodeStub.withArgs('B').returns(myMapReader.map.nodes[1]);
            getNodeStub.withArgs('C').returns(myMapReader.map.nodes[2]);

            let numberOfTrips = myMapReader.calculateTrips('A', 'C', 2);

            expect(numberOfTrips).to.equal(2);

            numberOfTrips = myMapReader.calculateTrips('A', 'C', 2, true);

            expect(numberOfTrips).to.equal(1);

            getNodeStub.restore();

            return done();
        });
    });

    describe('calculateShortestRoute()', () => {
        it('Calculate the shortest route', (done) => {
            myMapReader = mapReader.create({
                map: {
                    nodes: [
                        {
                            name: 'A',
                            vertices: [{
                                end: {
                                    name: 'B',
                                },
                                distance: 10,
                            },
                            {
                                end: {
                                    name: 'C',
                                },
                                distance: 1,
                            }],
                        },
                        {
                            name: 'B',
                            vertices: [{
                                end: {
                                    name: 'C',
                                },
                                distance: 10,
                            },
                            {
                                end: {
                                    name: 'D',
                                },
                                distance: 15,
                            }],
                        },
                        {
                            name: 'C',
                            vertices: [{
                                end: {
                                    name: 'D',
                                },
                                distance: 10,
                            }],
                        },
                        {
                            name: 'D',
                            vertices: [{
                                end: {
                                    name: 'C',
                                },
                                distance: 10,
                            }],
                        },
                    ],
                    getNode() { },
                },
            });

            const getNodeStub = sinon.stub(myMapReader.map, 'getNode');
            getNodeStub.withArgs('A').returns(myMapReader.map.nodes[0]);
            getNodeStub.withArgs('B').returns(myMapReader.map.nodes[1]);
            getNodeStub.withArgs('C').returns(myMapReader.map.nodes[2]);
            getNodeStub.withArgs('D').returns(myMapReader.map.nodes[3]);

            let distance = myMapReader.calculateShortestRoute('A', 'C');
            expect(distance).to.equal(1);

            distance = myMapReader.calculateShortestRoute('A', 'D');
            expect(distance).to.equal(11);

            distance = myMapReader.calculateShortestRoute('C', 'C');
            expect(distance).to.equal(20);

            distance = myMapReader.calculateShortestRoute('A', 'D');
            expect(distance).to.equal(11);

            myMapReader.map.nodes[0].vertices[1].distance = 100;

            distance = myMapReader.calculateShortestRoute('A', 'C');
            expect(distance).to.equal(20);

            getNodeStub.restore();

            return done();
        });
    });

    describe('calculateTripsByDistance()', () => {
        it('Calculate the number of trips within distance', (done) => {
            myMapReader = mapReader.create({
                map: {
                    nodes: [
                        {
                            name: 'A',
                            vertices: [{
                                end: {
                                    name: 'B',
                                },
                                distance: 10,
                            },
                            {
                                end: {
                                    name: 'C',
                                },
                                distance: 1,
                            }],
                        },
                        {
                            name: 'B',
                            vertices: [{
                                end: {
                                    name: 'C',
                                },
                                distance: 10,
                            }],
                        },
                        {
                            name: 'C',
                            vertices: [{
                                end: {
                                    name: 'B',
                                },
                                distance: 10,
                            }],
                        },
                    ],
                    getNode() { },
                },
            });

            const getNodeStub = sinon.stub(myMapReader.map, 'getNode');
            getNodeStub.withArgs('A').returns(myMapReader.map.nodes[0]);
            getNodeStub.withArgs('B').returns(myMapReader.map.nodes[1]);
            getNodeStub.withArgs('C').returns(myMapReader.map.nodes[2]);

            let numberOfTrips = myMapReader.calculateTripsByDistance('A', 'C', 2);
            expect(numberOfTrips).to.equal(1);

            numberOfTrips = myMapReader.calculateTripsByDistance('A', 'C', 22);
            expect(numberOfTrips).to.equal(3);

            getNodeStub.restore();

            return done();
        });
    });
});

/* eslint-enable */
