import { parse } from "path";
import { importFile } from "../common/fileImporter";

// Function which calculates the Area of a Polygon
// https://www.mathopenref.com/coordpolygonarea.html
const getAreaOfPolygon = (
  edges: { start: { x: number; y: number }; end: { x: number; y: number } }[]
) => {
  let area = 0;
  edges.forEach((edge) => {
    area += edge.start.x * edge.end.y - edge.end.x * edge.start.y;
  });
  return Math.abs(area / 2);
};

const main = () => {
  const inputData = importFile("./src/18/input.txt");
  if (inputData === undefined) return;

  let lastCoordinate = { x: 0, y: 0 };

  const model = {
    edges: [],
  };

  const inputs = inputData.split("\n").map((inputString) => {
    const [direction, length, color] = inputString.split(" ");
    return { direction, length: parseInt(length), color };
  });

  let lastDirection = inputs[inputs.length - 1].direction;

  inputs.forEach(({ direction, length, color }, index) => {
    let startCoordinate = { ...lastCoordinate };
    let endCoordinate = { ...lastCoordinate };
    const nextInput = inputs[(index + 1) % inputs.length];
    let modifier = 0;
    switch (direction) {
      case "U":
        if (nextInput.direction === "R" && lastDirection === "L") {
          modifier = 1;
        }
        if (nextInput.direction === "L") {
          modifier = -1;
        }
        endCoordinate.y += length + modifier;
        break;
      case "D":
        if (nextInput.direction === "L") {
          modifier = 1;
        }
        if (nextInput.direction === "R") {
          modifier = -1;
        }
        endCoordinate.y -= length + modifier;
        break;
      case "R":
        if (nextInput.direction === "D") {
          modifier = 1;
        }
        if (nextInput.direction === "U") {
          modifier = -1;
        }
        endCoordinate.x += length + modifier;
        break;
      case "L":
        if (nextInput.direction === "U") {
          modifier = 1;
        }
        if (nextInput.direction === "D") {
          modifier = -1;
        }
        endCoordinate.x += length + modifier;
        break;
    }
    lastDirection = direction;
    model.edges.push({
      start: startCoordinate,
      end: endCoordinate,
      color,
    });
    lastCoordinate = endCoordinate;
  });

  console.log(model.edges);

  const area = getAreaOfPolygon(model.edges);

  console.log({ area });
};

main();
