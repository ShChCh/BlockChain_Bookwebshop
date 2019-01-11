$(function(){
  // $(window).on('load', function(){ App.init();});
  App.init();
  // $(window).load(function() {
  //   App.init();
  // });
});
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  Temp_Items_list:{},
  // T_Items_dic:{},
  Items_list:[],
  Items_dic:{},
  Selling_items:[],
  balance:0,
  nickname:null,
  activate:false,
  Trade_history:[],
  // descs:[],
  // desc:null,
  // image:null,
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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
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
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }else{
          App.account=accounts[0];
          web3.eth.getBalance(App.account, function(error, result) {
            if (!error){
              // console.log('Ether:', web3.fromWei(result,'ether')); 
              App.balance=web3.fromWei(result,'ether').c[0];
              console.log(App.balance);
            }
            else
              console.log('Huston we have a promblem: ', error);
            });
          // console.log(App.account);
          // $("#accountAddress").html("Your Account: " + App.account);
        }
      });// 
      App.listenForEvents();
      App.Get_trade_history();
      App.check_account();
      return App.render();
      // return App.listenForEvents();
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
        App.Items_list=[];
        App.Selling_items=[];
        App.render();
        
      });
    });
    App.contracts.ShopingItem.deployed().then(function(instance) {
      
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.update_history().watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.Get_trade_history();
        
      });
    });
    App.contracts.ShopingItem.deployed().then(function(instance) {
      
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.update_account().watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.check_account();
        
      });
    });
  },

  render:function(){
    $("#loader").show();
    $("#content").hide();
    var ItemListInstance;
    App.contracts.ShopingItem.deployed().then(function(instance) {
      ItemListInstance = instance;
      // console.log("aa");
      return ItemListInstance.get_itemlist.call();
    }).then(function(data) {
      // console.log("bb"); 
      // var ItemList = $("#List");
      var Items_list={};
      // ItemList.empty();
      App.Items_list=[];
      App.Selling_items=[];
      var i=0;
      var descs=[];
      // var index=0;
      // console.log(data);
      for(;i<data[1].length;i++){
          var id = data[1][i];
          var seller = data[0][i];
          var name = web3.toUtf8(data[2][i]);
          var price = data[3][i];
          var amount = data[4][i];
          var seller_name = web3.toUtf8(data[5][i]);
          Items_list[id]=[seller,name,price,amount,seller_name]; 
          // var Itemtemplate = "<tr><th>" + seller + "</th><td>" + id + "</td><td>" + name + "</td><td>" + price + "</td><td>" + amount + "</td></tr>"
          // ItemList.append(Itemtemplate);
        }
      //  for (var j=0; j < data[1].length; j++) {
      //     var id = data[1][j];
      //     var index =j;
      //     ItemListInstance.descriptions(id).then(function(temp) {
      //       App.desc=temp;
      //       // index+=1;
      //   });
        // Items_list[j].push(App.desc);
        // var Itemtemplate = "<tr><th>" + Items_list[index][0] + "</th><td>" + Items_list[index][1] + "</td><td>" + Items_list[index][2] + "</td><td>" + Items_list[index][3] + "</td><td>" + Items_list[index][4] + "</td><td>" + Items_list[index][5] + "</td></tr>"
        // ItemList.append(Itemtemplate);
      // }  
      App.Temp_Items_list=Items_list;   
      // console.log(App.Temp_Items_list);
      // Items_list=[];
      console.log(App.account);
      for (var j=0; j < data[1].length; j++) {
          var id = data[1][j];
          ItemListInstance.get_desc_image.call(id).then(function(temp) {
              var id = temp[0];
              var desc = temp[1];
              var image = temp[2];
              var seller = App.Temp_Items_list[id][0];
              var name = App.Temp_Items_list[id][1];
              var price = App.Temp_Items_list[id][2].c[0];
              var amount = App.Temp_Items_list[id][3].c[0]; 
              var seller_name=App.Temp_Items_list[id][4];
              App.Items_dic[id]=[name,price,amount,image,desc,seller];
              App.Items_list.push([id,name,price,amount,desc,image,seller_name]);
              // var current = window.sessionStorage.getItem('itemsdic');
              // if (!current) { // check if an item is already registered
              //   current = {}; // if not, we initiate an empty array
              // }else{
              //   current = JSON.parse(current);
              // }
              if(seller==App.account){
                // current[id]=[name,price,amount,desc,image,seller,'own'];
                App.Selling_items.push([id,name,price,amount,desc,image]);
                // console.log(App.Selling_items);
              }
              // console.log(App.Items_list);
              // else{
                // current[id]=[name,price,amount,desc,image,seller,'other'];
              // }
              // window.sessionStorage.setItem('itemsdic', JSON.stringify(current)); // replace
              // var Itemtemplate = "<tr><th>" + seller + "</th><td>" + id + "</td><td>" + name + "</td><td>" + price + "</td><td>" + amount + "</td><td>" + desc + "</td><td>" + image + "</td></tr>"
              // ItemList.append(Itemtemplate);
            });
      }
      // console.log(App.Items_list[0]);
      // App.Items_dic=App.T_Items_dic;
      // if(index!=0){
        // $("#content").show();
      // }
      // else{
      // }
      // console.log(App.Items_dic);

      // window.sessionStorage.setItem("itemsdic",JSON.stringify(App.Items_dic));
    }).
    then(function(result) {
      // Wait for update
      $("#loader").hide();
      $("#content").show();
    }).
    catch(function(error){
      console.warn(error);
    });
    // console.log(App.Items_dic);
  },
  // Get_items:function(){
  //   // App.render();
  //   console.log(App.Items_dic);
  //   return App.Items_dic;
  // },
  Sell_Item: function(Item_name,Item_amount,Item_price,desc,img) {
    $("#loader").show();
    $("#content").hide();
    // var temp_instance;
    // var Item_name = $('#name').val();
    // var Item_amount = $('#amount').val();
    // var Item_price = $('#price').val();
    // var desc = $('#desc').val();
    App.contracts.ShopingItem.deployed().then(function(instance) {
      // instance.add_desc(desc);
      // temp_instance=instance;
      return instance.sell_item(Item_name,Item_amount,Item_price,desc,img);
    }).then(function(result) {
      // Wait for votes to update
      // location.reload();
      // temp_instance.add_desc(desc);
      // $("#loader").hide();
      // $("#content").show();
      // App.listenForEvents();
    }).catch(function(err) {
      console.error(err);
    });
  },

