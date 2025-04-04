/*
document.addEventListener('DOMContentLoaded', function() {
    if (new URLSearchParams(window.location.search).has('error')) {
        document.getElementById('error-message').textContent = 'Invalid user ID, password, or role.';
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Perform basic validation
    if (userId === '' || password === '' || role === '') {
        document.getElementById('error-message').textContent = 'Please fill in all fields.';
        return;
    }
	sessionStorage.setItem('userId', userId);
    document.getElementById('loginForm').submit();
});
*/

/*
document.addEventListener('DOMContentLoaded', function() {
    if (new URLSearchParams(window.location.search).has('error')) {
        document.getElementById('error-message').textContent = 'Invalid user ID, password, or role.';
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Perform basic validation
    if (userId === '' || password === '' || role === '') {
        document.getElementById('error-message').textContent = 'Please fill in all fields.';
        return;
    }

    // Send login request to the backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ username: userId, password: password, role: role })
    })
    .then(response => {
        if (response.ok) {
            // Store user ID in session storage
            sessionStorage.setItem('userId', userId);

            // Show success popup
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'You will be redirected shortly.',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                // Redirect based on role
                if (role === 'ADMIN') {
                    window.location.href = '/admin';
                } else if (role === 'MANAGER') {
                    window.location.href = '/manager';
                }
            });
        } else {
            document.getElementById('error-message').textContent = 'Invalid user ID, password, or role.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
    });
});
*/

document.addEventListener('DOMContentLoaded', function() {
    if (new URLSearchParams(window.location.search).has('error')) {
		Swal.fire({
		    icon: 'error',
		    title: 'Login Failed',
		    text: 'Invalid Credentials.',
		    showConfirmButton: false,
		    timer: 1500
		});
    }

    if (new URLSearchParams(window.location.search).has('success')) {
        Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have been successfully logged in.',
            showConfirmButton: false,
            timer: 1500
        });
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Perform basic validation
    if (userId === '' || password === '' || role === '') {
        document.getElementById('error-message').textContent = 'Please fill in all fields.';
        return;
    }
	sessionStorage.setItem('userId', userId);
	sessionStorage.setItem('role', role);
    document.getElementById('loginForm').submit();
});