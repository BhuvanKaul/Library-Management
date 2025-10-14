import styles from './Login.module.css'

function Login() {

    const handleGoogleLogin = ()=>{
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = 'http://localhost:5173/auth/callback';

        const scope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
        ].join(' ');

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

        window.location.href = authUrl;
    }

   return (
    <div className={styles.loginContainer}>
        <h2>Library Management System</h2>
        <p>Please sign in to continue</p>
        <button className={styles.googleLoginButton} onClick={handleGoogleLogin}>
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
            Sign in with Google
        </button>
    </div>
    );
}

export default Login