import { parse } from "path";
import { importFile } from "../common/fileImporter";

const hashString = (str: string) => {
  let currentValue = 0;
  [...str].forEach((char) => {
    if (char === "\n") return;
    currentValue += char.charCodeAt(0);
    currentValue *= 17;
    currentValue %= 256;
  });
  return currentValue;
};

interface Lense {
  label: string;
  focalLength: number;
}

const main = () => {
  const inputData = importFile("./src/15/input.txt");
  if (inputData === undefined) return;

  let result01 = 0;

  const boxes: Lense[][] = Array(256).fill([]);

  inputData.split(",").map((inputString) => {
    const hash = hashString(inputString);
    result01 += hash;
    if (inputString.includes("=")) {
      //Add

      const [label, focalLength] = inputString.split("=");
      let boxReplaced = false;
      const box = hashString(label);
      boxes[box] = boxes[box].map((lense) => {
        if (lense.label === label) {
          boxReplaced = true;
          return { label, focalLength: parseInt(focalLength) };
        }
        return lense;
      });
      if (!boxReplaced) {
        boxes[box].push({ label, focalLength: parseInt(focalLength) });
      }
    } else {
      //Remove
      const label = inputString.substring(0, inputString.length - 1);
      const box = hashString(label);
      boxes[box] = boxes[box].filter((lense) => lense.label !== label);
    }
    console.log({ inputString, hash });
    console.log(boxes.filter((box) => box.length > 0));
  });

  let result02 = 0;

  boxes.forEach((box, boxIndex) => {
    box.forEach((lense, lenseIndex) => {
      const lenseFocusPower =
        (boxIndex + 1) * (lenseIndex + 1) * lense.focalLength;
      console.log({ lense, lenseFocusPower });
      result02 += lenseFocusPower;
    });
  });

  console.log({ result01, result02 });
};

main();
