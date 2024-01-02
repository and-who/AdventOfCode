import { parse } from "path";
import { importFile } from "../common/fileImporter";

interface Tile {
  char: string;
  x: number;
  y: number;
  neighbors: { x: number; y: number; deltaX: number; deltaY: number }[];
}

interface StartCoordinates {
  openStartCoordinates: { x: number; y: number }[];
  evenCoordinates: { x: number; y: number }[];
  unevenCoordinates: { x: number; y: number }[];
}

const mod_floor = (a, n) => {
  return ((a % n) + n) % n;
};

const printState = (startCoordinates: StartCoordinates, map: Tile[][]) => {
  console.log("\n");
  map.forEach((line, x) => {
    line.forEach((tile, y) => {
      if (
        startCoordinates.evenCoordinates.find(
          (coordinate) =>
            mod_floor(coordinate.x, map.length) === x &&
            mod_floor(coordinate.y, line.length) === y
        ) ||
        startCoordinates.unevenCoordinates.find(
          (coordinate) =>
            mod_floor(coordinate.x, map.length) === x &&
            mod_floor(coordinate.y, line.length) === y
        ) ||
        startCoordinates.openStartCoordinates.find(
          (coordinate) =>
            mod_floor(coordinate.x, map.length) === x &&
            mod_floor(coordinate.y, line.length) === y
        )
      ) {
        process.stdout.write("O");
      } else {
        process.stdout.write(tile.char);
      }
    });
    process.stdout.write("\n");
  });
  console.log(
    "PossiblePlaces: ",
    startCoordinates.openStartCoordinates.length,
    startCoordinates.evenCoordinates.length,
    startCoordinates.unevenCoordinates.length
  );
};

const traverseMap = (startCoordinates: StartCoordinates, map: Tile[][], i) => {
  const newOpenStartCoordinates = [];
  startCoordinates.openStartCoordinates.forEach((coordinate) => {
    if (i % 2 === 0) {
      startCoordinates.evenCoordinates.push(coordinate);
    } else {
      startCoordinates.unevenCoordinates.push(coordinate);
    }
    const loopedX = mod_floor(coordinate.x, map.length);
    const loopedY = mod_floor(coordinate.y, map[loopedX].length);

    const tile = map[loopedX][loopedY];
    tile.neighbors.forEach((neighbor) => {
      const neighborRealX = coordinate.x + neighbor.deltaX;
      const neighborRealY = coordinate.y + neighbor.deltaY;
      if (
        newOpenStartCoordinates.find(
          (coordinate) =>
            coordinate.x === neighborRealX && coordinate.y === neighborRealY
        )
      ) {
        return;
      }
      if (
        startCoordinates.evenCoordinates.find(
          (coordinate) =>
            coordinate.x === neighborRealX && coordinate.y === neighborRealY
        )
      ) {
        return;
      }
      if (
        startCoordinates.unevenCoordinates.find(
          (coordinate) =>
            coordinate.x === neighborRealX && coordinate.y === neighborRealY
        )
      ) {
        return;
      }
      newOpenStartCoordinates.push({ x: neighborRealX, y: neighborRealY });
    });
  });

  return {
    openStartCoordinates: newOpenStartCoordinates,
    evenCoordinates: startCoordinates.evenCoordinates,
    unevenCoordinates: startCoordinates.unevenCoordinates,
  };
};

const main = () => {
  const inputData = importFile("./src/21/input.txt");
  if (inputData === undefined) return;

  let startCoordinates = {
    openStartCoordinates: [],
    evenCoordinates: [],
    unevenCoordinates: [],
  };

  const inputArray = inputData.split("\n").map((line) => {
    return line.split("");
  });

  const map = inputArray.map((line, x) => {
    return line.map((char, y) => {
      const tile = { char, x, y, neighbors: [] };
      if (char === "S") {
        startCoordinates.openStartCoordinates.push({ x, y, visited: false });
      }
      if (char === "." || char === "S") {
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if ((i === 0 && j === 0) || (i !== 0 && j !== 0)) continue;
            const loopedX = mod_floor(x + i, inputArray.length);
            const loopedY = mod_floor(y + j, inputArray[loopedX].length);
            if (
              inputArray[loopedX][loopedY] === "." ||
              inputArray[loopedX][loopedY] === "S"
            ) {
              tile.neighbors.push({
                x: loopedX,
                y: loopedY,
                deltaX: i,
                deltaY: j,
              });
            }
          }
        }
      }
      return tile;
    });
  });

  printState(startCoordinates, map);
  for (let i = 0; i < 26501365; i++) {
    startCoordinates = traverseMap(startCoordinates, map, i);
    if (i % 10 === 0) {
      console.log(i);
      printState(startCoordinates, map);
    }
  }
  printState(startCoordinates, map);
};

main();
