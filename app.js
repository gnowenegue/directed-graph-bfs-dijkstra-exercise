const mapReader = require('./src/mapReader');

const myMapReader = mapReader.create({ mapName: './map.json' });

/* eslint-disable no-console, max-len */

console.log('##### TEST CASES #####');
console.log('The distance of the route A-B-C (9): ', myMapReader.calculateDistance('A', 'B', 'C'));
console.log('The distance of the route A-D (5): ', myMapReader.calculateDistance('A', 'D'));
console.log('The distance of the route A-D-C (13): ', myMapReader.calculateDistance('A', 'D', 'C'));
console.log('The distance of the route A-E-B-C-D (22): ', myMapReader.calculateDistance('A', 'E', 'B', 'C', 'D'));
console.log('The distance of the route A-E-D (error): ', myMapReader.calculateDistance('A', 'E', 'D'));

console.log('');

console.log('The number of trips starting at C and ending at C with a maximum of 3 stops (2): ', myMapReader.calculateTrips('C', 'C', 3));

console.log('');

console.log('The number of trips starting at A and ending at C with exactly 4 stops (3): ', myMapReader.calculateTrips('A', 'C', 4, true));

console.log('');

console.log('The length of the shortest route (in terms of distance to travel) from A to C (9): ', myMapReader.calculateShortestRoute('A', 'C'));
console.log('The length of the shortest route (in terms of distance to travel) from B to B (9): ', myMapReader.calculateShortestRoute('B', 'B'));

console.log('');

console.log('The number of different routes from C to C with a distance of less than 30 (7): ', myMapReader.calculateTripsByDistance('C', 'C', 30));

console.log('');

console.log('##### EXTRA TEST CASES #####');
console.log('The distance of the route A (0): ', myMapReader.calculateDistance('A'));
console.log('The distance of the route Z (error): ', myMapReader.calculateDistance('Z'));
console.log('The distance of the route Z-A (error): ', myMapReader.calculateDistance('Z', 'A'));
console.log('The distance of the route A-Z (error): ', myMapReader.calculateDistance('A', 'Z'));
console.log('The distance of the route A-Mars-A (error): ', myMapReader.calculateDistance('A', 'Mars', 'A'));
console.log('The distance of the route A-Z-A (error): ', myMapReader.calculateDistance('A', 'Z', 'A'));
console.log('The distance of the route A-B-A (error): ', myMapReader.calculateDistance('A', 'B', 'A'));
console.log('The distance of the route C-A-C-E-C (error): ', myMapReader.calculateDistance('C', 'A', 'C', 'E', 'C'));
console.log('The distance of the route C-A-C-B (error): ', myMapReader.calculateDistance('C', 'A', 'C', 'B'));
console.log('The distance of the route C-D-C (16): ', myMapReader.calculateDistance('C', 'D', 'C'));
console.log('The distance of the route C-D-C-D (24): ', myMapReader.calculateDistance('C', 'D', 'C', 'D'));
console.log('The distance of the route C-E-B-C (9): ', myMapReader.calculateDistance('C', 'E', 'B', 'C'));
console.log('The distance of the route C-D-C-E (18): ', myMapReader.calculateDistance('C', 'D', 'C', 'E'));
console.log('The distance of the route A-E-B-C-E (16): ', myMapReader.calculateDistance('A', 'E', 'B', 'C', 'E'));

console.log('');

