pragma solidity ^0.4.18;
contract ShopingItem {
    event update_items();
    event update_account();
    struct Item{
        bytes16 name;
        int8 amount;
        int8 price;
        bytes32  id;
    }
    struct Item_history{
        bytes16 name;
        int8 amount;
        uint value;
        bytes32  id;
        uint time;
        address trader;
    }
    struct account {
        // bytes32  id;
        bool used;
        bytes32[]   Selling_items_list;
        bytes32[]   Purchased_history_list;
        bytes32[]   trade_history_list;
        mapping(bytes32 => Item) Selling_item;
        mapping(bytes32 => Item_history) Purchased_history;
        mapping(bytes32 => Item_history) trade_history;
    }
    mapping(address => account) accounts;
    address[] public accounts_list;
    uint item_number=0;
    uint generate_id=10;
    function convert(uint256 n) returns (bytes32) {
        return bytes32(n);
    }
    function sell_item(bytes16 _name, int8 _amount, int8 _price)  public returns(bool success){
        require(init_account(msg.sender));
        var item_id = convert(generate_id);
        accounts[msg.sender].Selling_items_list.push(item_id);
        accounts[msg.sender].Selling_item[item_id].name = _name;
        accounts[msg.sender].Selling_item[item_id].amount = _amount;
        accounts[msg.sender].Selling_item[item_id].price = _price;
        accounts[msg.sender].Selling_item[item_id].id = item_id;
        item_number+=1;
        generate_id+=1;
        emit update_items();
        return true;
        
    }
    function init_account(address _address) private returns(bool flag){
        if(!accounts[_address].used){
            accounts[_address].used=true;
            accounts_list.push(_address);
        }
        emit update_account();
        return true;
    }
    function get_itemlist() public  returns(address[],bytes32[],bytes16[],int8[],int8[]){
        uint index = 0;
        address[]  memory seller_list = new address[](item_number);
        int8[]   memory  price_list = new int8[](item_number);
        int8[]    memory amount_list= new int8[](item_number);
        bytes16[]   memory  name_list= new bytes16[](item_number);
        bytes32[] memory item_id_list= new bytes32[](item_number);
        for(uint i=0;i<accounts_list.length;i++){
            for(uint j=0;j<accounts[accounts_list[i]].Selling_items_list.length;j++){
                var item_id = accounts[accounts_list[i]].Selling_items_list[j];
                seller_list[index]=accounts_list[i];
                price_list[index]=accounts[accounts_list[i]].Selling_item[item_id].price;
                amount_list[index]=accounts[accounts_list[i]].Selling_item[item_id].amount;
                item_id_list[index]=item_id;
                name_list[index]=accounts[accounts_list[i]].Selling_item[item_id].name;
                index+=1;
            }
        }
        return(seller_list,item_id_list,name_list,price_list,amount_list);
    }
    function modify_item(address user_adress, bytes32 item_id,int8 _amount,int8 _price) returns(bool success) {
        // if(vertify_user(user_adress,msg.sender) && vertify_item(user_adress,item_id)){
            Item temp = accounts[user_adress].Selling_item[item_id];
            temp.amount=_amount;
            temp.price=_price;
            emit update_items();
            return true;
        // }
        // return false;
    }
    // function vertify_user(address _address,address owner) returns(bool flag){
    //     if(_address==owner){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }
    function delete_item(address user_adress, bytes32 item_id) returns(bool success){
        // if(vertify_user(user_adress,msg.sender) && vertify_item(user_adress,item_id)){
            bool j=false;
            if(accounts[user_adress].Selling_items_list.length==1){
                delete accounts[user_adress].Selling_items_list[0];
                delete accounts[user_adress].Selling_item[item_id];
            }
            else{
                for (uint i = 0; i<accounts[user_adress].Selling_items_list.length-1; i++){
                    if(accounts[user_adress].Selling_items_list[i]==item_id){
                        j=true;
                        delete accounts[user_adress].Selling_item[item_id];
                    }
                    if(j==true){
                        accounts[user_adress].Selling_items_list[i]=accounts[user_adress].Selling_items_list[i+1];
                    }
                }
            }
            accounts[user_adress].Selling_items_list.length=accounts[user_adress].Selling_items_list.length-1;
            item_number-=1;
            emit update_items();
            return true;
        // }
        // return false;
    }
    // function vertify_item(address _address,bytes32 item_id) returns(bool flag){
    //     bytes32 v;
    //     if(accounts[_address].Selling_item[item_id].id ==v){
    //         return false;
    //     }
    //     return true;
    // }
    function buy_item(address seller_address,bytes32 item_id,int8 amount_of_buy,uint value,uint time){
        account buyer = accounts[msg.sender];
        account seller = accounts[seller_address];
        // msg.sender.transfer(value);
        // seller_address.transfer(this.balance);
        bytes32 buy_id = convert( buyer.Purchased_history_list.length);
        bytes32 sell_id = convert( seller.trade_history_list.length);
        Item i = accounts[seller_address].Selling_item[item_id];
        i.amount-=amount_of_buy;
        buyer.Purchased_history_list.push(buy_id);
        buyer.Purchased_history[buy_id].name = i.name;
        buyer.Purchased_history[buy_id].id = i.id;
        buyer.Purchased_history[buy_id].amount = amount_of_buy;
        buyer.Purchased_history[buy_id].value = value;
        buyer.Purchased_history[buy_id].time = time;
        buyer.Purchased_history[buy_id].trader = seller_address;
        seller.trade_history_list.push(sell_id);
        seller.trade_history[sell_id].name = i.name;
        seller.trade_history[sell_id].id = i.id;
        seller.trade_history[sell_id].amount = amount_of_buy;
        seller.trade_history[sell_id].value = value;
        seller.trade_history[sell_id].time = time;
        seller.trade_history[sell_id].trader = msg.sender;
    }
    // function get_balance() returns (uint balance){
    //     return(msg.sender.balance);
    // }
    function get_purchased_history() public returns(uint[],bytes16[],bytes32[],int8[],uint[],address[]){
        uint index = 0;
        var number = accounts[msg.sender].Purchased_history_list.length;
        address[]  memory seller_list = new address[](number);
        uint[]   memory  value_list = new uint[](number);
        int8[]    memory amount_list= new int8[](number);
        bytes16[]   memory  name_list= new bytes16[](number);
        bytes32[] memory item_id_list= new bytes32[](number);
        uint[] memory time_list=new uint[](number);
        for(uint j=0;j<number;j++){
            var id = accounts[msg.sender].Purchased_history_list[j];
            seller_list[index]=accounts[msg.sender].Purchased_history[id].trader;
            value_list[index]=accounts[msg.sender].Purchased_history[id].value;
            amount_list[index]=accounts[msg.sender].Purchased_history[id].amount;
            item_id_list[index]=accounts[msg.sender].Purchased_history[id].id;
            name_list[index]=accounts[msg.sender].Purchased_history[id].name;
            time_list[index]=accounts[msg.sender].Purchased_history[id].time;
            index+=1;
        }
        return(time_list,name_list,item_id_list,amount_list,value_list,seller_list);
    }
    function get_trade_history() public returns(uint[],bytes16[],bytes32[],int8[],uint[],address[]){
        uint index = 0;
        var number = accounts[msg.sender].trade_history_list.length;
        address[]  memory buyer_list = new address[](number);
        uint[]   memory  value_list = new uint[](number);
        int8[]    memory amount_list= new int8[](number);
        bytes16[]   memory  name_list= new bytes16[](number);
        bytes32[] memory item_id_list= new bytes32[](number);
        uint[] memory time_list=new uint[](number);
        for(uint j=0;j<number;j++){
            var id = accounts[msg.sender].trade_history_list[j];
            buyer_list[index]=accounts[msg.sender].trade_history[id].trader;
            value_list[index]=accounts[msg.sender].trade_history[id].value;
            amount_list[index]=accounts[msg.sender].trade_history[id].amount;
            item_id_list[index]=accounts[msg.sender].trade_history[id].id;
            name_list[index]=accounts[msg.sender].trade_history[id].name;
            time_list[index]=accounts[msg.sender].trade_history[id].time;
            index+=1;
        }
        return(time_list,name_list,item_id_list,amount_list,value_list,buyer_list);
    }
}