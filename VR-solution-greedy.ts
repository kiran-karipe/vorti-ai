import fs from 'fs';
const MAX_TIME = 12*60;
const filename = process.argv[2]; // pass input file as argument

let a1: string = '', b1: string = '', a2: string = '0', b2: string = '0'; // global coordinates to track where to start from for new drivers
let loadNumber = -1; // load number to push driver list
const visitedMap = new Map(); // Hashmap to know which route is already visited
const visitedTimes = new Map();


// this is greedy solution, always looking for the closest pickup first and closest from the previous dropoff,
// until the trip back to home doesn't pass the time limit MAX_TIME

const vehicleRoutingGreedy = () => {
  const file = fs.readFileSync(filename);
  const coordinates = file.toString().split("\n");
  const driversLoad: any = [];
  let count = 0; // pickup to dropoff count which is the number of coordinate sets

  // iterate over the list of coordinates and set the initial visitMap to false for each coordinates set.
  for (let i = 1; i < coordinates.length - 1; i++) {
    const [x1, y1, x2, y2] = getCoOrdinates(coordinates[i]);
    visitedMap.set((x1+y1+x2+y2), false);
  }

  // iterate until the count reach the number of coordinate sets
  while (count < coordinates.length - 2) {
    let driverLoad: number[] = [];
    let driverTime: number = 0;

    // each driver takes loads until he reaches the time limit by going the closest pickup from his previous dropoff
    while(driverTime < MAX_TIME && count < coordinates.length - 2) {
      const closestFromPrevious = getClosestPickUpFromPrevious(a2, b2, coordinates);
      if ((driverTime + closestFromPrevious) < MAX_TIME) {
        driverTime += closestFromPrevious;
        driverLoad.push(loadNumber);
        visitedMap.set((a1+b1+a2+b2), true); // once each coordinate set is completed, set visited true to avoid visiting it again
        visitedTimes.set(loadNumber, driverTime);
        count++;
      } else {
        break;
      }
    }
    a1 = b1 = '', a2 = b2 = '0';
    driversLoad.push(driverLoad); // finally push all the drivers with all the loads they have finished
  }

  driversLoad.forEach((driverLoad: number[]) => {
    console.log(`[${driverLoad.join(',')}]`);
  })
}

// this method is to calculate the total distance from start point to dropoff and back to start position
const getClosestPickUpFromPrevious = (a: string, b: string, coordinates: string[]) => {
  let closestPickup = Number.MAX_SAFE_INTEGER;
  for (let i = 1; i < coordinates.length - 1; i++) {
    const [x1, y1, x2, y2] = getCoOrdinates(coordinates[i]);
    if (!visitedMap.get(x1+y1+x2+y2)) {
      // get the closest pickup location
      closestPickup = getClosestPickup(a, b, x1, y1, x2, y2, closestPickup, i);
    }
  }
  const dropOffFromClosest = euclideanDistance(parseFloat(a1), parseFloat(b1), parseFloat(a2), parseFloat(b2));
  const backToHome = euclideanDistance(parseFloat(a2), parseFloat(b2), parseFloat('0'), parseFloat('0'));
  return closestPickup + dropOffFromClosest + backToHome; // start to closest pickup + pickup to dropoff + dropOff to home
}

// get the closest pickup location
const getClosestPickup = (a: string, b: string, x1: string, y1: string, x2: string, y2: string, closestPickup: number, i: number) => {
  const distance = euclideanDistance(parseFloat(a), parseFloat(b), parseFloat(x1), parseFloat(y1));
  if (distance < closestPickup) {
    a1 = x1, b1 = y1, a2 = x2, b2 = y2;
    closestPickup = distance;
    loadNumber = i;
  }
  return closestPickup;
}

// general formula to calcuate Euclidean Distance
const euclideanDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  // const a = Math.pow((x2-x1), 2);
  const a = (x2-x1) * (x2-x1);
  // const b = Math.pow((y2-y1), 2);
  const b = (y2-y1) * (y2-y1);
  return Math.sqrt(a + b);
}

// to get coordinates from the string
const getCoOrdinates = (coordinate: string) => {
  const firstOpenBracket = coordinate.indexOf('(');
  const firstClosedBracket = coordinate.indexOf(')');
  const lastOpenBracket = coordinate.lastIndexOf('(');
  const lastClosedBracket = coordinate.lastIndexOf(')');  
  const [x1, y1] = coordinate.substring(firstOpenBracket + 1, firstClosedBracket).split(',');
  const [x2, y2] = coordinate.substring(lastOpenBracket + 1, lastClosedBracket).split(',');
  return [x1, y1, x2, y2];
}

vehicleRoutingGreedy();