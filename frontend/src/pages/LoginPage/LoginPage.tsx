import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {type LoginFormInputs, loginSchema} from './loginSchema';
import {Button} from '../../components/common/Button/Button';
import EmailIcon from '../../assets/icons/Email.svg';
import PasswordIcon from '../../assets/icons/Password.svg';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = (data: LoginFormInputs) => {
        console.log('Validated payload ready for submission:', data);
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
                        variant="primary"
                        disabled={isSubmitting}
                        children={isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
                    />
                </form>
            </div>
        </div>
    );
};