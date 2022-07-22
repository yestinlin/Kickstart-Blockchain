import React, {Component} from 'react';
import {Button,Form,Message,Input} from 'semantic-ui-react';
import seeCampaign from '../../../ethereum/seeCampaign';
import web3 from '../../../ethereum/web3';
import {Link,Router} from '../../../routes'; 
import Layout from '../../../Components/Layout';

class RequestNew extends Component{
    state = {
        value:'',
        description:'',
        recipient:'',
        loading: false,
        errMessage: ''
    }
    //pull out the address and return as a props component
    static async getInitialProps(props){
        const {address} =props.query;
        return {address};
    }

    onSubmit = async e => {
        e.preventDefault();
        
        const campaign = seeCampaign(this.props.address);
        const {description, value, recipient} = this.state;

        this.setState({loading: true, errMessage: ''})

        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient).send({from: accounts[0]});

            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
               
        } catch(err){
            this.setState({errMessage: err.message})
        }
        this.setState({loading: false});
    };

    //The onchange event occurs when the value of an element has been changed.
    render(){
        return (  
            <Layout>  
            <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>Back</a>
            </Link>
            <Form onSubmit={this.onSubmit} error={!!this.state.errMessage}>
            <h3>Create a Request</h3>
                <Form.Field>
                    <label>Description:</label>
                    <Input
                        value={this.state.description}
                        onChange={event => this.setState({description: event.target.value})}
                    />

                </Form.Field>

                <Form.Field>
                    <label>Value in Ether:</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({value: event.target.value})}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Recipient Address:</label>
                    <Input
                        value={this.state.recipient}
                        onChange={event => this.setState({recipient: event.target.value})}
                    />
                </Form.Field>

            <Message error header="Oops!" content={this.state.errMessage}></Message>
            <Button primary loading={this.state.loading}> Create </Button>
            </Form>
            </Layout>
        );
    }
}

export default RequestNew;