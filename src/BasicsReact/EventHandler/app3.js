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
                            This method will run when you open your application in the browser, but not when you click the button.
                            */}
                            <button
                                onClick={console.log(item.objectID)}
                                type="button">Dismiss
                            </button>

                            {/*
                            would only run when you click the button, a function that is executed when you trigger the handler:
                            */}
                            <button
                                onClick={function () {
                                    console.log(item.objectID)
                                }}
                                type="button">Dismiss
                            </button>
                            {/*
                            can transform functions into a JavaScript ES6 arrow function, just as we did with the onDismiss() class method:
                            */}
                            <button
                                onClick={() => console.log(item.objectID)}
                                type="button">Dismiss
                            </button>
                        </span>
                    </div>
                )}
            </div>
        );
    }
}

export default App;