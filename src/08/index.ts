import { parse } from "path";
import { importFile } from "../common/fileImporter";

const startNodeId = "AAA";
const endNodeId = "ZZZ";

type Instruction = "L" | "R";
interface MapNode {
  id: string;
  L: string;
  R: string;
}

const getModel = () => {
  const inputData = importFile("./src/08/input.txt");
  if (inputData === undefined) return;

  const lines = inputData.split("\n");
  const instructions: Instruction[] = [...lines[0]] as Instruction[];

  const rawMapNodes = {};
  lines.slice(2).forEach((line) => {
    const splitedNodeLine = line.split(" = ");
    const id = splitedNodeLine[0];
    const [L, R] = splitedNodeLine[1]
      .replaceAll("(", "")
      .replaceAll(")", "")
      .replaceAll(" ", "")
      .split(",");
    rawMapNodes[id] = { id, L, R };
  });

  console.log({ instructions, rawMapNodes });
  return { instructions, rawMapNodes };
};

const main = () => {
  const model = getModel();

  let currentNode = model.rawMapNodes[startNodeId];
  let currentStep = 0;

  while (currentNode.id !== endNodeId) {
    const instruction =
      model.instructions[currentStep % model.instructions.length];

    const nextNode = model.rawMapNodes[currentNode[instruction]];

    console.log({ currentNode, currentStep, instruction, nextNode });

    currentNode = nextNode;
    currentStep++;
  }

  console.log("Result 1: ", { currentNode, currentStep });

  let currentNodes = Object.keys(model.rawMapNodes)
    .map((key) => model.rawMapNodes[key])
    .filter((node) => node.id[node.id.length - 1] === "A");

  currentNodes.forEach((node, index) => {
    let currentNode = node;
    let currentStep = 0;

    while (currentNode.id[node.id.length - 1] !== "Z") {
      const instruction =
        model.instructions[currentStep % model.instructions.length];

      const nextNode = model.rawMapNodes[currentNode[instruction]];

      currentNode = nextNode;
      currentStep++;
    }

    console.log(`LCM - ${index} Value for Result 2`, {
      currentNode,
      currentStep,
    });
  });

  // Result use LCM Tool or program
  //https://www.calculatorsoup.com/calculators/math/lcm.php
  // LCM - 0 Value for Result 2 { currentNode: { id: 'RGZ', L: 'RFP', R: 'RVX' }, currentStep: 20093 }
  // LCM - 1 Value for Result 2 { currentNode: { id: 'VQZ', L: 'RDR', R: 'VRQ' }, currentStep: 12169 }
  // LCM - 2 Value for Result 2 { currentNode: { id: 'BLZ', L: 'LPN', R: 'XVJ' }, currentStep: 13301 }
  // LCM - 3 Value for Result 2 { currentNode: { id: 'XSZ', L: 'XVM', R: 'QRD' }, currentStep: 20659 }
  // LCM - 4 Value for Result 2 { currentNode: { id: 'ZZZ', L: 'MTL', R: 'KNJ' }, currentStep: 16697 }
  // LCM - 5 Value for Result 2 { currentNode: { id: 'KKZ', L: 'GDB', R: 'LRB' }, currentStep: 17263 }
  //Result: 10668805667831

  // Result 2
  // BruteForce:

  currentStep = 0;
  let zCountHistory = [0, 0, 0, 0, 0, 0, 0, 0];
  let zCount = 0;

  while (zCount !== currentNodes.length) {
    const instruction =
      model.instructions[currentStep % model.instructions.length];

    const nextNodes = currentNodes.map((node) => {
      return model.rawMapNodes[node[instruction]];
    });

    zCountHistory[zCount] = zCountHistory[zCount] + 1;

    if (zCount > 2) {
      console.log({ currentStep, zCount, currentNodes, zCountHistory });
    }

    currentNodes = nextNodes;
    zCount = currentNodes.filter(
      (node) => node.id[node.id.length - 1] === "Z"
    ).length;
    currentStep++;
  }

  console.log("Result 2: ", { currentNodes, currentStep });
};

main();
