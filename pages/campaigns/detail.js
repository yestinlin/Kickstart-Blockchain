import React, {Component} from "react";
import { Card,Grid, Button, CardDescription } from "semantic-ui-react";
import Layout from '../../Components/Layout';
import SeeCampaign from "../../ethereum/seeCampaign";
import web3 from '../../ethereum/web3';
import ContributeForm from '../../Components/ContributeForm';
import {Link} from '../../routes';


class CampaignDetail extends Component{
    //getInitialProps is not a part of actual component instant.
    static async getInitialProps(props) {
        const seeCampaign = SeeCampaign(props.query.address); 

        const summary = await seeCampaign.methods.getSummary().call();


        return{ 
            //getInitialProps is not a part of actual component instant. That why we need address here.
            address: props.query.address,
            minContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            name: summary[5],
            description: summary[6],
            image: summary[7],
            target: summary[8]

        };
    }

    
    renderCards() {
        const {
            balance,
            manager,
            minContribution,
            requestsCount,
            approversCount,
            name,
            description,
            image,
            target

        } = this.props;

        const items = [
            {   
              
                header: <img src={image} style={{width:150, height:100, marginBottom:10, align: "center"}} />,
                meta: <p style={{color:"blue"}}>{name}</p> ,
                description: description
            },
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager who created this campaign and can create requests to withdraw money.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minContribution,
                meta: 'Minimum Contribution(Wei)',
                description: 'You must contribute at least this much wei to enter'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Requests much be approve by the approvers'
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of people who have donated to the campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much the campaign has left tp spend.' 
            },
            {
                header: target,
                meta: 'Wei',
                description: 'The target Wei of the campaign may need to be succeed.' 
            }

        ];

        return <Card.Group items={items} />

    }

    render() {
        return (
        
        <Layout>
        
        <h3> Campaign Detail</h3>
       <Grid>
         <Grid.Row>
         <Grid.Column width={10}>
            <Grid.Column>
            {this.renderCards()}
            </Grid.Column>
        </Grid.Column>
        
        <Grid.Column width={6}>
            <ContributeForm address={this.props.address}/>
        </Grid.Column>
        </Grid.Row> 
        
        <Grid.Row>
        <Grid.Column>
            <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                <Button primary>
                    View Requests
                </Button>
                </a>
            </Link>
        </Grid.Column>
        </Grid.Row>   
       </Grid>
       </Layout>
        );
    };

}


export default CampaignDetail;