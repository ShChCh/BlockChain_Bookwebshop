function HP_newElement(tag){

    var newElement = document.createElement(tag);

    return newElement;

}

function HP_getDomValById(domId){

    var dom = document.getElementById(domId);

    return dom.value;

}

function HP_setDomAttrArr(dom, attrNameArr, attrValArr, len){

    var i = 0;

    for(;i<len; i++){

        dom.setAttribute(attrNameArr[i], attrValArr[i]);

    }

}

function HP_setDomAttr(dom, attrName, attrVal){

        dom.setAttribute(attrName, attrVal);

}

function HP_setDomAttrById(domId, attrName, attrVal){

        var dom = document.getElementById(domId);

        dom.setAttribute(attrName, attrVal);

}

function HP_getDomAttr(dom, attrName){

        return dom.getAttribute(attrName);

}

function HP_getDomAttrById(domId, attrName){

        var dom = document.getElementById(domId);

        return dom.getAttribute(attrName);

}

function HP_setInnerHtmlById(domId, html){

    var itemSec = document.getElementById(domId);

    itemSec.innerHTML = html;

}

function HP_getInnerHtmlById(domId){

    var itemSec = document.getElementById(domId);

    return itemSec.innerHTML;

}

function HP_rmvDomAttr(dom, attrName){

        dom.removeAttribute(attrName);

}

function HP_addDomToParentById(domChild, domParentId){HP_setDomAttrById

    var paraElement = document.getElementById(domParentId);

    paraElement.appendChild(domChild);

}

function HP_rmvDomById(domId){

    var dom = document.getElementById(domId);

    HP_rmvDom(dom);

}

function HP_rmvDom(dom){

    domParent = dom.parentNode;

    domParent.removeChild(dom);

}

function HP_cloneDomById(domId){

    var itemSec = document.getElementById(domId);

    console.log(itemSec);

    var newItem = itemSec.cloneNode(true);

    return newItem;

}

function HP_cleanDomAllChild(domId, part, noWindow){

    if(noWindow || confirm('Clean all your items in '+part+'?')){

        var myNode = document.getElementById(domId);

        while (myNode.firstChild) {

            myNode.removeChild(myNode.firstChild);

        }

    }

    else{

        console.log('canceled');

    }

}

/////////////////////////////// modify by G

function HP_arrGetInfoById(id){

    // var itemInfoArr=App.Items_list;

    // console.log(itemInfoArr);

    for(var key in App.Items_list){

        if(App.Items_list[key][0]===id)

            return App.Items_list[key];

    }

    return null;

}

/////////////////////////////// modify by G

function HP_arrGetSellInfoById(id){

    // var sellItemInfoArr=App.Selling_items;

    for(var key in App.Selling_items ){

        if(App.Selling_items[key][0]===id)

            return App.Selling_items[key];

    }

    return null;

}


function HP_arrIdxRandomNoredun(count){

    var originalArray=new Array;

    for (var i=0;i<count;i++){ 

    originalArray[i]=i+1; 

    } 

    var d1=new Date().getTime(); 

    originalArray.sort(function(){ return 0.5 - Math.random(); }); 

    return originalArray;

}

function HP_getValInCookie(valName){

    var strCookie=document.cookie; 


    var arrCookie=strCookie.split("; "); 

    var val; 


    for(var i=0;i<arrCookie.length;i++){ 

            var arr=arrCookie[i].split("="); 

            if(valName==arr[0]){ 

                    val=arr[1]; 

                    return val; 

            } 

    } 

    return null;

}

function HP_setValInCookie(valName, valVal){

    var strCookie=document.cookie; 

    document.cookie = "";

}

// ------junmp-------

function HP_JumpProcSectionVisual(sectionId){

    HP_rmvDomAttr(document.getElementById(sectionId), "hidden");

}

function HP_JumpProcSectionInvisual(sectionId){

    HP_setDomAttrById(sectionId, "hidden","");

}

function HP_JumpProcScollVisual(btnId){

    HP_rmvDomAttr(document.getElementById(btnId), "style");

}

function HP_JumpProcScollInvisual(btnId){

    HP_setDomAttrById(btnId, "hidden","");

}



// ------------------------------------------

// --------------- Work Flow ----------------

// ------------------------------------------

function WF_currentSectionFocus(sectionId){

    console.log("login 1 "+sectionId);

    if(sectionId !== "loginpage" && sectionId !== "Item_Information" &&  sectionId !== "Searching_Items" && !SE_checkSteps(false)){
        WF_currentSectionFocus("loginpage");

        HP_JumpProcSectionInvisual("UM_TU_WD");
        return;

    }

    console.log("login 2 " + sectionId);

    HP_JumpProcSectionVisual("UM_TU_WD");
    var sectionNames = ["Item_Information","shoppingCart","Selling_item","Searching_Items","ModifyItems","portfolio", "loginpage"];

    for(var i=0; i<sectionNames.length; i++){

        if(sectionNames[i] == sectionId)

            HP_JumpProcSectionVisual(sectionId);

        else{

            HP_JumpProcSectionInvisual(sectionNames[i]);

            console.log(sectionNames[i]);

        }

    }

    if(sectionId=="shoppingCart" && document.getElementById("SC_List").children.length==0){

        console.log("ggg");

        SC_loadCache();

    }

}

function WF_sellingSection(){

    SI_init();

    WF_currentSectionFocus("Selling_item");

}

function WF_transactionSection(){

    TH_init();

    WF_currentSectionFocus("portfolio");

}

