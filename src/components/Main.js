import React, { Component } from 'react';
import { 
    Stitch,
    RemoteMongoClient,
    AnonymousCredential
} from "mongodb-stitch-browser-sdk";
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
const client = Stitch.initializeDefaultAppClient('react-post-egocq');
const morningPagesDB = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('morningpages');

class Main extends Component {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.helperCheckSameDay = this.helperCheckSameDay.bind(this);
        this.state = {
            today: new Date(),
            date: new Date(),
            pages: []
        };
    }

    helperShortDay(date) {
        // Date to dd MM DD YYYY for post
        if (date !== null && date instanceof Date) {
            return date.toString().split(" ").slice(0, 4).join(" ");
        }   
    }

    helperCheckSameDay() {
        return this.helperShortDay(this.state.today) == this.helperShortDay(this.state.date);
    }

    handleDayClick(day, { selected }) {
        this.setState({
            date: selected ? undefined : day,
        });
        this.getPostsForDate(this.state.date);
    }

    getPostsForDate() {
        client.auth.loginWithCredential(new AnonymousCredential()).then(user => 
            morningPagesDB.collection('posts').find({owner_id: client.auth.user.id, date: this.helperShortDay(this.state.date)}, { limit: 100}).asArray()
            ).then(pages => {
                console.log(pages);
                this.setState({pages});
            }).catch(err => {
                console.error(err);
            });
    }

    componentWillMount() {
        this.getPostsForDate();
    }

    render() {
        return (
            <div className="Main">
                <div>
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
                
                {                 
                    (this.state.pages.length ? this.state.pages[0].post : `*`)
                }
            </div>
        );
    }
}
  
export default Main;