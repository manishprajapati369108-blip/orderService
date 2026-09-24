import { customAlphabet } from "nanoid";

const generateUid = customAlphabet("0123456789", 8);
const usedIds = new Set();

function generateUniqueUid() {
  let id;
  do {
    id = generateUid();
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
}

console.log(generateUniqueUid()); // Always unique