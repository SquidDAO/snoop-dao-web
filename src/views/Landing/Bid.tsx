import { Typography } from "@material-ui/core";
import BN from "bignumber.js";
import { BigNumber, Contract, ethers, utils } from "ethers";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button, FormControl, InputGroup, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { abi as auctionAbi } from "../../abi/SquidAuction.json";
import { abi as erc20Abi } from "../../abi/IERC20.json";
import { addresses } from "../../constants";
import { commify } from "../../helpers";
import { useAddress, useWeb3Context } from "../../hooks";
import { AuctionData } from "../../hooks/auctionContext";
import { useModalContext } from "./Modal";

const useMinBidIncrementPercentage = () => {
  const [minBidIncPct, setMinBidIncPct] = useState(new BN(0));

  const { provider, chainID } = useWeb3Context();
  useEffect(() => {
    const auctionContract = new Contract(addresses[chainID].AUCTION_ADDRESS, auctionAbi, provider);
    auctionContract.callStatic.minBidIncrementPercentage().then(pct => {
      setMinBidIncPct(new BN(pct.toString()));
    });
  }, [chainID, provider]);

  return minBidIncPct;
};

const useAuctionContract = () => {
  const { provider, chainID } = useWeb3Context();
  return new ethers.Contract(addresses[chainID].AUCTION_ADDRESS, auctionAbi, provider.getSigner());
};

const useDogContract = () => {
  const { provider, chainID } = useWeb3Context();
  return new ethers.Contract(addresses[chainID].DOG_ADDRESS, erc20Abi, provider.getSigner());
};

interface BidProps {
  auction: AuctionData;
}

const minBidEth = (currentBid: BN, minBidIncPct: BN): string => {
  if (currentBid.isZero()) {
    return "10000";
  }

  const minBidInWei = currentBid.times(minBidIncPct.div(100).plus(1));
  const eth = Number(utils.formatEther(BigNumber.from(minBidInWei.toFixed(0))));
  const roundedEth = Math.ceil(eth * 100) / 100;

  return roundedEth.toString();
};

