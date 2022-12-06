import { create } from "ipfs-http-client";

const projectId = process.env.PROJECT_ID;
const projectKey = process.env.SECRET_KEY;
// create connection with ipfs
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectKey).toString("base64");
// Create connection to IPFS using infura
export const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// get a random key
export function genRandonString() {
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let charLength = chars.length;
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}