console.log('The number of trips starting at C and ending at D with a maximum of 1 stops (1): ', myMapReader.calculateTrips('C', 'D', 1));
console.log('The number of trips starting at C and ending at C with a maximum of 2 stops (1): ', myMapReader.calculateTrips('C', 'C', 2));
console.log('The number of trips starting at C and ending at C with a maximum of 0 stops (0): ', myMapReader.calculateTrips('C', 'C', 0));
console.log('The number of trips starting at C and ending at C with a maximum of 1 stops (0): ', myMapReader.calculateTrips('C', 'C', 1));
console.log('The number of trips starting at C and ending at A with a maximum of 20 stops (0): ', myMapReader.calculateTrips('C', 'A', 20));
console.log('The number of trips starting at C and ending at Z with a maximum of 20 stops (0): ', myMapReader.calculateTrips('C', 'Z', 20));
console.log('The number of trips starting at C and ending at Mars with a maximum of 20 stops (0): ', myMapReader.calculateTrips('C', 'Mars', 20));
console.log('The number of trips starting at Z and ending at A with a maximum of 0 stops (0): ', myMapReader.calculateTrips('Z', 'A', 0));
console.log('The number of trips starting at Z and ending at A with a maximum of 20 stops (0): ', myMapReader.calculateTrips('Z', 'A', 20));
console.log('The number of trips starting at Z and ending at Z with a maximum of 20 stops (0): ', myMapReader.calculateTrips('Z', 'Z', 20));

console.log('');

console.log('The number of trips starting at A and ending at D with exactly 2 stops (0): ', myMapReader.calculateTrips('A', 'D', 2, true));
console.log('The number of trips starting at C and ending at C with exactly 2 stops (1): ', myMapReader.calculateTrips('C', 'C', 2, true));

console.log('');

console.log('The length of the shortest route (in terms of distance to travel) from B to A (error): ', myMapReader.calculateShortestRoute('B', 'A'));
console.log('The length of the shortest route (in terms of distance to travel) from A to A (error): ', myMapReader.calculateShortestRoute('A', 'A'));
console.log('The length of the shortest route (in terms of distance to travel) from A to Z (error): ', myMapReader.calculateShortestRoute('A', 'Z'));
console.log('The length of the shortest route (in terms of distance to travel) from Z to A (error): ', myMapReader.calculateShortestRoute('Z', 'A'));
console.log('The length of the shortest route (in terms of distance to travel) from Z to Z (error): ', myMapReader.calculateShortestRoute('Z', 'Z'));
console.log('The length of the shortest route (in terms of distance to travel) from A to Mars (error): ', myMapReader.calculateShortestRoute('A', 'Mars'));
console.log('The length of the shortest route (in terms of distance to travel) from Mars to A (error): ', myMapReader.calculateShortestRoute('Mars', 'A'));
console.log('The length of the shortest route (in terms of distance to travel) from C to C (9): ', myMapReader.calculateShortestRoute('C', 'C'));
console.log('The length of the shortest route (in terms of distance to travel) from B to E (6): ', myMapReader.calculateShortestRoute('B', 'E'));

console.log('');

console.log('The number of different routes from A to B with a distance of less than 5 (0): ', myMapReader.calculateTripsByDistance('A', 'B', 5));
console.log('The number of different routes from A to B with a distance of less than 6 (1): ', myMapReader.calculateTripsByDistance('A', 'B', 6));
console.log('The number of different routes from C to C with a distance of less than 9 (0): ', myMapReader.calculateTripsByDistance('C', 'C', 9));
console.log('The number of different routes from C to C with a distance of less than 10 (1): ', myMapReader.calculateTripsByDistance('C', 'C', 10));
console.log('The number of different routes from A to A with a distance of less than 100 (0): ', myMapReader.calculateTripsByDistance('A', 'A', 100));
console.log('The number of different routes from A to Z with a distance of less than 100 (0): ', myMapReader.calculateTripsByDistance('A', 'Z', 100));
console.log('The number of different routes from Z to A with a distance of less than 100 (0): ', myMapReader.calculateTripsByDistance('Z', 'A', 100));
console.log('The number of different routes from Z to Z with a distance of less than 100 (0): ', myMapReader.calculateTripsByDistance('Z', 'Z', 100));
console.log('The number of different routes from A to Mars with a distance of less than 100 (0): ', myMapReader.calculateTripsByDistance('A', 'Mars', 100));
console.log('The number of different routes from Mars to Z with a distance of less than 100 (0): ', myMapReader.calculateTripsByDistance('Mars', 'Z', 100));

/* eslint-enable */
