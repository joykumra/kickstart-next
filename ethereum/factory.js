import web3 from "./web3";

// ABI FROM ETHERSCAN
const abi = [
  {
    inputs: [{ internalType: "uint256", name: "minValue", type: "uint256" }],
    name: "createContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "deployedCampaigns",
    outputs: [{ internalType: "contract Campaign", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDeployedContracts",
    outputs: [
      { internalType: "contract Campaign[]", name: "", type: "address[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const address = "0x89f8DE887C06b29e5A9e9B2B5FC566aa52bcFd1c";

// Local copy of Contract
const factory = new web3.eth.Contract(abi, address);

export default factory;

// 0xfba5Cc8C5d1149CcC080B9b81340c2f329caD5c5
