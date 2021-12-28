import { Typography } from "@material-ui/core";
import React from "react";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import background1 from "../../assets/background1.svg";
import logo from "../../assets/logo.svg";

const Showcase: React.FC = () => {
  return (
    <>
      <Row className="g-4 mt-4 align-items-center">
        <Col xs={12} md={6} className="d-flex flex-column position-relative" style={{ zIndex: 1 }}>
          <StyleTypography variant="h1" style={{ fontWeight: "bold" }}>
            Dog money is the people's money
          </StyleTypography>
        </Col>
        <StyledCol xs={12} md={6} className="d-flex justify-content-center align-items-center">
          <img src={background1} className="position-absolute" />
          <ImgWrapper className="position-relative">
            <Img src={logo} />
          </ImgWrapper>
        </StyledCol>
      </Row>
    </>
  );
};

const ImgWrapper = styled.div`
  display: flex;
  width: 320px;
  height: 320px;
  border-radius: 160px;
  background: white;
  justify-content: center;
  align-items: center;

  @media (min-width: 992px) {
    width: 400px;
    height: 400px;
    border-radius: 200px;
  }
`;

const Img = styled.img`
  width: 220px;
  height: 220px;

  @media (min-width: 992px) {
    width: 264px;
    height: 264px;
  }
`;

const StyledCol = styled(Col)`
  height: 600px;
`;

const StyleTypography = styled(Typography)`
  font-weight: bold;
  font-size: 1.5rem !important;

  @media (min-width: 768px) {
    font-size: 4.5rem !important;
  }
`;

const StyleTypography2 = styled(Typography)`
  font-weight: bold;
  font-size: 1rem !important;

  @media (min-width: 768px) {
    font-size: 1.5rem !important;
  }
`;

export default Showcase;