const Bid: React.FC<BidProps> = ({ auction }) => {
  const isAuctionEnd = auction.endTime.getTime() < new Date().getTime();
  const auctionContract = useAuctionContract();
  const dogContract = useDogContract();

  const { connected } = useWeb3Context();
  const { onPresent } = useModalContext();
  const address = useAddress();

  const [allowance, setAllowance] = useState(BigNumber.from(0));

  const [buttonState, setButtonState] = useState({
    loading: false,
    content: isAuctionEnd ? "Settle Auction" : "Bid",
  });

  const [bidAmount, setBidAmount] = useState("");

  const minBidIncPct = useMinBidIncrementPercentage();
  const minBid = minBidEth(new BN(auction.amount.toString()), minBidIncPct);

  const [placeBidState, setPlaceBidState] = useState({
    status: "None",
    errorMessage: "",
  });

  const [settleState, setSettleState] = useState({
    status: "None",
    errorMessage: "",
  });

  const buttonReady = useMemo(() => {
    if (!connected) {
      return false;
    } else if (!isAuctionEnd && bidAmount !== "") {
      return Number(bidAmount) >= Number(minBid);
    } else {
      return true;
    }
  }, [bidAmount, isAuctionEnd, minBid, connected]);

  useEffect(() => {
    dogContract.allowance(address, auctionContract.address).then((a: BigNumber) => {
      if (!a.eq(allowance)) {
        setAllowance(a);
      }
    });
  }, [address, allowance, auctionContract.address, dogContract]);

  const approveHandler = useCallback(async () => {
    const response = await dogContract.approve(auctionContract.address, ethers.constants.MaxUint256);
    setButtonState({ loading: true, content: "" });
    await response.wait();
    setButtonState({ loading: false, content: "Approve" });

    const allowance = await dogContract.allowance(address, auctionContract.address);
    setAllowance(allowance);
  }, [address, auctionContract.address, dogContract]);

  const bidAmountHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // disable more than 2 digits after decimal point
    if (input.includes(".") && event.target.value.split(".")[1].length > 2) {
      return;
    }

    setBidAmount(event.target.value);
  };

  const placeBidHandler = useCallback(async () => {
    if (!bidAmount) return;

    const value = utils.parseEther(bidAmount);
    try {
      const gasLimit = await auctionContract.estimateGas.createBid(auction.auctionId, value);
      const response = await auctionContract.createBid(auction.auctionId, value, {
        gasLimit: gasLimit.add(10_000), // A 10,000 gas pad is used to avoid 'Out of gas' errors
      });
      setPlaceBidState({ status: "Mining", errorMessage: "" });
      setButtonState({ loading: true, content: "" });
      await response.wait();
      setPlaceBidState({ status: "Success", errorMessage: "" });
      onPresent("Success", "Bid was placed.");
      setButtonState({ loading: false, content: "Bid" });
      setBidAmount("");
    } catch (e) {
      setPlaceBidState({ status: "Fail", errorMessage: "" });
      onPresent("Transaction Failed", placeBidState.errorMessage ? placeBidState.errorMessage : "Please try again.");
      setButtonState({ loading: false, content: "Bid" });
    }
    setButtonState({ loading: false, content: "Bid" });
  }, [auction.auctionId, auctionContract, bidAmount, onPresent, placeBidState.errorMessage]);

  const settleAuctionHandler = async () => {
    try {
      const response = await auctionContract.settleCurrentAndCreateNewAuction();
      setSettleState({ status: "Mining", errorMessage: "" });
      setButtonState({ loading: true, content: "" });
      await response.wait();
      setSettleState({ status: "Success", errorMessage: "" });
      onPresent("Success", `Settled auction successfully!`);
      setButtonState({ loading: false, content: "Settle Auction" });
    } catch (e) {
      setSettleState({ status: "Fail", errorMessage: "" });
      onPresent("Transaction Failed", settleState.errorMessage ? settleState.errorMessage : "Please try again.");
      setButtonState({ loading: false, content: "Settle Auction" });
    }
    setButtonState({ loading: false, content: "Settle Auction" });
  };

  const enoughAllowance = !allowance.eq(0) && allowance.gte(utils.parseUnits(bidAmount || "0"));

  return (
    <>
      {!isAuctionEnd && (
        <Typography variant="h6" component="div">
          <br />
          NFT Winner will receive 0 $SNOOP
          <br />
          Each NFT will grant you 1 SNOOP DAO vote
          <br />
          <br />
          Minimum bid: {commify(minBid)} DOG
        </Typography>
      )}
      <InputGroup>
        {!isAuctionEnd && !allowance.eq(0) && (
          <>
            <BidInput type="number" min="0" onChange={bidAmountHandler} value={bidAmount} />
            <Placeholder>DOG</Placeholder>
          </>
        )}
        {isAuctionEnd ? (
          <AuctionEndedButton onClick={settleAuctionHandler} disabled={!buttonReady}>
            {buttonState.loading ? <Spinner animation="border" /> : "Settle Auction"}
          </AuctionEndedButton>
        ) : enoughAllowance ? (
          <BidButton onClick={placeBidHandler} disabled={!buttonReady}>
            {buttonState.loading ? <Spinner animation="border" /> : "Bid"}
          </BidButton>
        ) : (
          <BidButton onClick={approveHandler} disabled={!buttonReady}>
            {buttonState.loading ? <Spinner animation="border" /> : "Approve"}
          </BidButton>
        )}
      </InputGroup>
    </>
  );
};

const BidInput = styled(FormControl)`
  width: 60%;
  height: 3rem;
  color: black;
  border: 1px solid #aaa !important;
  border-radius: 0.25rem !important;
  background-color: white;
  font-weight: bold;
  outline: none !important;
  box-shadow: none !important;

  &:hover,
  &:focus,
  &:active,
  &:disabled {
    border: 1px solid #aaa !important;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Placeholder = styled.span`
  position: absolute;
  top: 30%;
  left: 50%;
  font-weight: bold;
  color: #aaa;
  z-index: 3;
  font-size: 1rem;
`;

const AuctionEndedButton = styled(Button)`
  width: 100%;
  height: 3rem;
  color: white;
  border: transparent;
  background-color: black;
  font-weight: bold;

  &:hover,
  &:active,
  &:focus,
  &:disabled {
    background-color: #2d2d2d !important;
    color: rgb(209, 207, 207);
    outline: none !important;
    box-shadow: none;
  }
`;

const BidButton = styled(Button)`
  //margin-left: 1rem;
  width: 40%;
  height: 3rem;
  color: white;
  border: transparent;
  background-color: black;
  font-weight: bold;

  &:hover,
  &:active,
  &:focus,
  &:disabled {
    background-color: #2d2d2d !important;
    outline: none !important;
    box-shadow: none !important;
  }
`;

export default Bid;
