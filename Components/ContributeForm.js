import React,{Component} from 'react';
import {Form, Input, Message, Button} from 'semantic-ui-react';
import SeeCampaign from '../ethereum/seeCampaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

class Contribution extends Component{

    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (e) =>{
        e.preventDefault();

        const seeCampaign = SeeCampaign(this.props.address);

        this.setState({loading: true, errorMessage: ''});

        try{
            const accounts = await web3.eth.getAccounts();
            await seeCampaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            //ES2015  ` Url `
            //Url of the same page and ask it to refresh the page
            Router.replaceRoute(`/campaigns/${this.props.address}`)

        } catch(err){
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false, value: ''});
    };

    render(){
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount of Contribute</label>
                    <Input 
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value})}
                        label="ether" 
                        labelPosition='right'
                        />

                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage}/>
                <Button loading={this.state.loading} primary> Contribute </Button>
            </Form>
        )
    }
}

export default Contribution;    