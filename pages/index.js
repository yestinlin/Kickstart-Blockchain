import React, { Component } from 'react';
import main from '../ethereum/main';
import { Card, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Layout from '../Components/Layout';
import {Link} from '../routes';
import SeeCampaign from "../ethereum/seeCampaign";

class CampaignIndex extends Component {

    constructor(props){
        super(props);
        this.state = {
          items: null,
          summary: null
        }
      }

    static async getInitialProps() {
        const campaigns = await main.methods.getDeployCampaign().call();
        
        return { campaigns: campaigns };
    }

    async componentDidMount(){
        
        const summary = await Promise.all(this.props.campaigns.map((campaign, i) => SeeCampaign(this.props.campaigns[i]).methods.getSummary().call()));
        this.setState({summary});
      }

    renderCampaign(){
        let sum;
        //map function will call items each one time
        const items = this.props.campaigns.map((address,i) => {
            if (this.state.summary) sum = this.state.summary[i];
            else sum = {"5": "null"};
            return{
                header: sum[5],
                meta: address,
                description: (
                <Link route={`/campaigns/${address}`}>
                <a>View Campaign</a>
                </Link>),
                fluid: true
            };
        });
        
        return <Card.Group items = {items} />
    }

    render(){
        return (
        <Layout>
        <div>
        <h3>Open Campaign</h3>

        <Link route='/campaigns/new'>
        <a>
        <Button
            content='Create Campaign' 
            icon='add circle' 
            floated='right' primary 
        />
        </a>
        </Link>
        {this.renderCampaign()}
        </div>
        </Layout>
    );
}
}

export default CampaignIndex;

