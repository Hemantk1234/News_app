import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import { PacmanLoader, CircleLoader } from "react-spinners";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingBar from "react-top-loading-bar";

const News = ({ country, pageSize, category, setProgress, apikey }) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchNewsData = async () => {
      setProgress(30);

      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apikey}&page=${page}&pageSize=${pageSize}`;

      try {
        const data = await fetch(url);
        const parsedData = await data.json();

        if (parsedData.articles) {
          setArticles((prevArticles) => [
            ...prevArticles,
            ...parsedData.articles,
          ]);
          setHasMore(parsedData.articles.length > 0);
        } else {
          console.error("Failed to fetch news data.");
        }
      } catch (error) {
        console.error("Error while fetching news data:", error);
      }

      setProgress(100);
    };

    fetchNewsData();
  }, [country, category, apikey, page, pageSize, setProgress]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container my-3">
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        News - Top {capitalizeFirstLetter(category)} Headlines
      </h1>
      <LoadingBar color="#f11946" progress={setProgress} />
      <InfiniteScroll
        dataLength={articles.length}
        next={handleNextPage}
        hasMore={hasMore}
        loader={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "150px" }}
          >
            {page > 1 ? (
              <CircleLoader color="#212529" loading={true} size={60} />
            ) : (
              <PacmanLoader color="#212529" loading={true} size={35} />
            )}
          </div>
        }
        scrollThreshold="95%"
        style={{ overflowX: "hidden" }}
      >
        <div className="row">
          {articles.map((element, index) => {
            return (
              <div className="col-md-4" key={index}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func.isRequired,
  apikey: PropTypes.string,
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

export default News;
