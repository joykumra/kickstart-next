import { Table, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { useRouter } from "next/router";

const RequestRow = (props) => {
  const { Row, Cell } = Table;
  const { description, value, recipient, complete, approvalCount } =
    props.request;

  const readyToFinalize = approvalCount >= props.approversCount / 2;

  const router = useRouter();

  const approveHandler = async () => {
    const campaign = Campaign(props.address);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.approveRequest(props.id).send({
      from: accounts[0],
    });

    router.replace(`/campaigns/${props.address}/requests`);
  };

  const finalizeHandler = async () => {
    const campaign = Campaign(props.address);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.finalizeRequest(props.id).send({
      from: accounts[0],
    });

    router.replace(`/campaigns/${props.address}/requests`);
  };

  return (
    <Row disabled={complete} positive={readyToFinalize && !complete}>
      <Cell>{props.id}</Cell>
      <Cell>{description}</Cell>
      <Cell>{web3.utils.fromWei(value, "ether")}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>{`${approvalCount}/${props.approversCount}`}</Cell>
      <Cell>
        {!complete ? (
          <Button color="green" basic onClick={approveHandler}>
            Approve
          </Button>
        ) : (
          "REQUEST APROVED"
        )}
      </Cell>
      <Cell>
        {complete ? null : (
          <Button color="teal" basic onClick={finalizeHandler}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
