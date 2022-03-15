//Not maby the best way to handle running javascript on different pages but i want to try it out. Get the page name and run javascript designated for it.
document.addEventListener("DOMContentLoaded",function(){
    var currentPage = window.location.pathname.split("/").pop();
    
    switch (currentPage) {
        case "guestbook":
            loadGuestbook("#guestbook-data");
            break;

        case "newmessage":
            //test()
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
