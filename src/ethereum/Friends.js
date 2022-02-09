import web3 from "./web3";
import Friends from "./build/Friends.json";

const instance = new web3.eth.Contract(
  Friends,
  // '0xd6d4b3ADAbd63e6b657667b5Dd8c816c9A5855D6' // kovan
  // "0x7d2B02E48d984002dcA935dA716E7c9C29c899C0", // mumbai
  "0xFE73FF19Bc9e317aFaf66B5680Da23ee351fED36" // polygon
);

export default instance;
