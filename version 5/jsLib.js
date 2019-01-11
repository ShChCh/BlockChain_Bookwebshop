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



// ------------------------------------------

// --------------- Cache --------------------

// ------------------------------------------

function CC_saveCookie(name, val){

    console.log("cookie ======1======== "+document.cookie);

    if(document.cookie.split(";").length>0)

        document.cookie = document.cookie + ";"

    else document.cookie = "";

    document.cookie = name + "=" +val;

    console.log("cookie ======2======== "+document.cookie);

}



function CC_getCookie(name){

    var ck = document.cookie;

    var ar = ck.split(";");

    for(var i=0; i<ar.length; i++)

        if(ar[i].split("=")[0] == name)

            return ar[i].split("=")[1];

    return "";

}





// https://firebasestorage.googleapis.com/v0/b/comp9900-13cd5.appspot.com/o/images%2Fcoffe.jpg?alt=media&token=613b80ae-9fd5-4582-a55b-83feb873bbdf

function CC_getImgStr(str){

    var imgres = str.split("images%2F");

    var imgdata = imgres[1].split("?");

    var imageName = imgdata[0];

    var token = imgdata[1].split("token=")[1];

    return imageName+"__"+token;

}

function CC_saveImgURL(str){

    console.log("Fuck this img: -- "+str);

    var imageName = str.split("__")[0];

    var token = str.split("__")[1];

    return "https://firebasestorage.googleapis.com/v0/b/comp9900-13cd5.appspot.com/o/images%2F"+imageName+"?alt=media&token="+token;

}

// ------------------------------------------

// --------------- Upload--------------------

// ------------------------------------------



function redirBtn(){

    document.querySelector('#uploadFileInput').click();

}

HP_setDomAttrById("IM_ImageBtn","onclick","redirBtn()");



var config = {

    apiKey: "AIzaSyC-giHs7IRTTvHYDrjisukXD0yhjJyiZE0",

    authDomain: "comp9900-13cd5.firebaseapp.com",

    databaseURL: "https://comp9900-13cd5.firebaseio.com",

    projectId: "comp9900-13cd5",

    storageBucket: "comp9900-13cd5.appspot.com",

    messagingSenderId: "77049547082"

};

firebase.initializeApp(config);

var storageRef = firebase.storage().ref();



var uploadedNewImg = "";

var uploadFileInput = document.getElementById("uploadFileInput");

console.log("Andrew: -- "+document.getElementById("uploadFileInput").files);

uploadFileInput.addEventListener("change", function(){

	var file = this.files[0];

  console.log(file.name);

  var uploadTask = storageRef.child('images/'+file.name).put(file);

  uploadTask.on('state_changed', function(snapshot){

    // Observe state change events such as progress, pause, and resume

    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

    console.log('Upload is ' + progress + '% done');

    switch (snapshot.state) {

      case firebase.storage.TaskState.PAUSED: // or 'paused'

        alert("Upload is paused, please try again");

        break;

      case firebase.storage.TaskState.RUNNING: // or 'running'

        break;

    }

  }, function(error) {

    // Handle unsuccessful uploads

        alert("Something wrong, please try again");

  }, function() {

    // Handle successful uploads on complete

    // For instance, get the download URL: https://firebasestorage.googleapis.com/...

    var downloadURL = uploadTask.snapshot.downloadURL;

    uploadedNewImg = downloadURL;

    alert("Uploading Successfully!");

    HP_setDomAttrById("IM_CurrentImg","src",uploadedNewImg);

    console.log(downloadURL);

  });

  // console.log(uploadTask.snapshot.downloadURL);

},false);

