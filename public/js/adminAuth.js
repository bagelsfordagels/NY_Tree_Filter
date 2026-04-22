const form = document.getElementById('adminLogin');

if (form) {
    form.addEventListener("submit", loginAdmin);
}

//Login
async function loginAdmin(e){
    e.preventDefault();
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    error.innerText = "";
    if(!password){
        error.innerText = "Please enter a Password";
        return;
    }

    try{
        const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password })
        });
        const data = await response.json();

        if(response.ok){
            sessionStorage.setItem("admin", JSON.stringify(data));
            window.location.href = "admin.html";
        } 

        else {
            error.innerText = data.message || "Login failed";
        }
    }catch(err){
        error.innerText = "Server error. Please try again.";
    }
}

//check if Admin
export function checkAdmin() {
    const admin = JSON.parse(sessionStorage.getItem("admin"));
    if (!admin ||!admin.isAdmin) {
        window.location.href = "adminLogin.html";
    }
}

//Logout
export function logout() {
    const page = window.location.pathname.split("/").pop();
    sessionStorage.removeItem("admin");
    switchBtn();
    if(page !== "index.html" && page !== "search.html"){
        window.location.href = "index.html";
    }    
}

//button switch
const authBtn = document.getElementById("authBtn");
const adminBtn = document.getElementById("adminBtn");
export function switchBtn(){
    if(!authBtn){
        return;
    }

    const admin = JSON.parse(sessionStorage.getItem("admin"));
    if(admin && admin.isAdmin){
        authBtn.innerText = "Logout";
        authBtn.classList.add("logout");
        authBtn.classList.remove("login");
        authBtn.onclick = logout;
    }
    else{
        authBtn.innerText = "Admin Login";
        authBtn.classList.add("login");
        authBtn.classList.remove("logout");
        authBtn.onclick = function(){
            window.location.href = "adminLogin.html";
        }
    }

        if (adminBtn) {
        if (admin && admin.isAdmin) {
            adminBtn.style.display = "block";
            adminBtn.textContent = "Admin Page";
            adminBtn.onclick = () => {
                window.location.href = "admin.html";
            };
        } else {
            adminBtn.style.display = "none";
        }
    }
}

switchBtn();