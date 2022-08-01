import React from 'react';
import styles from './Home.module.css';

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Leo a diam sollicitudin tempor id eu nisl nunc mi. Turpis egestas integer eget aliquet nibh praesent. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Consectetur adipiscing elit duis tristique. Volutpat odio facilisis mauris sit amet massa. Maecenas sed enim ut sem viverra aliquet eget sit amet. Ut consequat semper viverra nam libero justo laoreet. Auctor neque vitae tempus quam. Vitae purus faucibus ornare suspendisse sed nisi lacus sed. Dolor sit amet consectetur adipiscing. Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Bibendum est ultricies integer quis auctor elit sed vulputate mi. Scelerisque varius morbi enim nunc faucibus. Purus sit amet volutpat consequat. Sed faucibus turpis in eu mi. Leo a diam sollicitudin tempor id. Dui vivamus arcu felis bibendum ut tristique et egestas. Aliquam etiam erat velit scelerisque in dictum non consectetur a.';

class Home extends React.Component {
  render() {
    const displayHomePage = 
      <div>
        <h2 className={styles.about}>About</h2>
        <p className={styles.aboutParagraph}>
          {lorem}
        </p>
        <div className={styles.shoutOutContainer}>
          <h2 className={styles.shoutOut}>
            Shout outs to...
          </h2>
          <div>
            <strong>Font Awesome</strong> for the use of there amazing icon library!
          </div>
          <div>
            <strong>sketch.io</strong> for there awesome creative tool that I used to create the little drawing on the confirmation page!
          </div>
          <div>
            <strong>commerce.js</strong> for the use of there super easy to use API!
          </div>
        </div>
      </div>
    ;
    return(
      <div>
        {displayHomePage}
      </div>
    )
  }
}

export default Home;