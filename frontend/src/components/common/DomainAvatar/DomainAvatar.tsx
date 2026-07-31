import defaultStackIcon from '../../../assets/icons/DefaultStack.svg';
import styles from './DomainAvatar.module.css';

export const DomainAvatar = () => {
    return (
        <div className={styles.iconWrapper}>
            <img src={defaultStackIcon} alt="" aria-hidden="true" className={styles.icon}/>
        </div>
    );
};