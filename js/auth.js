// ======================================
// SecureAuth - Authentication
// ======================================

// Get registered users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("secureAuthUsers")) || [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem("secureAuthUsers", JSON.stringify(users));
}


// ======================================
// REGISTER USER
// ======================================

function registerUser(event) {
    event.preventDefault();

    const fullName = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("registerRole").value;

    if (!fullName || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const users = getUsers();

    const existingUser = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        alert("An account with this email already exists.");
        return;
    }

    const newUser = {
    id: Date.now(),
    fullName: fullName,
    email: email,
    password: password,
    role: role
};
    users.push(newUser);
    saveUsers(users);

    alert("Account created successfully!");

    window.location.href = "index.html";
}


// ======================================
// LOGIN USER
// ======================================

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    const users = getUsers();

    const user = users.find(
        user =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
    );

    if (!user) {
        message.textContent = "Invalid email or password.";
        message.className = "message error";
        return;
    }

    localStorage.setItem(
        "secureAuthCurrentUser",
        JSON.stringify(user)
    );

    message.textContent = "Login successful!";
    message.className = "message success";

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);
}


// ======================================
// LOGOUT USER
// ======================================

function logoutUser() {
    localStorage.removeItem("secureAuthCurrentUser");

    window.location.href = "index.html";
}


// ======================================
// CHECK LOGIN
// ======================================

function checkLogin() {
    const currentUser = localStorage.getItem("secureAuthCurrentUser");

    if (!currentUser) {
        window.location.href = "index.html";
    }
}


// ======================================
// GET CURRENT USER
// ======================================

function getCurrentUser() {
    const currentUser = localStorage.getItem("secureAuthCurrentUser");

    if (!currentUser) {
        return null;
    }

    return JSON.parse(currentUser);
}


// ======================================
// CONNECT LOGIN FORM
// ======================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
}


// ======================================
// CONNECT REGISTER FORM
// ======================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", registerUser);
}

// ======================================
// CONNECT LOGOUT BUTTON
// ======================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
}
// ======================================
// SHOW / HIDE PASSWORD
// ======================================

const togglePassword = document.getElementById("togglePassword");
const loginPassword = document.getElementById("loginPassword");

if (togglePassword && loginPassword) {
    togglePassword.addEventListener("click", function () {

        if (loginPassword.type === "password") {
            loginPassword.type = "text";
            togglePassword.textContent = "Hide";
        } else {
            loginPassword.type = "password";
            togglePassword.textContent = "Show";
        }

    });
}
