import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { BondDataCard, BondTableData } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatDog } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import isEmpty from "lodash/isEmpty";
import { allBondsMap } from "src/helpers/AllBonds";

function ChooseBond() {
  const { bonds } = useBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading = useSelector(state => state.app.loading);
  const isAccountLoading = useSelector(state => state.account.loading);

  const accountBonds = useSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useSelector(state => {
    if (state.bonding.loading === false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances;
    }
  });

  return (
    <div id="choose-bond-view">
      <div style={{ width: "100%", maxWidth: 833 }}>
        {!isAccountLoading && !isEmpty(accountBonds) && <ClaimBonds activeBonds={accountBonds} />}
        <Box className="card-header" style={{ marginBottom: 20 }}>
          <Typography variant="h5" align="left">
            Bond
          </Typography>
        </Box>
        <Grid container item xs={12} style={{ margin: "10px 0px 20px" }} className="bond-hero">
          <Grid item xs={6}>
            <Paper className="ohm-card">
              <Box textAlign={`${isVerySmallScreen ? "center" : "center"}`}>
                <Typography variant="subtitle1" color="textSecondary">
                  Treasury Balance
                </Typography>
                <Typography variant="h4">
                  {isAppLoading ? <Skeleton width="180px" /> : formatDog(treasuryBalance)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={6} className={`ohm-price`}>
            <Paper className="ohm-card">
              <Box textAlign={`${isVerySmallScreen ? "center" : "center"}`}>
                <Typography variant="subtitle1" color="textSecondary">
                  SNOOP Price
                </Typography>
                <Typography variant="h4">
                  {isAppLoading ? <Skeleton width="100px" /> : formatDog(marketPrice, 2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Paper className="ohm-card">
          {!isSmallScreen && (
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Bond</TableCell>
                      <TableCell align="left">Price</TableCell>
                      <TableCell align="left">ROI</TableCell>
                      <TableCell align="right">Purchased</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bonds.map(bond => (
                      <BondTableData key={bond.name} bond={bond} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}

          {isSmallScreen && (
            <Box className="ohm-card-container">
              <Grid container item spacing={2}>
                {bonds.map(bond => (
                  <Grid item xs={12} key={bond.name}>
                    <BondDataCard key={bond.name} bond={bond} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </div>
    </div>
  );
}

export default ChooseBond;
