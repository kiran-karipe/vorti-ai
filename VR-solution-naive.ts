import fs from 'fs';
const MAX_TIME = 12*60;
const filename = process.argv[2];

const vehicleRoutingNaive = () => {
  const file = fs.readFileSync(filename);
  const coordinates = file.toString().split("\n");
  const driversLoad: any = [];
  let driverLoad: number[] = [];
  let driverTime: number = 0;
  let totalNoOfDrivenMinutes = 0;

  for (let i = 1; i < coordinates.length - 1; i++) {
    const [x1, y1, x2, y2] = getCoOrdinates(coordinates[i]);
    let driveTime = 0;
    if (driverTime === 0) {
      driveTime = euclideanDistance(0, 0, parseFloat(x2), parseFloat(y2));
    }
    driveTime += euclideanDistance(parseFloat(x1), parseFloat(y1), parseFloat(x2), parseFloat(y2));
    driveTime += euclideanDistance(parseFloat(x1), parseFloat(y1), 0, 0);
    totalNoOfDrivenMinutes += driveTime;
    driverTime += driveTime;
    if (driverTime < MAX_TIME) {
      driverLoad.push(i);
    } else {
      driverTime = driveTime;
      driversLoad.push(driverLoad);
      driverLoad = [];
      driverLoad.push(i);
    }
  }
  driversLoad.push(driverLoad);
  for (let i = 0; i < driversLoad.length; i++) {
    console.log(driversLoad[i]);
  }
}


const euclideanDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  // const a = Math.pow((x2-x1), 2);
  const a = (x2-x1) * (x2-x1);
  // const b = Math.pow((y2-y1), 2);
  const b = (y2-y1) * (y2-y1);
  return Math.sqrt(a + b);
}

const getCoOrdinates = (coordinate: string) => {
  const firstOpenBracket = coordinate.indexOf('(');
  const firstClosedBracket = coordinate.indexOf(')');
  const lastOpenBracket = coordinate.lastIndexOf('(');
  const lastClosedBracket = coordinate.lastIndexOf(')');  
  const [x1, y1] = coordinate.substring(firstOpenBracket + 1, firstClosedBracket).split(',');
  const [x2, y2] = coordinate.substring(lastOpenBracket + 1, lastClosedBracket).split(',');
  return [x1, y1, x2, y2];
}

vehicleRoutingNaive();


// Steps to run
// npx ts-node VR-solution-naive.ts problem3.txt


//  Reference on how to read file from command line typescript
//  https://www.reddit.com/r/typescript/comments/l9ufvt/how_to_take_file_input_from_cmd_line_while_using/?rdt=37824