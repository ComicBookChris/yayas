import React, { useState, useEffect } from 'react';
import { getSub } from '../../functions/sub';
import ProductCard from '../../components/cards/ProductCard';

/* Needed to grab the slug from the url, in order to do so, the 
code uses match which is deconstructed from react router props. */
const SubHome = ({ match }) => {
    /* State variables, single Sub can be left as useState({}). 
    The next bit of code sought after is the list of products that 
    is within the single Sub that was sought after. */
    const [sub, setSub] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    /* De-structured slug so that it is easier to use.  */
    const { slug } = match.params;

    /* When the component mounts, the code needs to make a
    request to the single Sub. */
    useEffect(() => {
        setLoading(true);
        /* Backend does not know which Sub the frontend wants
        unless the slug is sent. */
        getSub(slug)
            /* then the code gets the Sub, and sets the Sub  
            with res.data. */
            .then(res => {
                /* console.log with JSON stringify which accepts 3 parameters.
                1st will take the res.data, next will be null, and last will be
                4 witch is used to indent the code so that it is much more 
                readable in the console. */
                console.log(JSON.stringify(res.data, null, 4));
                /* res.data.sub is now set in the state with setSub */
                setSub(res.data.sub);
                /* res.data.products is now set in the state with setProducts */
                setProducts(res.data.products);
                /* Once the response is received set loading to false */
                setLoading(false);
            })
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    {/* If the code has the loading state as true, then the code can show the loading text, 
                    otherwise can show the products.length and Sub.name that is held in state*/}
                    {loading
                        ? (
                            <h4 className="text-center font-italic font-weight-normal p-3 mt-5 mb-5 display-4 jumbotron">
                                Loading...
                            </h4>
                        )
                        : (
                            <h4 className="text-center font-italic font-weight-normal p-3 mt-5 mb-5 display-4 jumbotron">
                                {products.length} Products in {sub.name} sub category
                            </h4>
                        )}
                </div>
            </div>
            <div className="row">
                {/* Here the code needs to map through the products, and display them in the ProductCard. 
                To accomplish this, map through the array, get each product. Using a div to apply className
                and key.  Using the ProductCard, show the entire information of a specific product given a 
                certain _id that is referenced in the key. */}
                {products.map((p) => <div className="col-md-4" key={p._id}>
                    <ProductCard product={p} />
                </div>)}
            </div>
        </div>
    )
}
export default SubHome;