pragma solidity ^0.4.18;
contract Owned {
    address owner;
    
    function Owned() public {
        owner = msg.sender;
    }
    
   modifier onlyOwner {
       require(msg.sender == owner);
       _;
   }
}
contract ShopingItem {
    struct Item{
        bytes16 name;
        int8 amount;
        int8 price;
        address seller;
        // uint id;
    }
    mapping(address => Item) Items;
    
    Item[] public Itemlist;
    // event iteminfo (
    //     address[]  seller_list,
    //     int8[]     price_list,
    //     int8[]     amount_list,
    //     bytes16[]     name_list
        
    // );
    function sellitem(bytes16 _name, int8 _amount, int8 _price)  public {
        // address _address = msg.sender;
        Item memory temp = Items[msg.sender];
        temp.name = _name;
        temp.amount=_amount;
        temp.price=_price;
        temp.seller=msg.sender;
        // temp.id=Itemlist.length;
        Itemlist.push(temp) -1 ;
    }
    
    function get_itemlist() view public returns(bytes16[],int8[],int8[],address[]){
        address[] memory seller_list = new address[](Itemlist.length);
        int8[]    memory price_list = new int8[](Itemlist.length);
        int8[]    memory amount_list = new int8[](Itemlist.length);
        bytes16[]    memory name_list = new bytes16[](Itemlist.length);
        
        for (uint i = 0; i < Itemlist.length; i++) {
            Item storage item = Itemlist[i];
            seller_list[i] = item.seller;
            price_list[i] = item.price;
            amount_list[i] = item.amount;
            name_list[i] = item.name;
        }
        // iteminfo(seller_list,price_list,amount_list,name_list);
        return (name_list,price_list,amount_list,seller_list);
    }
}