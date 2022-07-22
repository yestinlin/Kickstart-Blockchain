import web3 from './web3';
import CampaignMain from './build/CampaignMain.json';

const instance = new web3.eth.Contract(
    CampaignMain.abi,
    '0x250d75AF34Cbe64569933EF2e0d1Fc66c81e1f68'
);

export default instance;