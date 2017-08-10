const mapReader = require('./src/mapReader');

const myMapReader = mapReader.create({ mapName: './map.json' });

/* eslint-disable no-console, max-len */
console.log('##### TEST CASES #####');
console.log('The distance of the route A-B-C (9): ', myMapReader.calculateDistance('A', 'B', 'C'));
console.log('The distance of the route A-D (5): ', myMapReader.calculateDistance('A', 'D'));
console.log('The distance of the route A-D-C (13): ', myMapReader.calculateDistance('A', 'D', 'C'));
console.log('The distance of the route A-E-B-C-D (22): ', myMapReader.calculateDistance('A', 'E', 'B', 'C', 'D'));

try {
    console.log('The distance of the route A-E-D (error): ', myMapReader.calculateDistance('A', 'E', 'D'));
} catch (e) {
    console.log(e);
}

console.log('The number of trips starting at C and ending at C with a maximum of 3 stops (2): ', myMapReader.calculateTrips('C', 'C', 3));

console.log('The number of trips starting at A and ending at C with exactly 4 stops (3): ', myMapReader.calculateTrips('A', 'C', 4, true));

console.log('The length of the shortest route (in terms of distance to travel) from A to C (9): ', myMapReader.calculateShortestRoute('A', 'C'));
console.log('The length of the shortest route (in terms of distance to travel) from B to B (9): ', myMapReader.calculateShortestRoute('B', 'B'));
console.log('The number of different routes from C to C with a distance of less than 30 (7): ', myMapReader.calculateTripsByDistance('C', 'C', 30));

console.log('');
console.log('##### EXTRA TEST CASES #####');
console.log('The number of trips starting at C and ending at D with a maximum of 1 stops (1): ', myMapReader.calculateTrips('C', 'D', 1));
console.log('The number of trips starting at C and ending at C with a maximum of 2 stops (1): ', myMapReader.calculateTrips('C', 'C', 2));

console.log('The number of trips starting at C and ending at C with exactly 2 stops (1): ', myMapReader.calculateTrips('C', 'C', 2, true));

console.log('The length of the shortest route (in terms of distance to travel) from C to C(9): ', myMapReader.calculateShortestRoute('C', 'C'));
console.log('The length of the shortest route (in terms of distance to travel) from B to E (6): ', myMapReader.calculateShortestRoute('B', 'E'));

/* eslint-enable */
