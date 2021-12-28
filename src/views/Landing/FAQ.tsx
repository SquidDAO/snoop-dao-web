import { Collapse, Link, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const P = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const QAs = [
  {
    q: "What is the SNOOP DAO?",
    a: (
      <>
        <P>
          SNOOP DAO is fo’ shizzle a decentralized world UBI protocol with the SNOOP token at its core. SNOOP protocol
          was inspired by it’s Big Homie: Squid DAO.
        </P>
        <P>Each SNOOP is backed by a DOG, giving the token that O.G. value.</P>
      </>
    ),
  },
  {
    q: "What do I get if I win an auction?",
    a: (
      <P>
        You get a cute piece of art and the first 47 NFT auction winners will be airdropped 10 million SNOOP tokens.
      </P>
    ),
  },
  {
    q: "How long is the auction?",
    a: (
      <P>
        The first 24 NFTs will have a 1 hour duration. Then it will change to 12 NFTs auctioned with 2 hour durations.
        Then 6 with 4 hour durations, 3 with 8 hour durations, and finally 2 with 12 hour durations. Any bidding in the
        last 5 minutes will extend the auction for another 5 minutes.
      </P>
    ),
  },
  {
    q: "What is a SNOOP joint?",
    a: (
      <P>
        The SNOOP joint (bond) is the mechanism we use to raise select assets, such as DOG or SNOOP-DOG LPs, for the
        treasury. Users that want to purchase SNOOP, should first check if they can get a discount by buying a joint.
        When users purchase joints the SNOOP they are owed are vested linearly over 5 days. In most cases it's better to
        purchase a joint than to buy SNOOP from the market, but there can be times when the market is trading at a price
        lower than the joints.
      </P>
    ),
  },
  {
    q: "What is SNOOP Chill’n?",
    a: (
      <>
        <P>
          Staking allows you to earn SNOOP passively via auto-compounding. By staking your SNOOP with SnoopDAO, you
          receive sSNOOP (staked SNOOP) in return at a 1:1 ratio. After that, your sSNOOP balance will increase
          automatically on every epoch based on the current APY.
        </P>
        <P>
          In other words, the best way to get down with SNOOP is to chill (Stake) with it. Chill’n SNOOP (sSNOOP)
          continues to accrue you more SNOOP, and auto-compounds your SNOOP balance. The extra SNOOP come from supply
          growth. When the protocol mints new SNOOP tokens, the majority are distributed to the chill’n SNOOP.
        </P>
      </>
    ),
  },
];

const FAQ: React.FC = () => {
  return (
    <Wrapper>
      <FaqTitle className="mb-3">FAQ</FaqTitle>
      <FaqList>
        {QAs.map((qa, idx) => (
          <QA q={qa.q} a={qa.a} key={idx} />
        ))}
      </FaqList>
    </Wrapper>
  );
};

const FaqTitle = styled(Typography)`
  font-size: 1.25rem !important;

  @media (min-width: 768px) {
    font-size: 2rem !important;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
`;

const FaqList = styled(List)`
  @media (min-width: 768px) {
    width: 600px;
  }
`;

const QA: React.FC<{ q: string; a: React.ReactNode }> = ({ q, a }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <ListItem button onClick={() => setExpanded(!expanded)}>
        <Q disableTypography primary={q} />
        <ListItemIcon style={{ minWidth: "unset", marginLeft: "12px" }}>
          {expanded ? <RemoveIcon /> : <AddIcon />}
        </ListItemIcon>
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem>
          <A>{a}</A>
        </ListItem>
      </Collapse>
    </>
  );
};

const FaqItem = styled(ListItem)`
  display: flex;
`;

const Q = styled(ListItemText)`
  font-size: 1rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const A = styled(ListItemText)`
  font-size: 0.875rem;
  color: #c1c3cb;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

export default FAQ;
