import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { searchReducer } from './searchReducer';
import {cartReducer} from './cartReducer';
import {drawerReducer} from './drawerReducer';
import {couponReducer} from './couponReducer';

/* Redux's combinedReducers which takes in an object of functions.
These functions run whenever dispatch is called and return value 
becomes the app's new state.*/
const rootReducer = combineReducers({
    /* user and search properties are now in the redux store */
    user: userReducer,
    search: searchReducer,
    cart: cartReducer,
    drawer: drawerReducer,
    coupon: couponReducer,
}); 

export default rootReducer; 

/* 
Store - holds the code's state - There is only one state.
The state is read only, that means that the state is only copied
and modified then return. The original state remains unchanged. 

Action - State can be modified using actions - simple objects.

Dispatcher- The Action reaches the Reducer by the Dispatcher.
Actions needs to be sent by someone - known as dispatching
an action.

Reducer - So, when the user presses on a button, this dispatches an Action
that goes to the Reducer, which modifies the Store, and the Reducer will
return an updated State. For the Reducer the modify the state, it must have
access to the original state called the initial state.

-pure functions
-only mandatory argument is the 'type' 

Subscriber - listens for state change to update the ui (using connect)
*/