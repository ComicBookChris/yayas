/* The Reducer is used to access the Redux Store's state, and 
dispatching events. The type value is based on the users action.
The code will build on its current state, so state and action are given
as parameters. In this case, when the app is ran, the code will have 
a state of null. It's best practice not to change the default state. */
export const userReducer = (state = null, action) => {
    switch (action.type) {
        case "LOGGED_IN_USER":
            return action.payload;
        case "LOGOUT":
            return action.payload;
        default:
            return state;
    }
};