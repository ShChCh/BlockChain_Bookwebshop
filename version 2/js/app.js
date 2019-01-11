App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  Items_list:[],
  balance:0,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("ShopingItem.json", function(data) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.ShopingItem = TruffleContract(data);
      // Connect provider to interact with contract
      App.contracts.ShopingItem.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.ShopingItem.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.update_items().watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }else{
        App.account=accounts[0];
        $("#accountAddress").html("Your Account: " + App.account);
      }
    });
    web3.eth.getBalance(web3.eth.accounts[0], function(error, result) {
      if (!error){
        console.log('Ether:', web3.fromWei(result,'ether')); 
        App.balance=web3.fromWei(result,'ether');
      }
      else
        console.log('Huston we have a promblem: ', error);
    });
  },

  render:function(){
    var ItemListInstance;
    App.contracts.ShopingItem.deployed().then(function(instance) {
      ItemListInstance = instance;

      return ItemListInstance.get_itemlist.call();
    }).then(function(data) {
      var ItemList = $("#List");
      var Items_list=[];
      ItemList.empty();
      var i=0;
      for (; i < data[1].length; i++) {
          var seller = data[0][i];
          // var id = data[1][i].substring(60,);
          var id = data[1][i];
          var name = web3.toUtf8(data[2][i]);
          var price = data[3][i];
          var amount = data[4][i];
          Items_list.push([seller,id,name,price,amount]);
          // Render candidate Result
          var Itemtemplate = "<tr><th>" + seller + "</th><td>" + id + "</td><td>" + name + "</td><td>" + price + "</td><td>" + amount + "</td></tr>"
          ItemList.append(Itemtemplate);
      }
      App.Items_list=Items_list;
      // console.log(ItemList[0]);
      if(i!=0){
        $("#content").show();
      }
      else{
        $("#content").hide();
      }
    }).then(function(result) {
      // Wait for update
      $("#loader").hide();
    }).catch(function(error){
      console.warn(error);
    });
    console.log(App.Items_list);
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
