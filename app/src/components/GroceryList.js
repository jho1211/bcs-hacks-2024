import React, {memo} from "react";

const GroceryList = memo(function GroceryList({data}) {
    return (
        <ul>
            {data.map(item => {
                return <li>
                    {item}
                </li>
            } )}
        </ul>
    )

});

export default GroceryList;