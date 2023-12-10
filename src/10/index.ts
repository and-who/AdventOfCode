import { parse } from "path";
import { importFile } from "../common/fileImporter";

type PipeType = "|" | "-" | "L" | "J" | "7" | "F";

interface PipeNode {
  x: number;
  y: number;
  type: PipeType;
  connections: [number, number][];
}

const pipeDefinitions = {
  "|": [
    [0, 1], // down
    [0, -1], // up
  ],
  "-": [
    [1, 0], // right
    [-1, 0], // left
  ],
  L: [
    [0, -1], // up
    [1, 0], // right
  ],
  J: [
    [0, -1], // up
    [-1, 0], // left
  ],
  "7": [
    [-1, 0], // left
    [0, 1], // down
  ],
  F: [
    [1, 0], // right
    [0, 1], // down
  ],
};

const isInBounds = (x: number, y: number, pipemap: any[][]) => {
  return x >= 0 && y >= 0 && y < pipemap.length && x < pipemap[y].length;
};

const getConnectedPipes = (pipeNode: PipeNode, pipemap: any[][]) => {
  if (pipeNode === undefined) return [];
  return pipeNode.connections.map((connection) => {
    const [dx, dy] = connection;
    if (isInBounds(dx, dy, pipemap)) {
      return pipemap[dy][dx];
    }
  });
};

const buildLoop = (startNode, pipemap: any[][]) => {
  const loop = [];
  loop.push(startNode);
  loop.push(getConnectedPipes(startNode, pipemap)[0]);

  while (loop[loop.length - 1] !== startNode) {
    const connectedPipes = getConnectedPipes(loop[loop.length - 1], pipemap);
    const nextPipe = connectedPipes.find(
      (pipe) => pipe !== false && pipe !== loop[loop.length - 2]
    );
    loop.push(nextPipe);
  }
  return loop;
};

const isPartOf = (pipeNode: PipeNode, loop: PipeNode[]) => {
  if (pipeNode === undefined) return false;
  loop.forEach((loopPipeNode) => {
    if (pipeNode.x === loopPipeNode.x && pipeNode.y === loopPipeNode.y) {
      return true;
    }
    return false;
  });
};

const main = () => {
  const inputData = importFile("./src/10/input.txt");
  if (inputData === undefined) return;

  let startingPipeCoordinates = [];

  const pipemap: PipeNode[][] = inputData.split("\n").map((line, y) =>
    line.split("").map((value, x) => {
      if (value === "S") {
        startingPipeCoordinates = [x, y];
      }

      if (Object.keys(pipeDefinitions).includes(value)) {
        const connections = pipeDefinitions[value].map((direction) => {
          const [dx, dy] = direction;
          return [x + dx, y + dy];
        });

        return {
          x,
          y,
          type: value,
          connections,
        } as PipeNode;
      }
    })
  );

  Object.keys(pipeDefinitions).forEach((pipeType) => {
    const numEndsMatch = pipeDefinitions[pipeType].reduce((acc, pipeEnd) => {
      const [dx, dy] = pipeEnd;
      const [x, y] = startingPipeCoordinates;
      const [x2, y2] = [x + dx, y + dy];
      const assumingEnd = pipemap[y2]?.[x2];

      assumingEnd?.connections?.forEach((connection) => {
        if (
          connection[0] === startingPipeCoordinates[0] &&
          connection[1] === startingPipeCoordinates[1]
        ) {
          acc++;
        }
      });

      return acc;
    }, 0);

    if (numEndsMatch === 2) {
      const connections = pipeDefinitions[pipeType].map((direction) => {
        const [dx, dy] = direction;
        return [
          startingPipeCoordinates[0] + dx,
          startingPipeCoordinates[1] + dy,
        ];
      });
      pipemap[startingPipeCoordinates[1]][startingPipeCoordinates[0]] = {
        x: startingPipeCoordinates[0],
        y: startingPipeCoordinates[1],
        type: pipeType as PipeType,
        connections,
      };
    }
  });

  const startNode =
    pipemap[startingPipeCoordinates[1]][startingPipeCoordinates[0]];

  console.log({ pipemap, startingPipeCoordinates, startNode });

  const loop = buildLoop(startNode, pipemap);

  console.log("Result1", { loop, halfRadius: (loop.length - 1) / 2 });

  let numInside = 0;

  pipemap.forEach((line, y) => {
    line.forEach((pipeNode, x) => {
      if (pipeNode === undefined) {
        const leftPart = line.slice(0, x);
        const rightPart = line.slice(x + 1);
        const numberBoardersLeft = leftPart.reduce((acc, leftPipeNode) => {
          let isPartOfLoop = false;
          if (leftPipeNode) {
            loop.forEach((loopPipeNode) => {
              if (
                leftPipeNode.x === loopPipeNode.x &&
                leftPipeNode.y === loopPipeNode.y
              ) {
                isPartOfLoop = true;
              }
            });
          }

          if (isPartOfLoop) {
            return acc + 1;
          }

          return acc;
        }, 0);

        const numberBoardersRight = rightPart.reduce((acc, rightPipeNode) => {
          let isPartOfLoop = false;
          if (rightPipeNode) {
            loop.forEach((loopPipeNode) => {
              if (
                rightPipeNode.x === loopPipeNode.x &&
                rightPipeNode.y === loopPipeNode.y
              ) {
                isPartOfLoop = true;
              }
            });
          }

          if (isPartOfLoop) {
            return acc + 1;
          }

          return acc;
        }, 0);

        if (
          !(numberBoardersLeft % 2 === 0) &&
          numberBoardersLeft !== 0 &&
          numberBoardersRight !== 0
        ) {
          console.log({ leftPart, numberBoardersLeft, numberBoardersRight });
          numInside++;
        } else {
          if (
            isPartOf(pipemap[1][0], loop) &&
            isPartOf(pipemap[0][1], loop) &&
            isPartOf(pipemap[-1][0], loop) &&
            isPartOf(pipemap[0][-1], loop)
          ) {
            numInside++;
          }
        }
      }
    });
  });

  console.log({ numInside });
};

main();

//2175229268 to high
