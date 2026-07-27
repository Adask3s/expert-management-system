import styles from './UserAvatar.module.css';
import userIcon from '../../../assets/icons/Person.svg'; // ścieżka do naszej ikonki usera

interface UserAvatarProps {
    altText?: string;
}

export const UserAvatar = ({altText = 'User Avatar'}: UserAvatarProps) => {
    return (
        <div className={styles.avatarWrapper}>
            <img src={userIcon} alt={altText} className={styles.avatarIcon}/>
        </div>
    );
};