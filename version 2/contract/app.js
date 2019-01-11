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

  Sell_Item: function() {
    var Item_name = $('#name').val();
    var Item_amount = $('#amount').val();
    var Item_price = $('#price').val();
    App.contracts.ShopingItem.deployed().then(function(instance) {
      return instance.sell_item(Item_name,Item_amount,Item_price);
    }).then(function(result) {
      // Wait for votes to update
      // location.reload();
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  search_item:function(){
    var Search_result = $("#search_list");
    var searchname = $("#searchname").val();
    var searchprice = $("#searchprice").val();
    for(var i=0; i<App.Items_list.length;i++){
      var name=App.Items_list[i][2];
      var price =App.Items_list[i][3];
     if(name==searchname && price<=searchprice){
        var seller = App.Items_list[i][0];
        var id =App.Items_list[i][1];
        var amount  = App.Items_list[i][4];
        var template = "<tr><th>" + seller + "</th><td>" + id + "</td><td>" + name + "</td><td>" + price + "</td><td>" + amount + "</td></tr>"
        Search_result.append(template); 
      }
  }
  $("#search_result").show();
},
Modify_item: function(seller_address,id,amount,price) {
    App.contracts.ShopingItem.deployed().then(function(instance) {
      return instance.modify_item(seller_address,id,amount,price);
    }).then(function(result) {
      // Wait for votes to update
      // location.reload();
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
  Delete_item: function(seller_address,id) {
    App.contracts.ShopingItem.deployed().then(function(instance) {
      return instance.delete_item(seller_address,id,{gas:100000});
    }).then(function(result) {
      // Wait for votes to update
      // location.reload();
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
  Get_purchased_history: function(){
    var History_instance;
    App.contracts.ShopingItem.deployed().then(function(instance) {
      History_instance = instance;

      return ItemListInstance.get_purchased_history.call();
    }).then(function(data) {
      // var ItemList = $("#List");
      var History_List=[];
      // var Items_list=[];
      // ItemList.empty();
      var i=0;
      for (; i < data[1].length; i++) {
          var time = data[0][i];
          // var id = data[1][i].substring(60,);
          var name = data[1][i];
          var id = web3.toUtf8(data[2][i]);
          var amount = data[3][i];
          var value = data[4][i];
          var seller = data[5][i];
          History_List.push([time,id,name,price,amount,seller]);
          // Render candidate Result
          // var Itemtemplate = "<tr><th>" + seller + "</th><td>" + id + "</td><td>" + name + "</td><td>" + price + "</td><td>" + amount + "</td></tr>"
          // ItemList.append(Itemtemplate);
      }
      // App.Items_list=Items_list;
      // console.log(ItemList[0]);
      // if(i!=0){
      //   $("#content").show();
      // }
      // else{
      //   $("#content").hide();
      // }
    }).then(function(result) {
      // Wait for update
      // $("#loader").hide();
    }).catch(function(error){
      console.warn(error);
    });
    // console.log(App.Items_list);
  },
  Get_trade_history: function(){
    var Trading_instance;
    App.contracts.ShopingItem.deployed().then(function(instance) {
      Trading_instance = instance;

      return ItemListInstance.get_trade_history.call();
    }).then(function(data) {
      // var ItemList = $("#List");
      var Trading_List=[];
      // var Items_list=[];
      // ItemList.empty();
      var i=0;
      for (; i < data[1].length; i++) {
          var time = data[0][i];
          // var id = data[1][i].substring(60,);
          var name = data[1][i];
          var id = web3.toUtf8(data[2][i]);
          var amount = data[3][i];
          var value = data[4][i];
          var buyer = data[5][i];
          Trading_List.push([time,id,name,price,amount,buyer]);
          // Render candidate Result
          // var Itemtemplate = "<tr><th>" + seller + "</th><td>" + id + "</td><td>" + name + "</td><td>" + price + "</td><td>" + amount + "</td></tr>"
          // ItemList.append(Itemtemplate);
      }
      // App.Items_list=Items_list;
      // console.log(ItemList[0]);
      // if(i!=0){
      //   $("#content").show();
      // }
      // else{
      //   $("#content").hide();
      // }
    }).then(function(result) {
      // Wait for update
      // $("#loader").hide();
    }).catch(function(error){
      console.warn(error);
    });
    // console.log(App.Items_list);
  },
  Buy_item: function(seller_address,id,amount,t_value,time) {
    App.contracts.ShopingItem.deployed().then(function(instance) {
      web3.eth.sendTransaction({from:App.account, to:seller_address, value: web3.toWei(t_value, "ether")},(error,result)=>(console.log(result)));
      return instance.buy_item(seller_address,id,amount,t_value,time);
    }).then(function(result) {
      // Wait for votes to update
      // location.reload();
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
