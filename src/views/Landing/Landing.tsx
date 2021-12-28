import React, { useEffect, useState } from "react";
import { AppBar, Button, Link, SvgIcon, Toolbar, Typography } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import FAQ from "./FAQ";
import Auction from "./Auction";
import { Modal, ModalProvider } from "./Modal";
import Showcase from "./Showcase";
import { dark as theme } from "./theme";
import { useAddress, useWeb3Context } from "../../../src/hooks/web3Context";
import { useAuctionContext } from "../../hooks/auctionContext";
import { shorten } from "../../helpers";
import logo from "../../assets/logo.svg";

import "../../style.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const useStyles = makeStyles(theme => ({
  appBar: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
    padding: "10px 0",
    borderBottom: "black 1px solid",
  },
}));

const Landing: React.FC = () => {
  const classes = useStyles();
  const { connect, disconnect, hasCachedProvider } = useWeb3Context();
  const { lastAuctionId, paused } = useAuctionContext();

  const { id } = useParams() as { id: string | undefined };
  const initialAuctionId = !isNaN(Number(id)) ? Number(id) : undefined;

  const address = useAddress();

  const [auctionId, setAuctionId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (lastAuctionId === undefined) return;

    if (initialAuctionId !== undefined) {
      if (initialAuctionId > lastAuctionId || initialAuctionId < 0) {
        setAuctionId(lastAuctionId);
      } else {
        setAuctionId(initialAuctionId);
      }
    } else {
      setAuctionId(lastAuctionId);
    }
  }, [initialAuctionId, lastAuctionId]);

  useEffect(() => {
    if (hasCachedProvider()) {
      connect();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ModalProvider>
        <CssBaseline />
        <Wrapper>
          <Modal />
          <AppBar position="static" className={classes.appBar} elevation={0}>
            <Toolbar style={{ width: "100%", justifyContent: "space-between" }}>
              <div className="d-flex align-items-center">
                <Logo src={logo} alt="SnoopDaoLogo" style={{ width: "30px", height: "30px" }} />
                <span className="ms-3" style={{ fontSize: "20px", fontWeight: "bold" }}>
                  SnoopDAO
                </span>
              </div>
              <div className="d-flex align-items-center">
                <Link variant="h5" href="/stake" style={{ padding: "0 14px" }}>
                  Stake
                </Link>
                {/*<Link variant="h5" href="https://squid-dao.gitbook.io/squiddao/" style={{ padding: "0 14px" }}>*/}
                {/*  Docs*/}
                {/*</Link>*/}
                {address ? (
                  <Button variant="outlined" color="primary">
                    {shorten(address)}
                  </Button>
                ) : (
                  <Button variant="outlined" color="primary" onClick={() => connect()}>
                    {"Connect Wallet"}
                  </Button>
                )}
              </div>
            </Toolbar>
          </AppBar>
          <Container fluid="lg" className="px-5 mt-5" style={{ position: "relative" }}>
            {auctionId !== undefined && !paused && <Auction auctionId={auctionId} />}
            <Showcase />
            <FAQ />
          </Container>
        </Wrapper>
      </ModalProvider>
    </ThemeProvider>
  );
};

const Wrapper = styled.div`
  background-color: white;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  font-family: system, -apple-system, San Francisco, Segoe UI, Segoe, Segoe WP, Helvetica Neue, helvetica, Lucida Grande,
    arial, sans-serif !important;
`;

const Logo = styled.img`
  width: 110px;

  @media (min-width: 768px) {
    width: auto;
  }
`;

export default Landing;
