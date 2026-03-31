import { useCallback, useState } from 'react';
import styles from './SearchUI.module.css';

const UserSearchUI = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'exists', 'notFound', 'error'
    const [message, setMessage] = useState('');

    const isValidEmail = (email) => {
        // Basic regex for email validation
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    };

    const handleSearch = useCallback(async () => {
        if (!isValidEmail(email)) {
        setStatus('error');
        setMessage('Please enter a valid email address.');
        return;
        }

        setStatus('loading');
        setMessage('Searching for user...');

        try {
        // Simulate API call
        // Replace with your actual API endpoint
        const response = await new Promise(resolve => setTimeout(() => {
            // Mock data: user exists if email includes 'example'
            if (email.includes('example.com')) {
                resolve({ status: 200, data: { found: true } });
            } else {
                resolve({ status: 200, data: { found: false } });
            }
        }, 1500));

        if (response.data.found) {
            setStatus('exists');
            setMessage(`User with email: ${email} found!`);
        } else {
            setStatus('notFound');
            setMessage(`No user found for email: ${email}`);
        }
        } catch (err) {
            setStatus('error');
            setMessage('An error occurred during search. Please try again.');
        }
    }, [email]);

    const statusClass = {
        idle: '',
        loading: styles.loading,
        exists: styles.exists,
        notFound: styles.notFound,
        error: styles.error,
    }[status];

    return (
        <div className={styles.container}>
            <h2>Find a User by Email</h2>
            <div className={styles.form}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        // Clear status and message when the user starts typing again
                        if (status !== 'idle' && status !== 'loading') {
                            setStatus('idle');
                            setMessage('');
                        }
                    }}
                    placeholder="Enter user email address"
                    className={styles.input}
                    aria-label="Email address search input"
                />
                <button
                    onClick={handleSearch}
                    disabled={status === 'loading'}
                    className={styles.button}
                >
                    {status === 'loading' ? 'Searching...' : 'Search'}
                </button>
            </div>
            {message && (
                <div className={`${styles.message} ${statusClass}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default UserSearchUI;
