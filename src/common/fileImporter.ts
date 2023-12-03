import * as fs from "fs";

export const importFile = (path: string) => {
  try {
    console.log("importing file: ", path);
    const data = fs.readFileSync(path, "utf8");
    return data;
  } catch (err) {
    console.error(err);
  }
};
