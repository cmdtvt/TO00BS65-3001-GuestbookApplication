//Not maby the best way to handle running javascript on different pages but i want to try it out. Get the page name and run javascript designated for it.
document.addEventListener("DOMContentLoaded",function(){
    var currentPage = window.location.pathname.split("/").pop();
    
    switch (currentPage) {
        case "guestbook":
            loadGuestbook("#guestbook-data");
            break;

        case "newmessage":
            prepareAjaxForm();
            break;

        case "ajaxmessage":
            test()
            break;
    
        default:
            console.log(currentPage)
            break;
    }
});

function test(anchor="main") {
    anchor = document.querySelector(anchor);
    anchor.innerHTML = "This is a test message";
}

function loadGuestbook(anchor="main") {
    anchor = document.querySelector(anchor);
    
    //Request things from the json api
    fetch('/api/json').then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(json => {

        html = ""
        //Loop all data from json into a tempalte and render on page.
        for (const d of json) {
            template = `
            <tr>
            <th scope="row">${d.id}</th>
            <td>${d.username}</td>
            <td>${d.country}</td>
            <td>${d.date}</td>
            <td>${d.message}</td>
            </tr>
            `;
            html += template
        }
        
        anchor.innerHTML = html;

    })
    .catch(function (e) {
        console.log(e)
    })
}

function prepareAjaxForm(){
    console.log("Preparing")
    
    document.querySelector("#submit-ajax").addEventListener("click",function(){

        //Get all input values
        var name = document.querySelector("#name").value;
        var country = document.querySelector("#country").value;
        var message = document.querySelector("#message").value;

        //Do ajax call to /ajaxmessage
        $.ajax({
            url : "/ajaxmessage",
            type: "POST",
            data : {
                name:name,
                country:country,
                message:message
            },
            success: function(data, textStatus, jqXHR) {

                /*if sent ajaxpost is successful the server will respond with dictionary {success:true,reason:""}
                
                Depending on success variable we can display green or red alert box. If we display the red one we will also add passed reason that has the error message from the server side.
                
                */

                ab = document.querySelector("#alertbox")
                if(data.success == true) {
                    ab.classList.remove("hide")
                    ab.classList.add("alert-success")
                    ab.classList.remove("alert-danger")
                    ab.innerHTML = "Saving successful!"
                    
                    //We clear the inputs if ajaxpost was successful
                    document.querySelector("#name").value = "";
                    document.querySelector("#country").value = "";
                    document.querySelector("#message").value = "";

                } else {
                    ab.classList.remove("hide")
                    ab.classList.remove("alert-success")
                    ab.classList.add("alert-danger")
                    ab.innerHTML = "Saving failed: "+data.reason
                }

                //Hide the alert box after some seconds
                setTimeout(function() {
                    ab.classList.add("hide")
                }, 15000);


            },
            error: function (jqXHR, textStatus, errorThrown) {
                ab.classList.remove("hide")
                ab.classList.remove("alert-success")
                ab.classList.add("alert-danger")
                ab.innerHTML = "Saving failed: Problem sending Ajax"
            }
        });

    })
}
