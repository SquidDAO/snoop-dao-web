import { Backdrop, Container, SvgIcon } from "@material-ui/core";
import { ReactComponent as SquidIcon } from "../../assets/SquidDaoLogo.svg";
import "./loading.scss";

function LoadingSplash() {
  return (
    <Backdrop open={true} className="loading-splash" style={{ zIndex: 33, backdropFilter: "blur(33px)" }}>
      <Container justify="center" align="center">
        <SvgIcon
          component={SquidIcon}
          style={{ fontSize: "5.1875rem", height: "100px", width: "100px" }}
          viewBox="0 0 50 50"
          className="loading-icon pulse"
        />
      </Container>
    </Backdrop>
  );
}

export default LoadingSplash;
