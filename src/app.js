

const mapReader = require('./mapReader');

const myMapReader = mapReader.create({ mapName: './map.json' });

// console.log('myMapReader', myMapReader);

console.log('##### TEST CASES #####');
// console.log('The distance of the route A-B-C: ', myMapReader.calculateDistance('A', 'B', 'C'));
// console.log('The distance of the route A-D: ', myMapReader.calculateDistance('A', 'D'));
// console.log('The distance of the route A-D-C: ', myMapReader.calculateDistance('A', 'D', 'C'));
// console.log('The distance of the route A-E-B-C-D: ', myMapReader.calculateDistance('A', 'E', 'B', 'C', 'D'));
// console.log('The distance of the route A-E-D: ', myMapReader.calculateDistance('A', 'E', 'D'));

// console.log('The number of trips starting at C and ending at C with a maximum of 3 stops: ', myMapReader.calculateTrips('C', 'C', 3));
// console.log('The number of trips starting at A and ending at C with exactly 4 stops: ', myMapReader.calculateTrips('A', 'C', 4, true));

// console.log('The length of the shortest route (in terms of distance to travel) from A to C: ', myMapReader.calculateShortestRoute('A', 'C'));
// console.log('The length of the shortest route (in terms of distance to travel) from B to B: ', myMapReader.calculateShortestRoute('B', 'B'));
// console.log('The length of the shortest route (in terms of distance to travel) from C to C: ', myMapReader.calculateShortestRoute('C', 'C'));
console.log('The number of different routes from C to C with a distance of less than 30: ', myMapReader.calculateTripsByDistance('C', 'C', 30));