//   search_item:function(){
//     var Search_result = $("#search_list");
//     var searchname = $("#searchname").val();
//     var searchprice = $("#searchprice").val();
//     for(var i=0; i<App.Items_list.length;i++){
//       var name=App.Items_list[i][2];
//       var price =App.Items_list[i][3];
//      if(name==searchname && price<=searchprice){
//         var seller = App.Items_list[i][0];
//         var id =App.Items_list[i][1];
//         var amount  = App.Items_list[i][4];
//         var desc = App.Items_list[i][5]
//         var template = "<tr><th>" + seller + "</th><td>" + id + "</td><td>" + name + "</td><td>" + price + "</td><td>" + amount + "</td><td>" + desc + "</td></tr>"
//         Search_result.append(template); 
//       }
//   }
//   $("#search_result").show();
// },
Modify_item: function(id,name,amount,price,desc,img) {
  $("#loader").show();
  $("#content").hide();
    App.contracts.ShopingItem.deployed().then(function(instance) {

      return instance.modify_item(id,name,amount,price,desc,img);
    }).then(function(result) {
      // Wait for votes to update
      // location.reload();
      // $("#content").hide();
      // $("#loader").show();
      // App.listenForEvents();
    }).catch(function(err) {
      console.error(err);
    });
  },
  Delete_item: function(id) {
    $("#loader").show();
    $("#content").hide();
    App.contracts.ShopingItem.deployed().then(function(instance) {
      return instance.delete_item(id,{gas:100000});
    }).then(function(result) {
      // Wait for votes to update
      // location.reload();
      // $("#content").hide();
      // $("#loader").show();
      // App.listenForEvents();
    }).catch(function(err) {
      console.error(err);
    });
  },
  Get_trade_history: function(){
    $("#loader").show();
    $("#content").hide();
    // var Trading_instance;
    App.contracts.ShopingItem.deployed().then(function(instance) {
      // Trading_instance = instance;
      // console.log("aa");
      return instance.get_trade_history.call();
    }).then(function(data) {
      // console.log(data);
      // var ItemList = $("#List");
      var Trading_List=[];
      App.Trade_history=[];
      // var Items_list=[];
      // ItemList.empty();
      var i=0;
      for (; i < data[1].length; i++) {
          var time = data[0][i].c[0].toString();
          if(time.length==11){
            time='0'+time;
          }
          var newtime = " "+time.substring(0,2) +":" +time.substring(2,4) +" "+time.substring(4,6)+"/"+time.substring(6,8)+"/"+time.substring(8,12)
          var name = web3.toUtf8(data[1][i]);
          var id = data[2][i];
          var amount = data[3][i].c[0];
          var value = data[4][i].c[0];
          var trader = web3.toUtf8(data[5][i]);
          var trader_type = data[6][i].c[0];
          Trading_List.push([newtime,id,name,value,amount,trader,trader_type]);
      }
      App.Trade_history=Trading_List;
      console.log(App.Trade_history);
    }).then(function(){
      $("#loader").hide();
      $("#content").show();
    }).catch(function(error){
      console.warn(error);
    });
  },
  Buy_item: function(id,amount,time) {
    $("#loader").show();
    $("#content").hide();
    // console.log(App.Items_dic[id]);
    console.log(amount);
    var apiCall = "https://api.coinmarketcap.com/v1/ticker/ethereum/";
    var rate_data=JSON.parse($.ajax({type: "GET", url: apiCall, async: false}).responseText);
    	// console.log( rate_data[0]["price_usd"])
    var seller_address = App.Items_dic[id][5];
    var t_value = ((amount*App.Items_dic[id][1]) *(1/rate_data[0]["price_usd"])).toFixed(4);
    // console.log(App.Items_dic[id][1],t_value>App.balance, amount>App.Items_dic[id][2],App.account==seller_address);
    if(t_value>App.balance || amount>App.Items_dic[id][2] || App.account==seller_address){
      return false;
    }
    App.contracts.ShopingItem.deployed().then(function(instance) {
      console.log(t_value);
      web3.eth.sendTransaction({from:App.account, to:seller_address, value: web3.toWei(t_value, "ether")},(error,result)=>(console.log(result,error)));
      var temp =(amount*App.Items_dic[id][1]).toFixed(4);
      return instance.buy_item(seller_address,id,amount,temp,time);
    }).then(function(result) {
      // Wait for votes to update
      // location.reload();
      // $("#content").hide();
      // $("#loader").show();
      App.listenForEvents();

    }).then(function(){
      $("#loader").hide();
      $("#content").show();
    }).catch(function(err) {
      console.error(err);
    });
    return true;
  },
  check_account:function(){
    App.contracts.ShopingItem.deployed().then(function(instance) {
        
      // console.log("aa");
      return instance.check_account.call();
    }).then(function(result){
      // console.log(result);
      if(result[0]){
        App.activate=result[0];
        App.nickname= web3.toUtf8(result[1]);
        console.log(App.activate,App.nickname);
      }
    });
  
  },
  init_account:function(nickname){
    // var nickname=$("#nickname").val();
    App.contracts.ShopingItem.deployed().then(function(instance) {
        
      // console.log("aa");
      return instance.check_account.call();
    }).then(function(result){
      // console.log(result);
        if(result[0]==false){
          App.contracts.ShopingItem.deployed().then(function(instance) {
      
            // console.log("aa");
            return instance.init_account(nickname);
          });
        }
    });
  }
};

