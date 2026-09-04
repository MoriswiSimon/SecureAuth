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

    // Check if passwords match
    if (password !== confirmPassword) {
        const passwordMatchMessage = document.getElementById("passwordMatchMessage");

        passwordMatchMessage.textContent = "✗ Passwords do not match.";
        passwordMatchMessage.classList.add("no-match");
        passwordMatchMessage.classList.remove("match");

        return;
    }

    // Check password length
    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const users = getUsers();

    // Check if email already exists
    const existingUser = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        alert("An account with this email already exists.");
        return;
    }

    // Create new user
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

    if (user.role === "Admin") {
        window.location.href = "admin-dashboard.html";
    }

    else if (user.role === "Supervisor") {
        window.location.href = "supervisor-dashboard.html";
    }

    else if (user.role === "Employee") {
        window.location.href = "employee-dashboard.html";
    }

    else if (user.role === "Learner") {
        window.location.href = "learner-dashboard.html";
    }

    else {
        window.location.href = "dashboard.html";
    }

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


// ======================================
// PASSWORD STRENGTH CHECKER
// ======================================

const registerPassword = document.getElementById("registerPassword");
const strengthBar = document.getElementById("strengthBar");
const passwordStrength = document.getElementById("passwordStrength");

if (registerPassword && strengthBar && passwordStrength) {

    registerPassword.addEventListener("input", function () {

        const password = registerPassword.value;

        let strength = 0;

        // Check password length
        if (password.length >= 8) {
            strength++;
        }

        // Check for lowercase letters
        if (/[a-z]/.test(password)) {
            strength++;
        }

        // Check for uppercase letters
        if (/[A-Z]/.test(password)) {
            strength++;
        }

        // Check for numbers
        if (/[0-9]/.test(password)) {
            strength++;
        }

        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) {
            strength++;
        }


        // Reset when password is empty
        if (password.length === 0) {

            strengthBar.style.width = "0%";

            passwordStrength.innerHTML =
                'Password strength: <span>None</span>';
        }


        // Weak password
        else if (strength <= 2) {

            strengthBar.style.width = "33%";
            strengthBar.style.backgroundColor = "#ef4444";

            passwordStrength.innerHTML =
                'Password strength: <span>Weak</span>';
        }


        // Medium password
        else if (strength <= 4) {

            strengthBar.style.width = "66%";
            strengthBar.style.backgroundColor = "#f59e0b";

            passwordStrength.innerHTML =
                'Password strength: <span>Medium</span>';
        }


        // Strong password
        else {

            strengthBar.style.width = "100%";
            strengthBar.style.backgroundColor = "#22c55e";

            passwordStrength.innerHTML =
                'Password strength: <span>Strong</span>';
        }

    });
}


// ======================================
// CONFIRM PASSWORD VALIDATION
// ======================================

const confirmPassword = document.getElementById("confirmPassword");
const passwordMatchMessage = document.getElementById("passwordMatchMessage");

if (confirmPassword && registerPassword && passwordMatchMessage) {

    confirmPassword.addEventListener("input", function () {

        const password = registerPassword.value;
        const confirm = confirmPassword.value;


        // Nothing typed yet
        if (confirm.length === 0) {

            passwordMatchMessage.textContent = "";

            passwordMatchMessage.classList.remove(
                "match",
                "no-match"
            );
        }


        // Passwords match
        else if (password === confirm) {

            passwordMatchMessage.textContent =
                "✓ Passwords match.";

            passwordMatchMessage.classList.add("match");

            passwordMatchMessage.classList.remove("no-match");
        }


        // Passwords do not match
        else {

            passwordMatchMessage.textContent =
                "✗ Passwords do not match.";

            passwordMatchMessage.classList.add("no-match");

            passwordMatchMessage.classList.remove("match");
        }

    });

}