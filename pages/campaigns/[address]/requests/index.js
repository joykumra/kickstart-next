import "semantic-ui-css/semantic.min.css";
import { Button, Table } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";

const Requests = (props) => {
  const router = useRouter();
  const address = router.query.address;

  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={props.address}
          approversCount={props.approversCount}
        ></RequestRow>
      );
    });
  };

  return (
    <Fragment>
      <h2>Requests</h2>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button primary floated="right" style={{ marginBottom: 10 }}>
          Add Request
        </Button>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>ApprovalCount</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {props.totalReq} Requests</div>
    </Fragment>
  );
};

export async function getServerSideProps(context) {
  const address = context.query.address;
  const campaign = Campaign(address);
  const totalReq = await campaign.methods.requestsCount().call();
  const requestsData = await Promise.all(
    Array(parseInt(totalReq))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  const approversCount = await campaign.methods.approversCount().call();

  const requestsInJSON = JSON.stringify(requestsData);

  const requests = JSON.parse(requestsInJSON);

  // ARRAY(num).fill() CREATES num ELEMENTS OF UNDEFINED . ON MAPPING INDEXES OF ELEMNTS WE CALL THE REQUESTS
  // Promise.all() creates a Promise that is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected.

  return {
    props: {
      totalReq,
      requests,
      address,
      approversCount,
    },
  };
}

export default Requests;
