document.addEventListener('DOMContentLoaded', () => {
    showLogin();

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.success) {
                window.location.href = '/home';
                loadFilesPage();
                console.log('Logged in successfully!')
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.success) {
                alert('Registration successful! You can now log in.');
                showLogin();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });
});

function showLogin() {
    document.getElementById('login-box').classList.add('active');
    document.getElementById('register-box').classList.remove('active');
}

function showRegister() {
    document.getElementById('register-box').classList.add('active');
    document.getElementById('login-box').classList.remove('active');
}

async function loadFilesPage() {
    try {
        const response = await fetch('/home.html');
        const filesPageContent = await response.text();
        document.body.innerHTML = filesPageContent;
    } catch (error) {
        console.error('Error loading files page:', error);
        alert('An error occurred while loading the files page.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch the username from local storage or a server
    const username = localStorage.getItem('username') || 'User';
    document.getElementById('username').textContent = username;
});
document.addEventListener('DOMContentLoaded', () => {
    // Function to handle language change
    document.getElementById('language-dropdown').addEventListener('change', async (e) => {
        const selectedLanguage = e.target.value;
        await changeLanguage(selectedLanguage);
    });

    async function changeLanguage(lang) {
        try {
            const response = await fetch(`/translate?lang=${lang}&messageKey=home_page`);
            const result = await response.json();
            
            document.querySelector('.content h1').innerHTML = `Welcome, <span id="username">User</span>!`;
            document.querySelector('.content h2').textContent = result.message.title;
            document.querySelector('.content h3').textContent = result.message.welcome;

        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Initial load of translations
    changeLanguage('english'); // Default language
});