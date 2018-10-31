import React, { Component } from 'react';
import './Post.css';

class Post extends Component {
    
    render() {
        return (
            <div className="Post">
                {this.props.post}
            </div>
        );
    }
}
  
export default Post;