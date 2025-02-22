import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import SearchResultsSkeleton from "../components/skeletons/SearchResultsSkeleton";

const DefaultFilter = {
  subs:true,
  dubs:true
};


function SearchResults({changeMetaArr}) {
  let urlParams = useParams().name;
  urlParams = urlParams.replace(":", "").replace("(", "").replace(")", "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(DefaultFilter);
  React.useEffect(()=>{
    changeMetaArr("title", `Search results for: ${urlParams}`)
  })
  useEffect(() => {
    async function getResults() {
      setLoading(true);
      window.scrollTo(0, 0);
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/search?name=${urlParams}`
      );
      setLoading(false);
      setResults(res.data);
    }
    getResults();
  }, [urlParams]);

  const updateSearchFilter = (ev) => {
    const otherKey = Object.keys(filter).filter(k => k !== ev.target.value);
    let otherChecked = filter[otherKey];
    // check if unchecking both - in this case we'll toggle instead
    if (!ev.target.checked && !otherChecked) {
      otherChecked = true;
    }
    setFilter({
      [ev.target.value]:ev.target.checked,
      [otherKey]:otherChecked
    });
  };

  const filterResults = (item) => {
    if (filter.dubs && filter.subs) return true;
    let match = item.title.toLowerCase().endsWith('(dub)');
    return filter.dubs ? match : !match;
  }

  return (
    <>
      {loading ? <SearchResultsSkeleton /> :
      (
        <Parent>
          <Heading>
            <span>Search</span> Results
          </Heading>
          <CheckboxWrapper>
            <label htmlFor="dubs">Dubs</label>
            <input id="dubs" checked={filter.dubs} onChange={updateSearchFilter} type="checkbox" value="dubs" />
            <label htmlFor="subs">Subs</label>
            <input id="subs" checked={filter.subs} onChange={updateSearchFilter} type="checkbox" value="subs" />
          </CheckboxWrapper>
          <CardWrapper>
            {results.filter(filterResults).map((item, i) => (
              <Wrapper to={item.link} key={i}>
                <img src={item.image} alt="" />
                <p>{item.title}</p>
              </Wrapper>
            ))}
          </CardWrapper>
          {results.length === 0 && <h2>No Search Results Found</h2>}
        </Parent>
      )}
    </>
  );
}

const Parent = styled.div`
  margin: 2rem 5rem 2rem 5rem;
  h2 {
    color: #FFFFFF;
  }
  @media screen and (max-width: 600px) {
    margin: 1rem;
  }
`;

const CheckboxWrapper = styled.div`
  color: #FFFFFF;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  label {
    padding-right: 0.5rem;
  }
  label:not(:first-child) {
    margin-left: 2rem;
  }
`

const CardWrapper = styled.div`
  /* display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  row-gap: 2rem;
  column-gap: 2rem;

  ::after {
    content: "";
    flex: auto;
  } */

  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-gap: 1rem;
  grid-row-gap: 1.5rem;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, 120px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }

  @media screen and (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, 110px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }

  @media screen and (max-width: 380px) {
    grid-template-columns: repeat(auto-fill, 100px);
    grid-gap: 0rem;
    grid-row-gap: 1.5rem;
  }
`;

const Wrapper = styled(Link)`
  text-decoration: none;
  img {
    width: 160px;
    height: 235px;
    border-radius: 0.5rem;
    object-fit: cover;
    @media screen and (max-width: 600px) {
      width: 120px;
      height: 180px;
      border-radius: 0.3rem;
    }
    @media screen and (max-width: 400px) {
      width: 110px;
      height: 170px;
    }
    @media screen and (max-width: 380px) {
      width: 100px;
      height: 160px;
    }
  }

  p {
    color: #FFFFFF;
    font-size: 1rem;
    font-family: "Gilroy-Medium", sans-serif;
    text-decoration: none;
    max-width: 160px;
    @media screen and (max-width: 380px) {
      width: 100px;
      font-size: 0.9rem;
    }
  }
`;

const Heading = styled.p`
  font-size: 1.8rem;
  color: #FFFFFF;
  font-family: "Gilroy-Light", sans-serif;
  span {
    font-family: "Gilroy-Bold", sans-serif;
  }

  @media screen and (max-width: 600px) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
`;

export default SearchResults;
