import { useState, useEffect } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as ChevronDown } from "../../assets/icons/chevron-down.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";

import "./ohmmenu.scss";
import { dai, frax, weth } from "src/helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import SnoopImg from "src/assets/tokens/token_SNOOP.png";
import SSnoopImg from "src/assets/tokens/token_sSNOOP.png";

const addTokenToWallet = (tokenSymbol, tokenAddress) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    // NOTE (appleseed): 33T token defaults to sOHM logo since we don't have a 33T logo yet
    let tokenPath;
    // if (tokenSymbol === "OHM") {

    // } ? OhmImg : SOhmImg;
    switch (tokenSymbol) {
      case "SNOOP":
        tokenPath = SnoopImg;
        break;
      default:
        tokenPath = SSnoopImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: imageURL,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function OhmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { chainID } = useWeb3Context();

  const networkID = chainID;

  const SOHM_ADDRESS = addresses[networkID].SOHM_ADDRESS;
  const OHM_ADDRESS = addresses[networkID].OHM_ADDRESS;
  const DOG_ADDRESS = addresses[networkID].DOG_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[networkID].PT_TOKEN_ADDRESS;

  const handleClick = target => {
    setAnchorEl(target);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  const daiAddress = dai.getAddressForReserve(networkID);
  const fraxAddress = frax.getAddressForReserve(networkID);
  const wethAddress = weth.getAddressForReserve(networkID);
  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e.currentTarget)}
      onMouseLeave={e => handleClick(null)}
      onClick={e => handleClick(anchorEl ? null : e.currentTarget)}
      id="ohm-menu-button-hover"
    >
      <Button
        id="ohm-menu-button"
        size="large"
        variant="contained"
        color="secondary"
        title="SNOOP"
        aria-describedby={id}
      >
        <Typography>SNOOP</Typography>
        <SvgIcon component={ChevronDown} color="primary" style={{ fill: "none" }} />
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://app.sushi.com/swap?inputCurrency=${DOG_ADDRESS}&outputCurrency=${OHM_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Buy on Sushiswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>

                  {/*<Link*/}
                  {/*  href={`https://app.uniswap.org/#/swap?inputCurrency=${fraxAddress}&outputCurrency=${OHM_ADDRESS}`}*/}
                  {/*  target="_blank"*/}
                  {/*  rel="noreferrer"*/}
                  {/*>*/}
                  {/*  <Button size="large" variant="contained" color="secondary" fullWidth>*/}
                  {/*    <Typography align="left">*/}
                  {/*      Buy on Uniswap <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />*/}
                  {/*    </Typography>*/}
                  {/*  </Button>*/}
                  {/*</Link>*/}

                  {/*<Link href={`https://abracadabra.money/pool/10`} target="_blank" rel="noreferrer">*/}
                  {/*  <Button size="large" variant="contained" color="secondary" fullWidth>*/}
                  {/*    <Typography align="left">*/}
                  {/*      Wrap sOHM on Abracadabra <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />*/}
                  {/*    </Typography>*/}
                  {/*  </Button>*/}
                  {/*</Link>*/}
                </Box>

                {/*<Box component="div" className="data-links">*/}
                {/*  <Divider color="secondary" className="less-margin" />*/}
                {/*  <Link href={`https://dune.xyz/shadow/Olympus-(OHM)`} target="_blank" rel="noreferrer">*/}
                {/*    <Button size="large" variant="contained" color="secondary" fullWidth>*/}
                {/*      <Typography align="left">*/}
                {/*        Shadow's Dune Dashboard <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />*/}
                {/*      </Typography>*/}
                {/*    </Button>*/}
                {/*  </Link>*/}
                {/*</Box>*/}

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>ADD TOKEN TO WALLET</p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ maxHeight: "unset" }}
                        onClick={addTokenToWallet("SNOOP", OHM_ADDRESS)}
                      >
                        <img src={SnoopImg} style={{ height: "35px", width: "35px" }} />
                        <Typography variant="body1">SNOOP</Typography>
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ maxHeight: "unset" }}
                        onClick={addTokenToWallet("sSNOOP", SOHM_ADDRESS)}
                      >
                        <img src={SSnoopImg} style={{ height: "35px", width: "35px" }} />
                        <Typography variant="body1">sSNOOP</Typography>
                      </Button>
                      {/*<Button variant="contained" color="secondary" onClick={addTokenToWallet("33T", PT_TOKEN_ADDRESS)}>*/}
                      {/*  <SvgIcon*/}
                      {/*    component={t33TokenImg}*/}
                      {/*    viewBox="0 0 1000 1000"*/}
                      {/*    style={{ height: "25px", width: "25px" }}*/}
                      {/*  />*/}
                      {/*  <Typography variant="body1">33T</Typography>*/}
                      {/*</Button>*/}
                    </Box>
                  </Box>
                ) : null}

                {/*<Divider color="secondary" />*/}
                {/*<Link*/}
                {/*  href="https://docs.olympusdao.finance/using-the-website/unstaking_lp"*/}
                {/*  target="_blank"*/}
                {/*  rel="noreferrer"*/}
                {/*>*/}
                {/*  <Button size="large" variant="contained" color="secondary" fullWidth>*/}
                {/*    <Typography align="left">Unstake Legacy LP Token</Typography>*/}
                {/*  </Button>*/}
                {/*</Link>*/}
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default OhmMenu;
