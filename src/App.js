import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

require('./App.css');

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// ES5
function _isSearched(searchTerm) {
    return function (item) {
        return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
}

const isSearched = (searchTerm) => (item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

class Search extends Component {
    componentDidMount() {
        if (this.input) {
            this.input.focus();
        }
    }

    render() {
        const {value, onChange, onSubmit, children} = this.props;
        return <form onSubmit={onSubmit}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                ref={el => this.input = el}
            />
            <button type="submit">
                {children}
            </button>
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
        const {list, onDismiss} = this.props;
        return (
            <div className="table">
                {list.map(item =>
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

const Loading = () =>
    <div>Loading ...</div>

class App extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchTerm: DEFAULT_QUERY,
            searchKey: '',
            error: null,
            isLoading: false,
        };

        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.setSearchTopstories = this.setSearchTopstories.bind(this);
        this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    }

    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    setSearchTopstories(result) {
        const {hits, page} = result;
        const {searchKey, results} = this.state;
        const oldHits = results && results[searchKey]
            ? results[searchKey].hits
            : [];

        const updatedHits = [
            ...oldHits,
            ...hits
        ];

        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page},
            },
            isLoading: false
        });
    }


    fetchSearchTopstories(searchTerm, page = 0) {
        this.setState({isLoading: true});
        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(result => this._isMounted && this.setSearchTopstories(result.data))
            .catch(error => this._isMounted && this.setState({error}));
    }

    componentDidMount() {
        this._isMounted = true;
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        this.fetchSearchTopstories(searchTerm);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    onSearchSubmit(event) {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopstories(searchTerm);
        }
        event.preventDefault();
    }

    onDismiss(id) {
        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];
        const isNotId = item => item.objectID !== id; // ES6 arrow function
        const updatedHits = hits.filter(isNotId);
        console.log({hits: updatedHits});
        console.log({...results[searchKey], hits: updatedHits});
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            }
        });
    }

    render() {
        const {searchTerm, results, searchKey, error, isLoading} = this.state;
        const page = (results && results[searchKey] && results[searchKey].page) || 0;
        /*if (!results[searchKey]) {
            return null;
        }*/
        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];
        return (
            <div className="page">
                <div className="interactions">
                    <Search value={searchTerm} onChange={this.onSearchChange}
                            onSubmit={this.onSearchSubmit}>Search</Search>
                </div>
                {error
                    ? <div className="interactions">
                        <p>Something went wrong.</p>
                    </div>
                    : <Table list={list} onDismiss={this.onDismiss}/>
                }
                {/*<Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>*/}
                {/*{result
                    ? <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>
                    : null
                }*/}
                {/*{list &&
                <Table list={list} onDismiss={this.onDismiss}/>
                }*/}
                <div className="interactions">
                    {isLoading
                        ? <Loading/>
                        : <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
                            More
                        </Button>
                    }
                </div>
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

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

Table.propTypes = {
    list: PropTypes.arrayOf(
        PropTypes.shape({
            objectID: PropTypes.string.isRequired,
            author: PropTypes.string,
            url: PropTypes.string, // PropTypes.string.isRequired
            num_comments: PropTypes.number,
            points: PropTypes.number,
        })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired,
};

export default App;

export {
    Button,
    Search,
    Table,
};