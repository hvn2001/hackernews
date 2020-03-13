import React, {Component} from 'react';

require('./App.css');

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// ES5
function _isSearched(searchTerm) {
    return function (item) {
        return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
}

const isSearched = (searchTerm) => (item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

class Search extends Component {
    render() {
        const {value, onChange, children} = this.props;
        return <form> {children}
            <input
                type="text"
                value={value}
                onChange={onChange}
            />
        </form>;
    }
}

/*const Search = ({value, onChange, children}) => {
    // do something
    return (
        <form>
            {children} <input
            type="text"
            value={value}
            onChange={onChange}
        />
        </form>
    );
}*/

class Table extends Component {
    render() {
        const {list, pattern, onDismiss} = this.props;
        return (
            <div className="table">
                {list.filter(_isSearched(pattern)).map(item =>
                    <div key={item.objectID} className="table-row">
                        <span style={{width: '40%'}}><a href={item.url}>{item.title}</a></span>
                        <span style={{width: '30%'}}>{item.author}</span>
                        <span style={{width: '10%'}}>{item.num_comments}</span>
                        <span style={{width: '10%'}}>{item.points}</span>
                        <span style={{width: '10%'}}>
                            <Button onClick={() => onDismiss(item.objectID)} className="button-inline">Dismiss</Button>
                        </span>
                    </div>
                )}
            </div>
        )
    }
}

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        };

        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.setSearchTopstories = this.setSearchTopstories.bind(this);
        this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    }

    setSearchTopstories(result) {
        this.setState({result});
    }


    fetchSearchTopstories(searchTerm) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopstories(result))
            .catch(e => e);
    }

    componentDidMount() {
        const {searchTerm} = this.state;
        this.fetchSearchTopstories(searchTerm);
    }


    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id; // ES6 arrow function
        const updatedHits = this.state.result.hits.filter(isNotId);
        console.log({hits: updatedHits});
        console.log({...this.state.result, hits: updatedHits});
        this.setState({
            // result: Object.assign({}, {}, {hits: updatedHits})
            // result: {hits: updatedHits} // miss some attr
            result: {...this.state.result, hits: updatedHits}
        });
    }

    render() {
        const {searchTerm, result} = this.state;
        if (!result) {
            return null;
        }
        return (
            <div className="page">
                <div className="interactions">
                    <Search value={searchTerm} onChange={this.onSearchChange}>Search</Search>
                </div>
                {/*<Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>*/}
                {/*{result
                    ? <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>
                    : null
                }*/}
                {result &&
                <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>
                }
            </div>
        );
    }
}

class Button extends Component {
    render() {
        const {
            onClick,
            className = '',
            children,
        } = this.props;

        return (
            <button
                onClick={onClick}
                className={className}
                type="button">
                {children}
            </button>
        );
    }
}

export default App;