import type {ButtonHTMLAttributes, ReactNode} from "react";
import styles from './Button.module.css';

// ghost np. dla "Clear All" z Dashboard
export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'login';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    icon?: ReactNode;   // opcjonalna ikona np. "+" dla "+ Add Employee", ReactNode dla uniwersalności (to odpowiada za wszystko,
    // co React potrafi wyrenderować
    children: ReactNode; // children jako tekst przycisku
}

// ...props - przekazujemy wszystkie pozostałe atrybuty HTML dla przycisku (takie jak onClick)
// do jednego obiektu nazwanego props, potem je przekazujemy używając <button {...props}>
export const Button = ({
                           children, variant = 'primary', icon, className = '', type = 'button', ...props
                       }: ButtonProps) => {
    // łączymy klasę bazową z klasą wariantu
    const combinedClassName = `${styles.base} ${styles[variant]} ${className}`.trim();
    return (
        <button type={type} className={combinedClassName} {...props}>
            {icon && <span className={styles.iconWrapper}>{icon}</span>}
            {children}
        </button>
    )
}