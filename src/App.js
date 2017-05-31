import React, { Component } from 'react';
import { FlickrGrid } from './Flickr';
import './App.css';

class App extends Component {
    render() {
        return (
                <div className="App">
                    <FlickrGrid />
                </div>
        );
    }
}

export default App;
