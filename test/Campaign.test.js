const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());


const compiledMain = require('../ethereum/build/CampaignMain.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let main;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    

    main = await new web3.eth.Contract(compiledMain.abi)
        .deploy({data: compiledMain.evm.bytecode.object})
        .send({from: accounts[0], gas: '3000000'});
    
    await main.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '3000000'
    });
    
    [campaignAddress] = await main.methods.getDeployCampaign().call();
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
});

    describe('Campaigns', () => {
        it('deploy a main and a campaign', () => {
            assert.ok(main.options.address);
            assert.ok(campaign.options.address);
           
        });

        it('marks caller as the manager', async () => {
            const manager = await campaign.methods.manager().call();
            assert.equal(accounts[0], manager);
        });

        it('A user can donate money and marks them as contributor', async () => {
            await campaign.methods.contribute().send({
                value: '200',
                from: accounts[1]
            }); 
            
            const isApprover = await campaign.methods.approvers(accounts[1]).call(); //check if the account in the mapping
            assert(isApprover); //Equals to true will pass

        });

        it('requires a minimum amount to enter', async () => {
            try{
                await campaign.methods.contribute().send({
                    value: '10',
                    from: accounts[1]
                });
                assert(false); // fail the test if it succeed
            }catch(error) {
                assert(error);
            };
        });

        it('a manager can make an request', async () => {

            await campaign.methods.createRequest('Testing', '100', accounts[1]).send({
                from: accounts[0],
                gas: '1000000'
            });
            const aRequest = await campaign.methods.requests(0).call();
            assert.equal('Testing',aRequest.description);
        });

        it('processes a request', async () => {

            await campaign.methods.contribute().send({
                value: web3.utils.toWei('5','ether'),
                from: accounts[0]
            });
            await campaign.methods
                .createRequest('Apple watch', web3.utils.toWei('1','ether'), accounts[1]).send({
                from: accounts[0],
                gas: '1000000'
            });

            await campaign.methods.approveRequest(0).send({
                from: accounts[0],
                gas: '1000000'
            });

            await campaign.methods.finalizeRequest(0).send({
                from: accounts[0],
                gas: '1000000'
            });

            let balance = await web3.eth.getBalance(accounts[1]); // use let here as we need to do reassign

            balance = web3.utils.fromWei(String(balance),'ether');
            balance = parseFloat(String(balance));
            //console.log(balance);
            assert(balance > 100.9); //base balance will be 100 ether

        });

        it('Non-contributed user not able to vote', async () => {
            try{
            await campaign.methods.approveRequest(0).send({
                gas: '1000000',
                from: accounts[1]
            });
            assert(false);
        }catch(error){
            assert(error);
           
        }
        });
    });