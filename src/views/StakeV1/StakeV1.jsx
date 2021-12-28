import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { formatDog, getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeApprovalV1, changeStake, changeStakeV1 } from "../../slices/StakeThunk";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function StakeV1() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.oldSohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.oldOhmUnstake;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    setQuantity(sohmBalance);
  };

  const onSeekApproval = async token => {
    await dispatch(changeApprovalV1({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error("You cannot stake more than your SNOOP balance."));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
      return dispatch(error("You cannot unstake more than your sSNOOP balance."));
    }

    await dispatch(changeStakeV1({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = unstakeAllowance == null;

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    // [sohmBalance, fsohmBalance, wsohmBalance]
    [sohmBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  // TODO: This could be a bug if the number is very large.
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 6);

  return (
    <div id="stake-view">
      <div style={{ textAlign: "left", maxWidth: 833, width: "100%" }}>
        <Typography variant="h5">Stake (deprecated)</Typography>
        {/*<RebaseTimer />*/}
      </div>
      {/*<div style={{ maxWidth: 833, width: "100%" }}>*/}
      {/*  <div className="stake-top-metrics">*/}
      {/*    <Grid container spacing={2} alignItems="flex-end">*/}
      {/*      <Grid item xs={12} sm={6} md={6} lg={6}>*/}
      {/*        <Paper className={`ohm-card`}>*/}
      {/*          <div className="stake-apy">*/}
      {/*            <Typography variant="subtitle1" color="textSecondary">*/}
      {/*              APY*/}
      {/*            </Typography>*/}
      {/*            <Typography variant="h4">*/}
      {/*              {stakingAPY ? (*/}
      {/*                <>{new Intl.NumberFormat("en-US").format(trimmedStakingAPY)}%</>*/}
      {/*              ) : (*/}
      {/*                <Skeleton width="150px" />*/}
      {/*              )}*/}
      {/*            </Typography>*/}
      {/*          </div>*/}
      {/*        </Paper>*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12} sm={6} md={6} lg={6}>*/}
      {/*        <Paper className={`ohm-card`}>*/}
      {/*          <div className="stake-tvl">*/}
      {/*            <Typography variant="subtitle1" color="textSecondary">*/}
      {/*              Total Value Deposited*/}
      {/*            </Typography>*/}
      {/*            <Typography variant="h4">*/}
      {/*              /!*{stakingTVL ? formatDog(stakingTVL) : <Skeleton width="150px" />}*!/*/}
      {/*              Coming Soon*/}
      {/*            </Typography>*/}
      {/*          </div>*/}
      {/*        </Paper>*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <Paper className={`ohm-card`}>
        <div className="staking-area">
          {!address ? (
            <div className="stake-wallet-notification">
              <div className="wallet-menu" id="wallet-menu">
                {modalButton}
              </div>
              <Typography variant="h6">Connect your wallet to stake SNOOP</Typography>
            </div>
          ) : (
            <>
              <Box className="stake-action-area">
                <Tabs
                  key={String(zoomed)}
                  centered
                  value={view}
                  textColor="primary"
                  indicatorColor="primary"
                  className="stake-tab-buttons"
                  onChange={changeView}
                  aria-label="stake tabs"
                >
                  <Tab label="Unstake" {...a11yProps(1)} />
                </Tabs>

                <Box className="stake-action-row " display="flex" alignItems="center">
                  {address && !isAllowanceDataLoading ? (
                    !hasAllowance("sohm") ? (
                      <Box className="help-text">
                        <Typography variant="body1" className="stake-note" color="textSecondary">
                          First time unstaking <b>sSNOOP</b>?
                          <br />
                          Please approve Snoop Dao to use your <b>sSNOOP</b> for unstaking.
                        </Typography>
                      </Box>
                    ) : (
                      <FormControl className="ohm-input" variant="outlined" color="primary">
                        <InputLabel htmlFor="amount-input"></InputLabel>
                        <OutlinedInput
                          id="amount-input"
                          type="number"
                          placeholder="Enter an amount"
                          className="stake-input"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <Button variant="text" onClick={setMax} color="inherit">
                                Max
                              </Button>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    )
                  ) : (
                    <Skeleton width="150px" />
                  )}

                  <TabPanel value={view} index={0} className="stake-tab-panel">
                    {isAllowanceDataLoading ? (
                      <Skeleton />
                    ) : address && hasAllowance("sohm") ? (
                      <Button
                        className="stake-button"
                        variant="contained"
                        color="primary"
                        disabled={isPendingTxn(pendingTransactions, "unstaking")}
                        onClick={() => {
                          onChangeStake("unstake");
                        }}
                      >
                        {txnButtonText(pendingTransactions, "unstaking", "Unstake SNOOP")}
                      </Button>
                    ) : (
                      <Button
                        className="stake-button"
                        variant="contained"
                        color="primary"
                        disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                        onClick={() => {
                          onSeekApproval("sohm");
                        }}
                      >
                        {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                      </Button>
                    )}
                  </TabPanel>
                </Box>
              </Box>

              <div className={`stake-user-data`}>
                <div className="data-row">
                  <Typography variant="body1" style={{ color: "#C1C3CB" }}>
                    Your Balance
                  </Typography>
                  <Typography variant="body1">
                    {isAppLoading ? <Skeleton width="80px" /> : <>{trim(ohmBalance, 4)} SNOOP</>}
                  </Typography>
                </div>

                <div className="data-row">
                  <Typography variant="body1" style={{ color: "#C1C3CB" }}>
                    Your Staked Balance
                  </Typography>
                  <Typography variant="body1">
                    {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedBalance} sSNOOP</>}
                  </Typography>
                </div>

                <div className="data-row">
                  <Typography variant="body1" style={{ color: "#C1C3CB" }}>
                    Next Reward Amount
                  </Typography>
                  <Typography variant="body1">{isAppLoading ? <Skeleton width="80px" /> : <>0 sSNOOP</>}</Typography>
                </div>
              </div>
            </>
          )}
        </div>
      </Paper>
      {/*<ExternalStakePool />*/}
    </div>
  );
}

export default StakeV1;
