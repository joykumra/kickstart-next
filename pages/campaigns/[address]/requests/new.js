import "semantic-ui-css/semantic.min.css";
import { Fragment } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

const NewRequest = () => {
  const [errMsg, setErrMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");

  const router = useRouter();
  const address = router.query.address;

  const descriptionChangeHandler = (event) => {
    setDescription(event.target.value);
  };
  const recipientChangeHandler = (event) => {
    setRecipient(event.target.value);
  };
  const valueChangeHandler = (event) => {
    setValue(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    setErrMsg(null);

    setIsLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(address);
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });

      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrMsg(err.message);
    }
    setIsLoading(false);
  };
  return (
    <Fragment>
      <Link href={`/campaigns/${address}/requests`}>Back</Link>
      <h3>Create a New Request</h3>
      <Form onSubmit={submitHandler} error={!!errMsg}>
        <Form.Field>
          <label>Description</label>
          <Input
            type="text"
            value={description}
            onChange={descriptionChangeHandler}
          ></Input>
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            type="text"
            label="ether"
            labelPosition="right"
            value={value}
            onChange={valueChangeHandler}
          ></Input>
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            type="text"
            value={recipient}
            onChange={recipientChangeHandler}
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

export default NewRequest;
