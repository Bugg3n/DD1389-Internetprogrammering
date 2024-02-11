console.log("vi är i client.js")

function changetext(){
    // document.getElementById("test").innerHTML="";
    document.getElementById("ref1").remove();
    fetch("/logoutall");
        //Request1.open("GET","logoutall");
        /* Request1.opened= () => {
            ReqestsObj1.innerHTML = ""
        } */
    /*     Request1.onreadstatechange = function() {
            if (Request1.readyState == 4 && Request1.status==200){
            }
        } */
    }
