import React from 'react';
import styles from '../User/User.module.css';

class User extends React.Component {
  render() {
    const { userInfo, logoutButton } = this.props
    const { firstName, lastName, email, phoneNumber } = userInfo;

    return(
      <div className={styles.userContainer}>
        <div className={styles.infoContainer}>
          <div className={styles.innerInfoContainer}>
            <div className={`${styles.individualInfoContainer} ${styles.firstName}`}><div className={styles.infoHeader}>First Name:</div> {firstName}</div>
            <div className={`${styles.individualInfoContainer} ${styles.lastName}`}><div className={styles.infoHeader}>Last Name:</div> {lastName}</div>
            <div className={`${styles.individualInfoContainer} ${styles.email}`}><div className={styles.infoHeader}>Email:</div> {email}</div>
            <div className={`${styles.individualInfoContainer} ${styles.phoneNumber}`}><div className={styles.infoHeader}>Phone Number:</div> {phoneNumber}</div>
          </div>
        </div>
        <div className={styles.logoutButtonContainer}>
          {logoutButton}
        </div>
      </div>
    )
  }
}

export default User;