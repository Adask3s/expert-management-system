import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {type LoginFormInputs, loginSchema} from '../../validations/loginSchema';
import {Button} from '../../components/common/Button/Button';
import {useLogin} from '../../hooks/useLogin';
import {useNavigate} from 'react-router-dom';
import EmailIcon from '../../assets/icons/Email.svg';
import PasswordIcon from '../../assets/icons/Password.svg';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors}
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema)
    });

    const {mutate: loginMutation, isPending} = useLogin();
    const navigate = useNavigate();

    const onSubmit = (data: LoginFormInputs) => {
        loginMutation(data, {
            onSuccess: (response) => {
                // Zapisujemy token w localStorage
                localStorage.setItem('accessToken', response.accessToken);

                // Po udanym logowaniu przekierowujemy użytkownika na stronę dashboard
                navigate('/dashboard', {replace: true});
            },
            onError: () => {
                // Ustawiamy błąd formularza (na obiekcie password, żeby pokazać cokolwiek pod formularzem)
                setError('password', {type: 'manual', message: 'Invalid email or password.'});
            }
        });
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <h2>LOGIN</h2>
                    <p>EXPERT MANAGEMENT SYSTEM</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <img src={EmailIcon} alt="Email" className={styles.inputIcon}/>
                            <input
                                type="email"
                                placeholder="Email ID"
                                {...register('email')}
                                className={errors.email ? styles.inputError : ''}
                            />
                        </div>
                        {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <img src={PasswordIcon} alt="Password" className={styles.inputIcon}/>
                            <input
                                type="password"
                                placeholder="Password"
                                {...register('password')}
                                className={errors.password ? styles.inputError : ''}
                            />
                        </div>
                        {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
                    </div>

                    <Button
                        type="submit"
                        variant="login"
                        disabled={isPending}
                        children={isPending ? 'LOGGING IN...' : 'LOGIN'}
                    />
                </form>
            </div>
        </div>
    );
};