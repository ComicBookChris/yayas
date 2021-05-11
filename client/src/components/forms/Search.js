import React from 'react';
/* The useHistory hook is being imported to redirect the user to shop page */
import { useHistory } from 'react-router-dom';
/* Need access to the Redux Store, use  useSelector, and useDispatch to 
dispatch the action with the action type and the action payload to the 
window store.*/
import { useSelector, useDispatch } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
    /* Use the variable dispatch to access the Redux Store using useDispatch hook */
    let dispatch = useDispatch();
    /* Need to access search from the Redux Store. Destructor search from useSelector.
    Return the state,  spread the state, this will let us be able to grab the 
    search from the state.*/
    const { search } = useSelector((state) => ({ ...state }));
    /* Deconstruct the text from search. Remember, text is used in on the client side
    in src reducer folders under file searchReducers.js */
    const { text } = search;
    /* Need to be able to useHistory so that history.push can be implemented. */
    const history = useHistory();

    /* In this search form there will be two methods used. handleChange, and handleSubmit. */
    const handleChange = (e) => {
        dispatch({
            /* The type is derived from client side src reducers folders file searchReducer.js.
            It is SEARCH_QUERY. The type is the action the user is doing.  */
            type: "SEARCH_QUERY",
            /* The value of the SEARCH_QUERY is going to be the payload, which is the user input.
            The text is an object, because that is how it is in searchReducer.js */
            payload: { text: e.target.value },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/shop?${text}`);
    };

    /* In this form below, the code utilizes bootstrap classNames. 
    In the input field, the value will be from redux store. 
    Whenever something happens by onchange, will dispatch this input 
    from redux, and from redux, is where we will access this. The value of 
    the input will be controlled by the Redux State. Therefore the value is text
    that is obtained by Redux.  */
    return (
        <div className="ml-2 mr-7">
        <form className="mx-2 my-auto d-inline w-10 pl-20" onSubmit={handleSubmit}>
            <input
                /* onChange is an event handler */
                onChange={handleChange}
                type='search'
                value={text}
                className="form-control mr-sm-2 text-black"
                placeholder="Product Search"
            />
            <SearchOutlined onClick={handleSubmit} style={{ cursor: 'pointer' }} />
        </form>
        </div>
    )
}

export default Search;