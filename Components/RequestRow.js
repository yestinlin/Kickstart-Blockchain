import React, {Component} from 'react';
import {Table, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import seeCampaign from '../ethereum/seeCampaign';

class RequestRow extends Component{
    onApprove = async() => {
        const campaign = seeCampaign(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]

        });
    };


    onFinalize = async() => {
        const campaign = seeCampaign(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });
    };
    
    
    render() {
        //Destructed and make the code shorter
        const {Row,Cell} = Table;
        const {id, request,approverCount} = this.props;
        //The flag we put in
        const readyFinalize = request.approvalCount > approverCount / 2;
        //request.complete checks whether it is complete and show null if true
        return (
        <Row disabled={request.complete} positive={readyFinalize&&!request.complete}>
            <Cell>{id}</Cell>   
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
             <Cell>{request.recipient}</Cell>
             <Cell>{request.approvalCount}/{approverCount}</Cell>
             <Cell>
             {readyFinalize && request.complete ? null :(
                <Button color='green' basic onClick={this.onApprove}>Approve</Button>
             )}
             </Cell>
             <Cell>
             {request.complete ? null :(
                <Button color='teal' basic onClick={this.onFinalize}>Finalize</Button>
             )}
             </Cell>
        </Row>
        );
    }
}

export default RequestRow;

