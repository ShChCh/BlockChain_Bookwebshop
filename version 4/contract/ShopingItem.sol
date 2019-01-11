pragma solidity ^0.4.18;
contract ShopingItem {
    event update_items();
    event update_account();
    event update_history();
    struct Item{
        bytes16 name;
        int8 amount;
        int8 price;
        // bytes32  id;
    }
    struct Item_history{
        bytes16 name;
        int8 amount;
        uint value;
        bytes32  id;
        uint time;
        address trader;
        int8 trade_type;
    }
    struct account {
        bytes32 nickname;
        bool used;
        bytes32[]   Selling_items_list;
        // bytes32[]   Purchased_history_list;
        bytes32[]   trade_history_list;
        mapping(bytes32 => Item) Selling_item;
        // mapping(bytes32 => Item_history) history;
        mapping(bytes32 => Item_history) trade_history;
    }
    mapping(bytes32 => string)  descriptions;
    mapping(bytes32 => string)  images;
    mapping(address => account) accounts;
    address[] private accounts_list;
    uint item_number=0;
    uint generate_id=10;
    function convert(uint256 n) private returns (bytes32) {
        return bytes32(n);
    }
    function get_desc_image(bytes32 _id) public returns(bytes32,string,string){
        return(_id,descriptions[_id],images[_id]);
    }
    function sell_item(bytes16 _name, int8 _amount, int8 _price,string desc,string image)  public{
        require(accounts[msg.sender].used);
        var item_id = convert(generate_id);
        accounts[msg.sender].Selling_items_list.push(item_id);
        accounts[msg.sender].Selling_item[item_id].name = _name;
        accounts[msg.sender].Selling_item[item_id].amount = _amount;
        accounts[msg.sender].Selling_item[item_id].price = _price;
        add_desc_image(item_id,desc,image);
        item_number+=1;
        generate_id+=1;
        emit update_items();
        // accounts[msg.sender].Selling_item[item_id].id = item_id;
        // descriptions[item_id]=desc;
        // item_number+=1;
        // generate_id+=1;
        // emit update_items();
        // return true;
        
    }
    function add_desc_image(bytes32 item_id,string desc,string image) private{
        // var item_id = convert(generate_id);
        descriptions[item_id]=desc;
        images[item_id]=image;
        // return true;
    }
    function check_account() public returns(bool,bytes32 ){
        if(accounts[msg.sender].used){
            return(true,accounts[msg.sender].nickname);
        }
        return(false,accounts[msg.sender].nickname);
    }
    function init_account(bytes32 nickname) public{
            accounts[msg.sender].used=true;
            accounts[msg.sender].nickname=nickname;
            accounts_list.push(msg.sender);
            emit update_account();
    }
    function get_itemlist() public  returns(address[],bytes32[],bytes16[],int8[],int8[],bytes32[]){
        uint index = 0;
        address[]  memory seller_list = new address[](item_number);
        int8[]   memory  price_list = new int8[](item_number);
        int8[]    memory amount_list= new int8[](item_number);
        bytes16[]   memory  name_list= new bytes16[](item_number);
        bytes32[] memory item_id_list= new bytes32[](item_number);
        bytes32[] memory seller_name_list= new bytes32[](item_number);
        for(uint i=0;i<accounts_list.length;i++){
            for(uint j=0;j<accounts[accounts_list[i]].Selling_items_list.length;j++){
                var item_id = accounts[accounts_list[i]].Selling_items_list[j];
                seller_list[index]=accounts_list[i];
                seller_name_list[index]=accounts[accounts_list[i]].nickname;
                price_list[index]=accounts[accounts_list[i]].Selling_item[item_id].price;
                amount_list[index]=accounts[accounts_list[i]].Selling_item[item_id].amount;
                item_id_list[index]=item_id;
                name_list[index]=accounts[accounts_list[i]].Selling_item[item_id].name;
                index+=1;
            }
        }
        return(seller_list,item_id_list,name_list,price_list,amount_list,seller_name_list);
    }
    function modify_item(bytes32 item_id,bytes16 name,int8 _amount,int8 _price,string desc,string image) public{
        // if(vertify_user(user_adress,msg.sender) && vertify_item(user_adress,item_id)){
            Item temp = accounts[msg.sender].Selling_item[item_id];
            temp.amount=_amount;
            temp.name=name;
            temp.price=_price;
            descriptions[item_id]=desc;
            images[item_id]=image;
            emit update_items();
            // return true;
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
    function delete_item( bytes32 item_id) {
        // if(vertify_user(user_adress,msg.sender) && vertify_item(user_adress,item_id)){
            var user_adress=msg.sender;
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
            // return true;
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
    function buy_item(address seller_address,bytes32 item_id,int8 amount_of_buy,uint value,uint time) public{
        account buyer = accounts[msg.sender];
        account seller = accounts[seller_address];
        // msg.sender.transfer(value);
        // seller_address.transfer(this.balance);
        bytes32 buy_id = convert( buyer.trade_history_list.length);
        bytes32 sell_id = convert( seller.trade_history_list.length);
        Item i = accounts[seller_address].Selling_item[item_id];
        i.amount-=amount_of_buy;
        buyer.trade_history_list.push(buy_id);
        buyer.trade_history[buy_id].name = i.name;
        buyer.trade_history[buy_id].id =item_id;
        buyer.trade_history[buy_id].amount = amount_of_buy;
        buyer.trade_history[buy_id].value = value;
        buyer.trade_history[buy_id].time = time;
        buyer.trade_history[buy_id].trader = seller_address;
        buyer.trade_history[buy_id].trade_type =1;
        seller.trade_history_list.push(sell_id);
        seller.trade_history[sell_id].name = i.name;
        seller.trade_history[sell_id].id = item_id;
        seller.trade_history[sell_id].amount = amount_of_buy;
        seller.trade_history[sell_id].value = value;
        seller.trade_history[sell_id].time = time;
        seller.trade_history[sell_id].trader = msg.sender;
        seller.trade_history[sell_id].trade_type = 2;
        emit update_history();
    }
    function get_trade_history() public returns(uint[],bytes16[],bytes32[],int8[],uint[],bytes32[],int8[]){
        // uint index = 0;
        // var number = accounts[msg.sender].trade_history_list.length;
        bytes32[]  memory trader_list = new bytes32[]( accounts[msg.sender].trade_history_list.length);
        uint[]   memory  value_list = new uint[]( accounts[msg.sender].trade_history_list.length);
        int8[]    memory amount_list= new int8[]( accounts[msg.sender].trade_history_list.length);
        bytes16[]   memory  name_list= new bytes16[]( accounts[msg.sender].trade_history_list.length);
        bytes32[] memory item_id_list= new bytes32[]( accounts[msg.sender].trade_history_list.length);
        uint[] memory time_list=new uint[]( accounts[msg.sender].trade_history_list.length);
        int8[] memory trade_type_list = new int8[]( accounts[msg.sender].trade_history_list.length);
        for(uint j=0;j< accounts[msg.sender].trade_history_list.length;j++){
            var id = accounts[msg.sender].trade_history_list[j];
            // if(accounts[msg.sender].trade_history[id].trade_type==trade_type){
                trader_list[j]=accounts[accounts[msg.sender].trade_history[id].trader].nickname;
                value_list[j]=accounts[msg.sender].trade_history[id].value;
                amount_list[j]=accounts[msg.sender].trade_history[id].amount;
                item_id_list[j]=accounts[msg.sender].trade_history[id].id;
                name_list[j]=accounts[msg.sender].trade_history[id].name;
                time_list[j]=accounts[msg.sender].trade_history[id].time;
                trade_type_list[j]=accounts[msg.sender].trade_history[id].trade_type;
                // index+=1;
            // }
        }
        return(time_list,name_list,item_id_list,amount_list,value_list,trader_list,trade_type_list);
    }
}