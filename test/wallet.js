var wallet = artifacts.require('./MyWallet.sol');

contract("MyWallet",function (accounts) {
  it("Should be possible to put money inside",function() {
    var contractInstance;
    wallet.deployed().then(function (instance) {
      contractInstance = instance;
      return contractInstance.sendTransaction({value:web3.toWei(20,'ether'),address:contractInstance.address,from:accounts[0]});
    }).then(function (tx) {
      //console.log(tx);
      assert.equal(web3.eth.getBalance(contractInstance.address).toNumber(), web3.toWei(20, 'ether'),"The balance is the same");
    })
  });
  it('should be possible to get money back as the owner', function() {
        var walletInstance;
        var balanceBeforeSend;
        var balanceAfterSend;
        var amountToSend = web3.toWei(5, 'ether');
        wallet.deployed().then(function(instance) {
            walletInstance = instance;
            balanceBeforeSend = web3.eth.getBalance(instance.address).toNumber();
            return walletInstance.spendMoneyOn.call(accounts[0], amountToSend, "Because I'm the owner", {from: accounts[0]});
        }).then(function() {
            return web3.eth.getBalance(walletInstance.address).toNumber();
        }).then(function(balance) {
            balanceAfterSend = balance;
            assert.equal(balanceBeforeSend-amountToSend, balanceAfterSend, 'Balance is now 5 ether less than before');
        });
    });

    it("Should be possible to send money from other than owner account, creates proposal",function () {
      var walletInstance;
      var balanceBeforeSend;
      var balanceAfterSend;
      var amountToSend = web3.toWei(5,'ether');
      wallet.deployed().then(function (instance) {
        walletInstance = instance;
        balanceBeforeSend = web3.toWei(web3.eth.getBalance(instance.address).toNumber(),'ether');
        return walletInstance.spendMoneyOn.call(accounts[2], amountToSend, "Because I'm the owner", {from: accounts[1]});
      }).then(function (tx) {
        console.log(tx.toNumber());
        return web3.eth.getBalance(walletInstance.address).toNumber();
      }).then(function (balance) {
        balanceAfterSend = web3.toWei(balance,'ether');
        assert.equal(balanceAfterSend, balanceBeforeSend, 'Both balance same, Proposal sent');
      });
    });

    it("Should be possible to Approve proposal",function () {
      var walletInstance;
      var balanceBeforeSend;
      var balanceAfterSend;
      var amountToSend = web3.toWei(5,'ether');
      wallet.deployed().then(function (instance) {
        walletInstance = instance;
        balanceBeforeSend = web3.toWei(web3.eth.getBalance(instance.address).toNumber(),'ether');
        return walletInstance.confirmProposal.call(1, {from: accounts[0]});
      }).then(function (tx) {
        console.log(tx);
        return web3.eth.getBalance(walletInstance.address).toNumber();
      }).then(function (balance) {
        balanceAfterSend = web3.toWei(balance,'ether');
        assert.equal(balanceAfterSend, balanceBeforeSend - amountToSend, 'Proposal Confirmed');
      });
    });

    // it('Should be possible to approve proposal recived',function () {
    //   var proposal_id = 1;
    //   var balanceBeforeSent;
    //   var balanceAfterSent;
    //   var walletInstance;
    //   var amountToSend = web3.toWei(5,'ether');
    //   wallet.deployed().then(function (instance) {
    //     walletInstance = instance;
    //     balanceBeforeSent = web3.eth.getBalance(instance.address).toNumber();
    //     return walletInstance.confirmProposal.call(proposal_id,{from:accounts[0]});
    //   }).then(function (tx) {
    //     console.log(tx);
    //     balanceAfterSent = web3.eth.getBalance(instance.address).toNumber();
    //     //assert.equal(balanceBeforeSend-amountToSend, balanceAfterSend, 'Balance is now 5 ether less than before');
    //   });
    // });
})
