import React, { Component } from 'react';
import { 
    Stitch,
    RemoteMongoClient,
    AnonymousCredential
} from "mongodb-stitch-browser-sdk";
import DayPicker from 'react-day-picker';
import Post from './Post';
import BlankPage from './BlankPage';
import 'react-day-picker/lib/style.css';
import './Main.css';
const client = Stitch.initializeDefaultAppClient('react-post-egocq');
const morningPagesDB = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('morningpages');

class Main extends Component {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.helperCheckSameDay = this.helperCheckSameDay.bind(this);
        this.state = {
            today: new Date(),
            todaysPost: null,
            date: new Date(),
            pages: []
        };
    }

    helperDateToWMDY(date) {
        if (date !== null && date instanceof Date) {
            return date.toString().split(" ").slice(0, 4).join(" ");
        }   
    }

    helperCheckDayAlreadyPassed() {
        return this.state.today > this.state.date;
    }

    helperCheckSameDay() {
        return this.helperDateToWMDY(this.state.today) === this.helperDateToWMDY(this.state.date);
    }

    handleDayClick(day, { selected }) {
        this.setState({
            date: selected ? undefined : day,
        });
        this.getPostsForDate(this.state.date);
    }

    getPostsForDate() {
        client.auth.loginWithCredential(new AnonymousCredential()).then(user => 
            morningPagesDB.collection('posts').find({owner_id: client.auth.user.id, date: this.helperDateToWMDY(this.state.date)}, { limit: 100}).asArray()
            ).then(pages => {
                //console.log(pages);
                this.setState({pages});
                if (this.state.todaysPost === null) {
                    this.setState({todaysPost: this.getTextOfMostRecentPost()});
                    this.refs.blankpage.updateValue();
                }
            }).catch(err => {
                console.error(err);
            });
        
    }

    postPage(date, post) {
        console.log(post);
        client.auth.loginWithCredential(new AnonymousCredential()).then(user => 
            morningPagesDB.collection('posts')
            .insertOne({ owner_id : client.auth.user.id, date: date, post: post })
            .then(this.getPostsForDate())
        );
    }

    handlePagePost = (todaysPost) => {
        this.setState({todaysPost})
        this.postPage(this.helperDateToWMDY(this.state.today), todaysPost);
    }

    getTextOfMostRecentPost() {
        if (this.state.pages.length >0) {
            return this.state.pages[this.state.pages.length - 1].post;
        } return null;
    }

    componentWillMount() {
        this.getPostsForDate();
    }

    render() {
        return (
            <div className="Main">
                <div>
                    <h3><a href="https://juliacameronlive.com/basic-tools/morning-pages/" target="_blank" className="title">Morning Pages:</a> {this.helperDateToWMDY(this.state.date)}</h3>
                    <DayPicker
                        selectedDays={this.state.date}
                        onDayClick={this.handleDayClick}
                        disabledDays={[
                            {
                                before: new Date("Mon Oct 01 2018"),
                                after: new Date()
                            },
                        ]}
                    />
                </div>
                
                { ((this.state.pages.length && !this.helperCheckSameDay()) ? 
                    <Post post={this.getTextOfMostRecentPost()} /> 
                    : 
                    <BlankPage 
                        ref="blankpage" 
                        date = {this.helperDateToWMDY(this.state.date)}
                        blogText={this.state.todaysPost} 
                        today={this.helperCheckSameDay()} 
                        past={this.helperCheckDayAlreadyPassed()} 
                        onPostPage={this.handlePagePost.bind(this)}
                    /> 
                )}
            </div>
        );
    }
}
  
export default Main;