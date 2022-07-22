import React, {Component} from 'react';
import Layout from '../../Components/Layout';
import {Form,Button,Input, Message} from 'semantic-ui-react';
import main from '../../ethereum/main';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes'; 

class CampaignNew extends Component {
    state = {
        name: '',
        description: '',
        minimumContribution: '',
        image: '',
        target:'',
        errorMessage: '',
        loading: false
    };
    
    //Always async when you call functions on contract, so you can use await
    onSubmit = async (e) => {
        e.preventDefault(); //stop auto submit and refresh
        
        this.setState({loading: true, errorMessage: ''});

        try{

        const accounts = await web3.eth.getAccounts();
        await main.methods.createCampaign(this.state.minimumContribution, this.state.name, this.state.description,this.state.image,this.state.target)
        .send({
            from: accounts[0]
        });

        Router.pushRoute('/');

        }catch(err){
            this.setState({ errorMessage: err.message });
        } 
        this.setState({loading: false});
    };

    render() {
        return (
        <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
                <label>Minimum Contribution</label>
                <Input 
                    label="Wei" 
                    labelPosition='right'
                    value ={this.state.minimumContribution} // Show the value user entered
                    onChange={event => this.setState({minimumContribution: event.target.value})}
                    />  
                <label>Campaign Name</label>
                <Input 
                 value ={this.state.name}
                 
                 onChange={event => this.setState({name: event.target.value})}/>
                <label>Description</label>
                <Input
                 value ={this.state.description}
                 
                 onChange={event => this.setState({description: event.target.value})}
                />
                <label>Image URL</label>
                <Input
                value ={this.state.image}
                 
                 onChange={event => this.setState({image: event.target.value})}
                />
                <label>Campaign Target</label>
                <Input
                    label="Wei" 
                    labelPosition='right'
                    value ={this.state.target}
                 
                 onChange={event => this.setState({target: event.target.value})}
                />
            </Form.Field>
            <Message error header="Oops!" content={this.state.errorMessage}/>
            <Button loading={this.state.loading} primary > Contribute</Button>

        </Form>


        </Layout>
        );
    }
}

export default CampaignNew;