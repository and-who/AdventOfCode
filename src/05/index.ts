import { parse } from "path";
import { importFile } from "../common/fileImporter";

interface Mapping {
  from: number;
  to: number;
  length: number;
}

interface Map {
  name: string;
  mappings: Mapping[];
}

const mapValue = (value: number, map: Map) => {
  //console.log({ value, map });
  const mapping = map.mappings.find(
    (mapping) => value >= mapping.from && value <= mapping.from + mapping.length
  );
  let targetValue = value;
  if (mapping !== undefined) targetValue = mapping.to + (value - mapping.from);

  //console.log({ name: map.name, value, targetValue, mapping });
  return targetValue;
};

const main = () => {
  const inputData = importFile("./src/05/input.txt");
  if (inputData === undefined) return;

  const lines = inputData.split("\n");

  const initialSeeds = [];
  const allMaps: Map[] = [];
  let currentMap: Map = { name: "", mappings: [] };

  lines.forEach((line, index) => {
    if (index === 0) {
      line
        .split(": ")[1]
        .split(" ")
        .forEach((numberString) => {
          initialSeeds.push(parseInt(numberString));
        });
      return;
    }

    if (index === 1) {
      return;
    }

    if (line.length === 0) {
      allMaps.push(currentMap);
      currentMap = { name: "", mappings: [] };
      return;
    }

    if (Number.isNaN(parseInt(line[0]))) {
      currentMap.name = line;
    } else {
      const valueLine = line.split(" ");
      currentMap.mappings.push({
        from: parseInt(valueLine[1]),
        to: parseInt(valueLine[0]),
        length: parseInt(valueLine[2]),
      });
    }
  });

  allMaps.push(currentMap);

  console.log({ initialSeeds, allMaps });

  const sortedLocation = initialSeeds
    .map((seed) => {
      const lastMapValue = allMaps.reduce(
        (acc, map) => mapValue(acc, map),
        seed
      );
      console.log({ seed, lastMapValue });
      return lastMapValue;
    })
    .sort((a, b) => a - b);

  console.log("Result1: ", sortedLocation[0]);

  const result = initialSeeds.reduce((acc, value, index) => {
    if (index % 2 === 1) {
      console.log("Seedrange", initialSeeds[index - 1], value);
      let smallestValue;
      for (let i = 0; i < value; i++) {
        const currentSeed = initialSeeds[index - 1] + i;
        const lastMapValue = allMaps.reduce(
          (acc, map) => mapValue(acc, map),
          currentSeed
        );
        smallestValue = smallestValue
          ? Math.min(smallestValue, lastMapValue)
          : lastMapValue;
      }
      return acc ? Math.min(smallestValue, acc) : smallestValue;
    }
    return acc;
  });

  console.log("Result2: ", result);

  // const extendedSortedLocation = extendedInitialSeeds
  //   .map((seed) => {
  //     const lastMapValue = allMaps.reduce(
  //       (acc, map) => mapValue(acc, map),
  //       seed
  //     );
  //     console.log({ seed, lastMapValue });
  //     return lastMapValue;
  //   })
  //   .sort((a, b) => a - b);

  // console.log("Result2: ", extendedSortedLocation[0]);
};

main();
