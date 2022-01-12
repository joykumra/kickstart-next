import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { useRouter } from "next/router";

const ContributionForm = (props) => {
  const [contribution, setContribution] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const inputChangeHandler = (event) => {
    setContribution(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setErrMsg(null);

    setIsLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();

      const campaign = Campaign(props.address);

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, "ether"),
      });
      setContribution("");
    } catch (err) {
      setErrMsg(err.message);
    }

    router.replace(`/campaigns/${props.address}`);

    setIsLoading(false);
  };

  return (
    <Form onSubmit={submitHandler} error={!!errMsg}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          type="number"
          label="ether"
          labelPosition="right"
          onChange={inputChangeHandler}
          value={contribution}
        ></Input>
      </Form.Field>
      {errMsg && <Message error header="Oops!!" content={errMsg}></Message>}
      <Button type="submit" primary loading={isLoading}>
        Contribute
      </Button>
    </Form>
  );
};

export default ContributionForm;
