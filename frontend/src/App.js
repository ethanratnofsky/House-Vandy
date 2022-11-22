// Packages
import React, { useState } from "react";

// Styles
import "./App.css";

// The main React App component
const App = () => {
    const [searchInput, setSearchInput] = useState("");
    const [minPriceInput, setMinPriceInput] = useState(0);
    const [maxPriceInput, setMaxPriceInput] = useState(0);
    
    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    }
    const handleMinPriceInputChange = (event) => {
        setMinPriceInput(parseInt(event.target.value));
    }
    const handleMaxPriceInputChange = (event) => {
        setMaxPriceInput(parseInt(event.target.value));
    }

    const handleSearch = () => {
        alert("You searched for: " + searchInput);
    }

    return (
        <div className="container">
            <h1>House Vandy</h1>
            <h4>Built for Vandy students by Vandy Students</h4>
            <div className="search-container">
                <input type="search" id="search-bar" placeholder="Search" value={searchInput} onChange={handleSearchInputChange} />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="filters-container">
                <label htmlFor="min-price">
                    Min Price
                </label>
                <input type="number" name="min-price" id="min-price" placeholder="Enter minimum price" value={minPriceInput} onChange={handleMinPriceInputChange} />

                <label htmlFor="max-price">
                    Max Price
                </label>
                <input type="number" name="max-price" id="max-price" placeholder="Enter maximum price" value={maxPriceInput} onChange={handleMaxPriceInputChange} /> 
            </div>
            <div className="search-results">
                
            </div>
        </div>
    );
};

export default App;