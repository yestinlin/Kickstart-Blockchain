// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

contract CampaignMain{
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum,string memory name,string memory  description,string memory  image,uint target) public {
        address newCampaign = address(new Campaign(minimum, msg.sender,name,description,image,target)); 
        deployedCampaigns.push(newCampaign);
 
    }

    function getDeployCampaign() public view returns(address[] memory){
        return deployedCampaigns;
    }   
    
   
}

contract Campaign{

    struct Request{
        string description; 
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
    
        mapping(address => bool) approvals;
    }    

    Request[] public requests;
    address public manager;
    mapping(address => bool) public approvers;
    string public CampaignName;
    string public CampaignDescription;
    string public imageUrl;
    uint public targetToAchive; 
    uint public minContribution; 
    uint public approverCount;
    
    constructor(uint minimum, address creator, string memory name,string memory description,string memory image,uint target){
        manager = creator;
        minContribution = minimum;
        CampaignName=name;
        CampaignDescription=description;
        imageUrl=image;
        targetToAchive=target;
    }

    modifier managerOnly(){
        require(msg.sender == manager, "You are not the manager");
        _;
    }

    function approverContribution(uint minimum) public{
        minContribution = minimum;
    }

    function contribute() public payable{
        require(msg.value > minContribution);

        approvers[msg.sender] = true;

        approverCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public managerOnly {
        
        Request storage n = requests.push();
            n.description = description;
            n.value = value;
            n.recipient = recipient;
            n.complete = false;
            n.approvalCount = 0;

        
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "You have not contributed");
        require(!request.approvals[msg.sender], "You've already voted");


        request.approvals[msg.sender] = true;
        request.approvalCount++;


    }

    function finalizeRequest(uint256 index) public payable managerOnly {
        Request storage request = requests[index];

        require(request.approvalCount > (approverCount/2), "No enough approver");
        require(!request.complete,"Already completed");
        
        request.recipient.transfer(request.value );
        request.complete = true;


    }

    function contractBalance() public view returns(uint) {
    return address(this).balance;
    }

    function getSummary() public view returns(uint,uint,uint,uint,address,string memory,string memory,string memory,uint ){
        return(
            minContribution,
            address(this).balance,
            requests.length,
            approverCount,
            manager,
            CampaignName,
            CampaignDescription,
            imageUrl,
            targetToAchive


        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}