import { parse } from "path";
import { importFile } from "../common/fileImporter";

const transpose = (matrix: any[][]) => {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
};

const expendGalexyY = (galaxyMap: any[][]) => {
  const newGalaxyMap = galaxyMap.reduce((acc, line) => {
    const hasGalexy = line.some((char) => char === "#");
    if (hasGalexy) {
      acc.push(line);
    } else {
      acc.push(line);
      acc.push(line);
    }
    return acc;
  }, []);

  return newGalaxyMap;
};

const findexpendIndices = (galaxyMap: any[][]) => {
  const expandIndizes = [];
  const newGalaxyMap = galaxyMap.reduce((acc, line, index) => {
    const hasGalexy = line.some((char) => char === "#");
    if (!hasGalexy) {
      expandIndizes.push(index);
    }
    return acc;
  }, []);

  return expandIndizes;
};

const main = () => {
  const EXPAND_FACTOR = 1000000;
  const inputData = importFile("./src/11/input.txt");
  if (inputData === undefined) return;
  const unexpandetGalaxyMap = inputData.split("\n").map((line) => {
    return [...line];
  });

  console.log(unexpandetGalaxyMap);

  const expandedGalexy = transpose(
    expendGalexyY(transpose(expendGalexyY(unexpandetGalaxyMap)))
  );

  const expandIndicesY = findexpendIndices(unexpandetGalaxyMap);
  const expandIndicesX = findexpendIndices(transpose(unexpandetGalaxyMap));

  const galaxyList = [];
  unexpandetGalaxyMap.forEach((line, y) => {
    line.forEach((char, x) => {
      if (char === "#") {
        galaxyList.push({ x, y });
      }
    });
  });

  console.log(galaxyList);

  console.log({ expandIndicesX, expandIndicesY });

  let distanceSum = 0;

  galaxyList.forEach((selectedGalexy) => {
    galaxyList.forEach((otherGalexy) => {
      if (selectedGalexy === otherGalexy) return;
      const xExpandedBetween = expandIndicesX.filter((index) => {
        return (
          index < Math.max(selectedGalexy.x, otherGalexy.x) &&
          index > Math.min(selectedGalexy.x, otherGalexy.x)
        );
      });
      const yExpandedBetween = expandIndicesY.filter((index) => {
        return (
          index < Math.max(selectedGalexy.y, otherGalexy.y) &&
          index > Math.min(selectedGalexy.y, otherGalexy.y)
        );
      });
      console.log({
        selectedGalexy,
        otherGalexy,
        xExpandedBetween,
        yExpandedBetween,
      });
      const distance =
        Math.abs(otherGalexy.x - selectedGalexy.x) +
        Math.abs(otherGalexy.y - selectedGalexy.y) +
        xExpandedBetween.length * (EXPAND_FACTOR - 1) +
        yExpandedBetween.length * (EXPAND_FACTOR - 1);
      //console.log({ distance, selectedGalexy, otherGalexy });
      distanceSum += distance;
    });
  });

  distanceSum = distanceSum / 2;
  console.log({ result01: distanceSum });
};

main();

//2175229268 to high
