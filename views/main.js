let password = null;
const navbar = $("#nav");

function loadData() {
    axios.get("/api/list", {
        headers: {
            'authorization': password
        }
    }).then(response => {
        const pages = response.data;
        const navbarItems = pages.map(page => {
            return `<li href="#${page}" style="margin: 10px; text-align: center; list-style: none; min-height: 32px; border-radius: 3px; border: black solid 1px;">${page}</li>`;
        });
        navbar.append(navbarItems);
    
        $("li[href]").click(function() {
            window.location.href = $(this).attr("href");
        });
    });
    
    async function checkHash() {
        document.getElementById('md').innerHTML = "";
        
        if (document.location.hash.startsWith("#")) {
            try {
                const {data} = await axios.get(document.location.origin + '/api/get?title=' + document.location.hash.substring(1).toLowerCase(), {
                    headers: {
                        authorization: password
                    }
                });
    
                document.getElementById('md').innerHTML = marked.parse(data.content);
            } catch (e) {
                toastr.error(e.response.data);
            }
        } else {
            document.location.hash = "#home";
        }
    }
    
    checkHash();
    
    window.addEventListener("hashchange", function(event) {
        checkHash();
    });
}