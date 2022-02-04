// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    // CREATES NEW INSTANCE OF CAMPAIGN CONTRACT ON NETWORK
    function createContract(uint minValue) public {
        Campaign newCampaign =  new Campaign(minValue,msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    // RETURNS ALL CAMPAIGNS
    function getDeployedContracts() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {

    struct Request {
        string description; // WHY MADE THE REQ
        uint value; // HOW MUCH FOR REQ
        address recipient; // WHO RECIEVE THE MONEY
        bool complete; // REQ COMPLETE CHECK
        uint approvalCount; // TOTAL APPROVED VOTES FOR REQ
        mapping(address => bool) approvals; // WHO APPROVED REQ
    }

    address public manager; // WHO CREATED REQ
    uint public minimumContribution; // MINIMUM MONEY TO DONATE
    
    mapping(address => bool) public approvers; // DONATERS
    uint public approversCount; // TOTAL DONATERS

    uint reqIndex = 0; 
    mapping(uint => Request) public requests; // ALL REQUESTS 
    uint public requestsCount = 0;

    // FOR MANAGER TASKS
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // ASSIGN MIN VALUE OF MONEY TO DONATE 
    constructor(uint minValue, address creator) {
        manager = creator;
        minimumContribution = minValue;
    }

    // DONATION OF MONEY BY DONATORS
    function contribute() public payable {
        require(msg.value > minimumContribution); // MONEY SENT MUST BE GREATER THAN MIN CONTRIBUTION
        bool isExisted = approvers[msg.sender]; // INITIAL VALUE = FALSE

        // IF PERSON IS CONTRBUTING FIRST TIME
        if (!isExisted) {
            approvers[msg.sender] = true; // DEFAULT VALUE IS FALSE IF ADDRESS IS NOT DEFINED BEFORE
            approversCount++;
        } 
    }

    // REQUEST MADE BY MANAGER
    function createRequest(string memory description, uint value, address recipient) public restricted {
        require(value <= address(this).balance);
        Request storage newReq = requests[reqIndex];

        newReq.description = description;
        newReq.value = value;
        newReq.recipient = recipient;
        newReq.complete = false;

        reqIndex++;
        requestsCount++;
    }

    // APPROVE REQUEST BY DONATORS
    function approveRequest(uint index) public {
        Request storage req = requests[index];

        require(approvers[msg.sender]);
        require(!req.approvals[msg.sender]);

        req.approvals[msg.sender] = true;
        req.approvalCount++;
    }

    // REQUEST COMPLETED AND MONEY SENT TO VENDOR
    function finalizeRequest(uint index) public restricted {
        Request storage req = requests[index];

        require(req.approvalCount >= (approversCount / 2));
        require(!req.complete);

        payable(req.recipient).transfer(req.value);

        req.complete = true;  
    } 

    function getSummary() public view returns (uint,uint,uint,uint,address) {
        return (
            minimumContribution,
            address(this).balance,
            requestsCount,
            approversCount,
            manager 
        );
    }
}
// MEMORY TEMPORARY STORES DATA AND CREATES A COPY OF GIVEN DATA
// Solidity assumes that 'newRequest' is a storage variable, but as we know the Request we are creating (the thing on the right hand side of the equals sign) is value stored in memory. 
// So we have to specifically mark 'newRequest' as being memory as well to match.