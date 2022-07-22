import Web3 from 'web3';


let web3;
//Check to see we are on the server or browser
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
   
    //We are in the browser and metamask is running
    web3 = new Web3(window.ethereum);

} else {
    //We are on the server or metamask is not running
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/81724c4b3c964bb485da3f4068131d6f'
    );

    web3 = new Web3(provider);
}

export default web3;

