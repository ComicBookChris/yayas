/* This searchReducer will have a state with a value of text, and 
by default text has an empty string. The reducer will send actions, 
and based on the action type, the reducer will do certain things. */
export const searchReducer = (state = {text:""}, action) => {
    /**Send the action type of search query that will update the 
     * state with a value of text, will be available in the redux
     * store thanks to the index.js in reducers. There a property of 
     * searchReducer is set in order to be available in the redux store. */
    switch (action.type) {
        /* Sending an action type of SEARCH_QUERY. When that is sent, it will
        send the text. In order to do this, the action type utilizes the spread 
        operator, spreading the state, and action.payload. The spread operator is
        useful when the state has more then one property.  Need to update the state  */
        case "SEARCH_QUERY":
            return {...state, ...action.payload};
        /* In the default case, the reducer will return the state. */
        default:
            return state;
        /* Now the code needs to import this into the reducers index.
         */
    }
};
