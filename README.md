# Installation
## Prerequisites
- Node (v6.9.2)
- NPM (v3.10.9)

## How to Install
After cloning / downloading the project to your local directory, go into the project folder and run `npm install`.

# How to Run
To run the project, simply run `npm start`.

The main file of this project is `./app.js` on the root level. You can add other use cases there.

## Linting
To lint the codes with ESLint, run `npm run lint`. This command is also automatically triggered as a pre-commit git hook.

## Unit Testing
To run the unit tests, run `npm test` and a HTML report will be generated in `./coverage/index.html`. This command is also automatically triggered as a pre-push git hook.

# Explanation
## Structure
This main structure consists of 4 different objects, each with its own roles and responsibilities.

### Map Reader
The main object of the project, containing the main methods to run.

It consists of the following properties:
- `mapName` — the file name of the map that is being loaded
- `mapData` — array data loaded from the map file
- `map` — Nodes object containing the whole map

It consists of the following methods:
- `create()` — constructor
- `loadMap()` — to load the map from a JSON file
- `calculateDistance()` — details can be found below
- `calculateTrips()` — details can be found below
- `calculateShortestRoute()` — details can be found below
- `calculateTripsByDistance()` — details can be found below

### Nodes
This object holds all the information of the map.

It consists of the following properties:
- `nodes` — array to hold all the Node objects

It consists of the following methods:
- `create()` — constructor
- `createNodes()` — create the Node objects from the map data
- `addNode()` — add Node object into the `nodes` array
- `getNode()` — retrieve the Node object from the `nodes` array
- `validateNodes()` — check if the Node objects exist in the `nodes` array

### Node
This object represents different points on the map.

It consists of the following properties:
- `name` — unique identifier of this Node object
- `vertices` — linkage information to other Node objects

It consists of the following methods:
- `create()` — constructor
- `addVertex()` — add Vertex object into `vertices` array
- `getVertex()` — retrieve Vertex object from `vertices` array

### Vertex
This object links node objects together.

It consists of the following properties:
- `start` — starting Node object
- `end` — ending Node object
- `distance` — distance from starting Node object to ending Node object

It doesn’t have any methods, except for the its constructor.

## Project Details
This project is broken down into 4 main tasks:
- Calculate the distance of a particular route (i.e. A—B—C)
- Calculate the number of trips from a node to the other, either allowing up to a maximum number of stops or exactly at a certain number of stops
- Calculate the distance of the shortest route from a node to the other
- Calculate the number of trips from a node to the other with a certain distance

As such, there are 4 methods that can be called.

### calculateDistance(...nodeNames)

#### Example of usage
To calculate the distance from node A to B and to C, run `calculateDistance(‘A’, ‘B’, ‘C’)`.

#### Design and thinking
All the Node objects are linked together via the Vertex objects. So, starting from the first Node object, it will traverse all the way to the last Node object, while calculating the distance, which is an information found in the Vertex object linking multiple Node objects together.

If there is no possible route, “NO SUCH ROUTE” will be returned.

### calculateTrips(startNodeName, endNodeName, maxStops, exact)

#### Example of usage
To calculate the number of trips from node A to B with up to 3 stops, run `calculateTrips(‘A’, ‘B’, 3, false)`.
To calculate the number of trips from node A to B with exactly 3 stops, run `calculateTrips(‘A’, ‘B’, 3, true)`.

#### Design and thinking
This method uses Breadth-First Search algorithm to traverse through the Node objects. Look at the map in a search tree structure, the number of stops actually represents the depth of the tree. The main loop will stop once the depth equals to `maxStops` + 1. The + 1 is because an extra level of traversal is required in order for the queue to be able to access the Node objects.

If `exact` is false, all the trips up to the depth `maxStops` will be included.

If `exact` is true, only the trips at the depth `maxStops` will be considered.

If no trips can be found based on the conditions, 0 will be returned.

### calculateShortestRoute(startNodeName, endNodeName)

#### Example of usage
To calculate the distance of the shortest route from node A to B, run `calculateShortestRoute(‘A’, ‘B’)`.

#### Design and thinking
The main algorithm to execute this method is [Dijkstra’s algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Algorithm).

This method only returns the distance of the shortest route. It can be further modified to return the route.

If there is no possible route, “NO SUCH ROUTE” will be returned.

### calculateTripsByDistance(startNodeName, endNodeName, distance)

#### Example of usage
To calculate the number of trips from node A to B within distance of 30, run `calculateTripsByDistance(‘A’, ‘B’, 30)`.

#### Design and thinking
This method uses Breadth-First Search algorithm to traverse through the Node objects. During each traversal, the distance travelled thus far from the starting Node object will be assigned to the Node objects. The deciding factor whether to push the Node object into the queue, is by comparing the distance value with the `distance` limit value. Eventually the queue will be emptied and the result will be returned.

If no trips can be found, 0 will be returned.

## Assumptions
- Node’s name is a unique identifier.
- Node’s name is a single alphabet.
- Node’s name is case sensitive.
- Distance is a positive single-digit integer.
- When calculating number of trips from 1 node to the other, if starting Node’s name is the same as ending Node’s name, only trips that has a stop other than itself is included.
- When calculating distance of shortest route, if starting Node’s name is the same as ending Node’s name, the value must be bigger than 0.
- When calculating number of trips within distance limit, if starting Node’s name is the same as ending Node’s name, only trips that has a stop other than itself is included.
- When calculating number of trips within distance limit, exclude the trips with distance equals the limit itself.
- Map file structure:
```json
{
    "map": ["AB5", "BC4", "CD8", "DC8", "DE6", "AD5", "CE2", "EB3", "AE7"]
}
```
