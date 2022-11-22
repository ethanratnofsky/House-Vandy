// Packages
import React, { useState } from "react";

// Styles
import "./App.css";

// The main React App component
const App = () => {
    const [searchInput, setSearchInput] = useState("");
    
    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    }

    const handleSearch = () => {
        alert("You searched for: " + searchInput);
    }

    return (
        <>
            <h1>House Vandy</h1>
            <h4>Built for Vandy students by Vandy Students</h4>
            <div className="search-container">
                <input type="search" id="search-bar" placeholder="Search" value={searchInput} onChange={handleSearchInputChange} />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="filters-container">

            </div>
            <div className="search-results">
                
            </div>
        </>
    );
};

export default App;