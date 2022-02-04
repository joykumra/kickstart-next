import React, { Fragment, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";

const NewCampaign = () => {
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

      await factory.methods.createContract(contribution).send({
        from: accounts[1],
      });
      // REDIRECT
      router.push("/");
    } catch (err) {
      setErrMsg(err.message);
    }

    setIsLoading(false);
  };

  return (
    <Fragment>
      <h3>Create a campaign</h3>
      <Form onSubmit={submitHandler} error={!!errMsg}>
        <Form.Field>
          <label>Minimum contribution </label>
          <Input
            type="number"
            label="wei"
            labelPosition="right"
            onChange={inputChangeHandler}
            value={contribution}
          ></Input>
        </Form.Field>
        {errMsg && <Message error header="Oops!!" content={errMsg}></Message>}
        <Button type="submit" primary loading={isLoading}>
          Create
        </Button>
      </Form>
    </Fragment>
  );
};

export default NewCampaign;
