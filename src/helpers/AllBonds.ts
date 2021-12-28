import { StableBond, LPBond, NetworkID, CustomBond } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as OhmDaiImg } from "src/assets/tokens/OHM-DAI.svg";
import { ReactComponent as FraxImg } from "src/assets/tokens/FRAX.svg";
import { ReactComponent as OhmFraxImg } from "src/assets/tokens/OHM-FRAX.svg";
import { ReactComponent as OhmLusdImg } from "src/assets/tokens/OHM-LUSD.svg";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as LusdImg } from "src/assets/tokens/LUSD.svg";
import { ReactComponent as SquidUsdtImg } from "src/assets/tokens/squid-usdt.svg";
import { ReactComponent as DogImg } from "src/assets/tokens/dog.svg";

import { abi as FraxOhmBondContract } from "src/abi/bonds/OhmFraxContract.json";
import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as BondOhmLusdContract } from "src/abi/bonds/OhmLusdContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as WethBondContract } from "src/abi/bonds/WethContract.json";
import { abi as ReserveOhmLusdContract } from "src/abi/reserves/OhmLusd.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as ReserveOhmFraxContract } from "src/abi/reserves/OhmFrax.json";
import { abi as FraxBondContract } from "src/abi/bonds/FraxContract.json";
import { abi as LusdBondContract } from "src/abi/bonds/LusdContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
  },
});

export const weth = new StableBond({
  name: "weth",
  displayName: "WETH",
  bondToken: "WETH",
  bondIconSvg: wETHImg,
  bondContractABI: WethBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x8f9b609eA2179262A7A672553D6F78ec83215EE9",
      reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
  },
});

export const frax = new StableBond({
  name: "frax",
  displayName: "FRAX",
  bondToken: "FRAX",
  bondIconSvg: FraxImg,
  bondContractABI: FraxBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x8510c8c2B6891E04864fa196693D44E6B6ec2514",
      reserveAddress: "0x853d955acef822db058eb8505911ed77f175b99e",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xF651283543fB9D61A91f318b78385d187D300738",
      reserveAddress: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
    },
  },
});

export const lusd = new StableBond({
  name: "lusd",
  displayName: "LUSD",
  bondToken: "LUSD",
  bondIconSvg: LusdImg,
  bondContractABI: LusdBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x10C0f93f64e3C8D0a1b0f4B87d6155fd9e89D08D",
      reserveAddress: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x3aD02C4E4D1234590E87A1f9a73B8E0fd8CF8CCa",
      reserveAddress: "0x45754dF05AA6305114004358eCf8D04FF3B84e26",
    },
  },
});

export const eth = new CustomBond({
  name: "eth",
  displayName: "wETH",
  bondToken: "wETH",
  bondIconSvg: wETHImg,
  bondContractABI: EthBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xE6295201CD1ff13CeD5f063a5421c39A1D236F1c",
      reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
      reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const ethBondContract = this.getContractForBond(networkID, provider);
    let ethPrice = await ethBondContract.assetPrice();
    ethPrice = ethPrice / Math.pow(10, 8);
    const token = this.getContractForReserve(networkID, provider);
    let ethAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    ethAmount = ethAmount / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
});

export const dog = new StableBond({
  name: "dog",
  displayName: "DOG",
  bondToken: "DOG",
  bondIconSvg: DogImg,
  bondContractABI: BondOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x7dd8c6F62667ED01C176130622416a141cd4732A",
      reserveAddress: "0xBAac2B4491727D78D2b78815144570b9f2Fe8899",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
});

export const snoop_dog = new LPBond({
  name: "snoop_dog_lp",
  displayName: "SNOOP-DOG LP",
  bondToken: "DOG",
  bondIconSvg: SquidUsdtImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xcd544D3A9E1fDcc46B4B3831dddaEeF8d334b208",
      reserveAddress: "0x3a61dd70A05F6CfFDe20e22593932123DA180052",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x8715cA97c5B464C1957ceFBD18015b5567e52060/0xBAac2B4491727D78D2b78815144570b9f2Fe8899",
});

export const squid_weth = new LPBond({
  name: "squid_eth_lp",
  displayName: "SQUID-ETH LP",
  bondToken: "ETH",
  bondIconSvg: SquidUsdtImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x5ab2493d75cbccd0762417839c83ab6b567d2f71",
      reserveAddress: "0xfad704847967d9067df7a60910399155fca43fe8",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0xBfeB1d574ffA150715e5B24aDa194109472F74f0",
      reserveAddress: "0x481b3bc88d1628cb3132295dcfbf33711ab7d08f",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x21ad647b8F4Fe333212e735bfC1F36B4941E6Ad2/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
});

export const ohm_lusd = new LPBond({
  name: "ohm_lusd_lp",
  displayName: "OHM-LUSD LP",
  bondToken: "LUSD",
  bondIconSvg: OhmLusdImg,
  bondContractABI: BondOhmLusdContract,
  reserveContract: ReserveOhmLusdContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xFB1776299E7804DD8016303Df9c07a65c80F67b6",
      reserveAddress: "0xfDf12D1F85b5082877A6E070524f50F6c84FAa6b",
    },
    [NetworkID.Testnet]: {
      // NOTE (appleseed-lusd): using ohm-dai rinkeby contracts
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x383518188C0C6d7730D91b2c03a03C837814a899/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
//export const allBonds = [dai, frax, eth, ohm_dai, ohm_frax, lusd, ohm_lusd];
export const allBonds = [snoop_dog, dog];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
