import React, {Component} from 'react';


const list = [
    {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://redux.js.org/',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
    },
];

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            list,
        };

        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id; // ES6 arrow function
        const updatedList = this.state.list.filter(isNotId);
        this.setState({list: updatedList});
    }

    render() {
        return (
            <div className="App">
                {this.state.list.map(item =>
                    <div key={item.objectID}>
                        <span><a href={item.url}>{item.title}</a></span>
                        <span>{item.author}</span>
                        <span>{item.num_comments}</span>
                        <span>{item.points}</span>
                        <span>
                            {/*
                            -This function is already complex because it passes a value to the class method and has to
                            wrap it in another (arrow) function. */}
                            <button onClick={() => this.onDismiss(item.objectID)} type="button"> Dismiss</button>
                        </span>
                        <span>
                            {/*
                            -wouldn’t work if you are following along on a local React setup,
                            because the class method would be executed immediately when you open the application in the browser:*/}
                            {/*<button onClick={this.onDismiss(item.objectID)} type="button"> Dismiss</button>*/}

                            {/*
                            -using onClick={doSomething()}, the doSomething() function executes immediately
                            -using onClick={doSomething} where doSomething is a function, it would only be executed if the button is clicked
                            - However, using onClick={this.onDismiss} wouldn’t suffice,
                            because the item.objectID property needs to be passed to the class method to identify the item
                            that should be dismissed.
                            We wrap it into another function to sneak in the property. This concept is called higher-order functions
                            */}
                        </span>
                    </div>
                )}
            </div>
        );
    }
}

export default App;