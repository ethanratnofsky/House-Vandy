// Packages
import React, { useEffect, useState } from "react";
import Select from "react-select";

// Styles
import "./App.css";

// Demo data
import APARTMENTS from "../demoApartmentData";

const USE_DEMO_DATA = true;

const selectStyles = {
    container: (provided) => ({
        ...provided,
        borderRadius: "5px",
        width: "100%",
        "&:hover": {
            boxShadow: "var(--vu-dark-gold) 0px 0px 8px",
        },
    }),
    control: (provided) => ({
        ...provided,
        border: "2px solid white",
        "&:focus-within": {
            border: "2px solid var(--vu-gold)",
            boxShadow: "var(--vu-dark-gold) 0px 0px 8px",
        },
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "black" : "white",
        color: state.isSelected ? "white" : "black",
        "&:hover": {
            backgroundColor: "black",
            color: "white",
        },
    }),
};

// The main React App component
const App = () => {
    const [allApartments, setAllApartments] = useState([]);
    const [apartmentNames, setApartmentNames] = useState([]);
    const [displayedApartments, setDisplayedApartments] = useState([]);
    const [apartmentsFilter, setApartmentsFilter] = useState([]); // array of { value: apartmentName, label: apartmentName }
    const [minPriceFilter, setMinPriceFilter] = useState(0);
    const [maxPriceFilter, setMaxPriceFilter] = useState();
    const [bedsFilter, setBedsFilter] = useState();
    const [bathsFilter, setBathsFilter] = useState();
    const [minSqftFilter, setMinSqftFilter] = useState(0);
    const [maxSqftFilter, setMaxSqftFilter] = useState();
    const [sortFilter, setSortFilter] = useState("priceAscending");

    const handleApartmentsInputChange = (selectedOptions) => {
        setApartmentsFilter(selectedOptions);
    };

    const handleMinPriceInputChange = (event) => {
        setMinPriceFilter(parseInt(event.target.value));
    };

    const handleMaxPriceInputChange = (event) => {
        setMaxPriceFilter(parseInt(event.target.value));
    };

    const handleBedsInputChange = (event) => {
        setBedsFilter(parseInt(event.target.value));
    };

    const handleBathsInputChange = (event) => {
        setBathsFilter(parseInt(event.target.value));
    };

    const handleMinSqftInputChange = (event) => {
        setMinSqftFilter(parseInt(event.target.value));
    };

    const handleMaxSqftInputChange = (event) => {
        setMaxSqftFilter(parseInt(event.target.value));
    };

    const handleSortInputChange = (event) => {
        setSortFilter(event.target.value);
    };

    const sortApartments = (apartments) =>
        apartments.sort((a, b) => {
            switch (sortFilter) {
                case "priceAscending":
                    return a.startingPrice - b.startingPrice;
                case "priceDescending":
                    return b.startingPrice - a.startingPrice;
                case "sizeAscending":
                    return a.squareFeet - b.squareFeet;
                case "sizeDescending":
                    return b.squareFeet - a.squareFeet;
                // case "nameAscending":
                //     return a.apartmentName.localeCompare(b.apartmentName);
                case "nameDescending":
                    return b.apartmentName.localeCompare(a.apartmentName);
                default:
                    return a.apartmentName.localeCompare(b.apartmentName);
            }
        });

    const handleSubmit = (event) => {
        event.preventDefault();
        setDisplayedApartments(
            sortApartments(
                allApartments.filter(
                    (apartment) =>
                        (apartmentsFilter.length === 0 ||
                            apartmentsFilter.some(
                                (option) => option.value === apartment.apartmentName
                            )) &&
                        (!minPriceFilter || apartment.startingPrice >= minPriceFilter) &&
                        (!maxPriceFilter || apartment.startingPrice <= maxPriceFilter) &&
                        (!minSqftFilter || apartment.squareFeet >= minSqftFilter) &&
                        (!maxSqftFilter || apartment.squareFeet <= maxSqftFilter) &&
                        (!bedsFilter || apartment.numBeds === bedsFilter) &&
                        (!bathsFilter || apartment.numBaths === bathsFilter)
                )
            )
        );
    };

    // On component mount, fetch apartment data from backend
    useEffect(() => {
        if (USE_DEMO_DATA) {
            setAllApartments(sortApartments(APARTMENTS));
        } else {
            fetch("http://localhost:3000/scraper/getApartments")
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setAllApartments(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    // Determine the unique apartment names
    useEffect(() => {
        setApartmentNames(
            [...new Set(allApartments.map((apartment) => apartment.apartmentName))].sort()
        );
        setDisplayedApartments(allApartments);
    }, [allApartments]);

    return (
        <div className="container">
            <div className="brand-container">
                <img
                    id="logo"
                    src={require("./assets/house-vandy-logo.png").default}
                    alt="House Vandy"
                />
                <h1 className="brand">House Vandy</h1>
            </div>
            <p className="slogan">Built for Vandy students by Vandy students!</p>
            <form onSubmit={handleSubmit}>
                <div className="search-container">
                    <Select
                        options={apartmentNames.map((apartmentName) => ({
                            value: apartmentName,
                            label: apartmentName,
                        }))}
                        isMulti
                        value={apartmentsFilter}
                        onChange={handleApartmentsInputChange}
                        styles={selectStyles}
                    />
                    <input type="submit" id="search-button" value="Apply Filters" />
                </div>
                <div className="filters-container">
                    <label className="filter">
                        Min. Price $
                        <input
                            type="number"
                            name="min-price"
                            id="min-price"
                            placeholder="Min. Price"
                            value={minPriceFilter}
                            onChange={handleMinPriceInputChange}
                            min={0}
                        />
                    </label>
                    <label className="filter">
                        Max. Price $
                        <input
                            type="number"
                            name="max-price"
                            id="max-price"
                            placeholder="Max. Price"
                            value={maxPriceFilter}
                            onChange={handleMaxPriceInputChange}
                            min={0}
                        />
                    </label>
                    <label className="filter">
                        Min. Size
                        <input
                            type="number"
                            name="min-size"
                            id="min-size"
                            placeholder="Min. Size"
                            value={minSqftFilter}
                            onChange={handleMinSqftInputChange}
                            min={0}
                        />
                        sq. ft.
                    </label>
                    <label className="filter">
                        Max. Size
                        <input
                            type="number"
                            name="max-size"
                            id="max-size"
                            placeholder="Max. Size"
                            value={maxSqftFilter}
                            onChange={handleMaxSqftInputChange}
                            min={0}
                        />
                        sq. ft.
                    </label>
                    <label className="filter">
                        Beds
                        <select
                            name="beds"
                            id="num-beds"
                            value={bedsFilter}
                            onChange={handleBedsInputChange}
                        >
                            <option value={null}>any</option>
                            {[...Array(4).keys()].map((index) => {
                                const num = index + 1;
                                return (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                    <label className="filter">
                        Baths
                        <select
                            name="baths"
                            id="num-baths"
                            value={bathsFilter}
                            onChange={handleBathsInputChange}
                        >
                            <option value={null}>any</option>
                            {[...Array(4).keys()].map((index) => {
                                const num = index + 1;
                                return (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                    <label className="sort">
                        Sort by
                        <select name="sort" value={sortFilter} onChange={handleSortInputChange}>
                            <option value="priceAscending">Price (ascending)</option>
                            <option value="priceDescending">Price (descending)</option>
                            <option value="sizeAscending">Size (ascending)</option>
                            <option value="sizeDescending">Size (descending)</option>
                            <option value="nameAscending">Name (ascending)</option>
                            <option value="nameDescending">Name (descending)</option>
                        </select>
                    </label>
                </div>
            </form>
            <div className="results-list">
                <h2>Results ({displayedApartments.length})</h2>
                <hr />
                {displayedApartments.length === 0 ? (
                    <h2 className="no-apts-found">No Apartments Found</h2>
                ) : (
                    displayedApartments.map((listing, listingIndex) => {
                        return (
                            <a
                                className="apartment-listing"
                                key={listingIndex}
                                href={listing.url}
                                target="blank"
                                referrerPolicy="no-referrer"
                            >
                                <div className="listing-details">
                                    <h3 className="listing-name">{listing.apartmentName}</h3>
                                    <p>
                                        {listing.numBeds} Bed, {listing.numBaths} Bath
                                    </p>
                                    <p>{listing.squareFeet.toLocaleString()} square-feet</p>
                                </div>
                                <div className="listing-price-container">
                                    Starting at
                                    <p className="listing-price">
                                        ${listing.startingPrice.toLocaleString()}
                                    </p>
                                    / month
                                </div>
                            </a>
                        );
                    })
                )}
            </div>
            <div className="footer">
                <p>Vanderbilt University, CS-4287 Fall 2022</p>
                <a href="https://github.com/ethanratnofsky/House-Vandy">GitHub</a>
                <p>Ethan Ratnofsky, Ethan Han, Sneh Patel</p>
            </div>
        </div>
    );
};

export default App;
