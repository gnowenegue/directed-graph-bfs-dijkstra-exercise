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

            try {
                myMapReader = mapReader.create({
                    mapName,
                    loadMap() { throw new Error(); },
                });
            } catch (e) {
                expect(e).to.be.an('error');
            }

            return done();
        });

        it('Pass in mapName, should loadMap()', (done) => {
            const mapName = './map.json';

            let load = false;

            myMapReader = mapReader.create({
                mapName,
                loadMap() { load = true; },
            });

            expect(load).to.be.true;

            return done();
        });
    });

    beforeEach(() => {
        myMapReader = mapReader.create();
    });

    describe('loadMap()', () => {
        beforeEach(() => {
            sinon.stub(nodes, 'create');
        });

        it('Load valid map file', (done) => {
            const mapName = './map.json';

            nodes.create.returns({
                createNodes() {},
            });

            myMapReader.loadMap(mapName);

            expect(myMapReader.mapData).to.exist;

            return done();
        });

        it('Load invalid map file, should throw error', (done) => {
            const mapName = 'nosuchmapexists.json';

            try {
                myMapReader.loadMap(mapName);
            } catch (e) {
                expect(e).to.be.an('error');
            }

            return done();
        });

        afterEach(() => {
            nodes.create.restore();
        });
    });

    describe('calculateDistance()', () => {
        beforeEach(() => {
            myMapReader.map.validateNodes = () => {};
            myMapReader.map.getNode = () => {};
            sinon.stub(myMapReader.map, 'validateNodes');
            sinon.stub(myMapReader.map, 'getNode');
        });

        it('Calculate the distance for one node, should return 0', (done) => {
            myMapReader.map.validateNodes.returns(true);

            const distance = myMapReader.calculateDistance('A');

            expect(distance).to.equal(0);

            return done();
        });

        it('Calculate the distance for invalid node, should return error', (done) => {
            myMapReader.map.validateNodes.returns(false);

            const distance = myMapReader.calculateDistance('Z');

            expect(distance).to.equal('NO SUCH ROUTE');

            return done();
        });

        it('Calculate the distance from node to node', (done) => {
            myMapReader.map = {
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
                getNode() {},
                validateNodes() { return true; },
            };

            sinon.stub(myMapReader.map, 'getNode');
            myMapReader.map.getNode.withArgs('A').returns(myMapReader.map.nodes[0]);
            myMapReader.map.getNode.withArgs('B').returns(myMapReader.map.nodes[1]);

            const distance = myMapReader.calculateDistance('A', 'B');

            expect(distance).to.equal(10);

            return done();
        });

        it('Calculate the distance of invalid route, should return error in String', (done) => {
            myMapReader.map = {
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
                getNode() {},
                validateNodes() { return true; },
            };

            sinon.stub(myMapReader.map, 'getNode');
            myMapReader.map.getNode.withArgs('A').returns(myMapReader.map.nodes[0]);
            myMapReader.map.getNode.withArgs('B').returns(myMapReader.map.nodes[1]);

            expect(myMapReader.calculateDistance('A', 'B')).to.equal('NO SUCH ROUTE');

            return done();
        });

        afterEach(() => {
            if (myMapReader.map.validateNodes.restore) {
                myMapReader.map.validateNodes.restore();
            }

            if (myMapReader.map.getNode.restore) {
                myMapReader.map.getNode.restore();
            }
        });
    });

    describe('calculateTrips()', () => {
        beforeEach(() => {
            myMapReader.map = {
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
                getNode() {},
                validateNodes() { return true; },
            };

            sinon.stub(myMapReader.map, 'getNode');
            myMapReader.map.getNode.withArgs('A').returns(myMapReader.map.nodes[0]);
            myMapReader.map.getNode.withArgs('B').returns(myMapReader.map.nodes[1]);
            myMapReader.map.getNode.withArgs('C').returns(myMapReader.map.nodes[2]);
        });

        it('Calculate number of trips of invalid nodes, should return 0', (done) => {
            myMapReader.map.getNode.withArgs('B').returns(null);

            let numberOfTrips = myMapReader.calculateTrips('A', 'B', 2);

            expect(numberOfTrips).to.equal(0);

            myMapReader.map.validateNodes = () => false;

            numberOfTrips = myMapReader.calculateTrips('X', 'X', 2);

            expect(numberOfTrips).to.equal(0);

            return done();
        });

        it('Calculate number of trips within number of stops', (done) => {
            const numberOfTrips = myMapReader.calculateTrips('A', 'C', 2);

            expect(numberOfTrips).to.equal(2);

            return done();
        });

        it('Calculate number of trips at exact number of stops', (done) => {
            const numberOfTrips = myMapReader.calculateTrips('A', 'C', 2, true);

            expect(numberOfTrips).to.equal(1);

            return done();
        });

        afterEach(() => {
            if (myMapReader.map.getNode.restore) {
                myMapReader.map.getNode.restore();
            }
        });
    });

    describe('calculateShortestRoute()', () => {
        beforeEach(() => {
            myMapReader.map = {
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
                getNode() {},
                validateNodes() { return true; },
            };

            sinon.stub(myMapReader.map, 'getNode');
            myMapReader.map.getNode.withArgs('A').returns(myMapReader.map.nodes[0]);
            myMapReader.map.getNode.withArgs('B').returns(myMapReader.map.nodes[1]);
            myMapReader.map.getNode.withArgs('C').returns(myMapReader.map.nodes[2]);
            myMapReader.map.getNode.withArgs('D').returns(myMapReader.map.nodes[3]);
        });

        it('Calculate the shortest route of invalid nodes, should return error', (done) => {
            myMapReader.map.validateNodes = () => false;

            const distance = myMapReader.calculateShortestRoute('X', 'X');

            expect(distance).to.equal('NO SUCH ROUTE');

            return done();
        });

        it('Calculate the shortest route', (done) => {
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

            distance = myMapReader.calculateShortestRoute('B', 'A');
            expect(distance).to.equal('NO SUCH ROUTE');

            return done();
        });

        afterEach(() => {
            if (myMapReader.map.getNode.restore) {
                myMapReader.map.getNode.restore();
            }
        });
    });

    describe('calculateTripsByDistance()', () => {
        beforeEach(() => {
            myMapReader.map = {
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
                getNode() {},
                validateNodes() { return true; },
            };

            sinon.stub(myMapReader.map, 'getNode');
            myMapReader.map.getNode.withArgs('A').returns(myMapReader.map.nodes[0]);
            myMapReader.map.getNode.withArgs('B').returns(myMapReader.map.nodes[1]);
            myMapReader.map.getNode.withArgs('C').returns(myMapReader.map.nodes[2]);
        });

        it('Calculate the number of trips of invalid nodes', (done) => {
            myMapReader.map.getNode.withArgs('B').returns(null);

            let numberOfTrips = myMapReader.calculateTripsByDistance('A', 'C', 50);

            expect(numberOfTrips).to.equal(0);

            myMapReader.map.validateNodes = () => false;

            numberOfTrips = myMapReader.calculateTripsByDistance('X', 'X', 10);

            expect(numberOfTrips).to.equal(0);

            return done();
        });

        it('Calculate the number of trips within distance', (done) => {
            let numberOfTrips = myMapReader.calculateTripsByDistance('A', 'C', 2);
            expect(numberOfTrips).to.equal(1);

            numberOfTrips = myMapReader.calculateTripsByDistance('A', 'C', 22);
            expect(numberOfTrips).to.equal(3);

            return done();
        });

        afterEach(() => {
            if (myMapReader.map.getNode.restore) {
                myMapReader.map.getNode.restore();
            }
        });
    });
});

/* eslint-enable */
