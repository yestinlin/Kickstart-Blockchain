import React, {Component} from 'react';
import Layout from '../../../Components/Layout';
import {Button, Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import seeCampaign from '../../../ethereum/seeCampaign';
import RequestRow from '../../../Components/RequestRow';

class RequestIndex extends Component {

    static async getInitialProps(props){
        const {address} = props.query;
        const campaign = seeCampaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approverCount = await campaign.methods.approverCount().call();

        //Array.fill return the list of 5 

        //The requestCount contains string value 4. And because it's not a Number type specifying the array length, the Array() constructor takes it as one element (value "4") of the newly created array. Solution: pass the value as type Number to create a 4-item array.

        const requests = await Promise.all(
            Array(parseInt(requestCount))
            .fill()
            .map(( element,index) => {
                return campaign.methods.requests(index).call();
            })
            
        );
       
        
        return {address, requests, requestCount, approverCount };
    }

    renderRow(){
        return this.props.requests.map((request, index) => {
            return (
            <RequestRow
             key={index}
             id={index} 
             request={request}
             address={this.props.address}
             approverCount={this.props.approverCount}
            />
            );
        });
    }

    render() {

        //destructor the Table.Header and so on into a easier way
        const  {Header, Row, HeaderCell, Body} = Table;



        return (
            <Layout>
            <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                <Button primary floated='right'style={{marginBottom: 10}}>Add Request</Button>
                    </a>    
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRow()}
                    </Body>
                </Table>
                <div>
                
                <p>Found {this.props.requestCount} requests</p>
                
                </div>
            </Layout>
        );
    }
}

export default RequestIndex;