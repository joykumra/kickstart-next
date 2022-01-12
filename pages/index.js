import React from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Link from "next/link";

const CampaignIndex = (props) => {
  const renderCampaigns = () => {
    const items = props.campaigns.map((address) => {
      return {
        header: address,
        description: <Link href={`/campaigns/${address}`}>View address</Link>,
        fluid: true,
      };
    });

    return <Card.Group items={items}></Card.Group>;
  };

  return (
    <div>
      <h3>Open Campaigns</h3>
      <Link href="/campaigns/new">
        <a>
          <Button
            floated="right"
            content="Create Campaign"
            icon="add"
            primary
          />
        </a>
      </Link>
      {props.campaigns && renderCampaigns()}
      {!props.campaigns && <p>Campaigns not loaded!</p>}
    </div>
  );
};

// SSR
export async function getServerSideProps() {
  const campaigns = await factory.methods.getDeployedContracts().call();

  return {
    props: {
      campaigns: campaigns,
    },
  };
}

export default CampaignIndex;
