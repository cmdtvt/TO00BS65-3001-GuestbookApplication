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
    

    fetch('/api/json').then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(json => {

        html = ""
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
        var name = document.querySelector("#name").value;
        var country = document.querySelector("#country").value;
        var message = document.querySelector("#message").value;
        console.log(name)
        /*
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/ajaxmessage', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            name:name,
            country:country,
            message:message
        }));
        */
        
        $.post( "/ajaxmessage", {name:name, country:country, message:message});

    })
}
