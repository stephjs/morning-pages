import React, { Component } from 'react';
import './BlankPage.css';
const msg = `This space is yours! Write whatever you want or nothing at all.`;

class BlankPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          value:  (this.props.blogText !== null) ? this.props.blogText : msg
        };
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.props.onPostPage(this.state.value);
    }

    updateValue() {
        if (this.props.blogText !== null && this.state.value === msg) {
            this.setState({value: this.props.blogText});
        }
    }

    render() {
        if (!this.props.today) {
            if (this.props.past) {
                return (
                    <div className="emptytext">
                        You forgot to write... :(
                    </div>
                );
            } else {
                return (
                    <div className="emptytext">
                        Come back on {this.props.date} to write.
                    </div>
                );
            }
            
        }
        return (
            <div className="BlankPage">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <textarea 
                        value={this.state.value} 
                        onChange={this.handleChange.bind(this)} />
                    <input type="submit" value="Save" />
                </form>
            </div>
        );
    }
}
  
export default BlankPage;