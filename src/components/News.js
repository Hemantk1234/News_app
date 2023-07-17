import React, { Component } from "react";
import NewsItem from "./NewsItem";
import { PacmanLoader, CircleLoader } from "react-spinners";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingBar from "react-top-loading-bar";

export default class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    setProgress: PropTypes.func.isRequired,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
      hasMore: true,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - News`;
  }

  async componentDidMount() {
    await this.fetchNewsData();
  }

  fetchNewsData = async () => {
    this.setState({ loading: true });
    this.props.setProgress(30);

    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    try {
      const data = await fetch(url);
      const parsedData = await data.json();

      if (parsedData.articles) {
        this.setState((prevState) => ({
          articles: [...prevState.articles, ...parsedData.articles],
          totalResults: parsedData.totalResults,
          loading: false,
          hasMore: parsedData.articles.length > 0,
        }));
      } else {
        console.error("Failed to fetch news data.");
      }
    } catch (error) {
      console.error("Error while fetching news data:", error);
    }

    this.props.setProgress(100);
  };

  handleNextPage = () => {
    this.setState(
      (prevState) => ({
        page: prevState.page + 1,
      }),
      () => {
        setTimeout(() => {
          this.fetchNewsData();
        }, 1000);
      }
    );
  };

  render() {
    const { page } = this.state;

    return (
      <div className="container my-3">
        <h1 className="text-center">
          News - Top {this.capitalizeFirstLetter(this.props.category)} Headlines
        </h1>
        <LoadingBar color="#f11946" progress={this.props.progress} />
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.handleNextPage}
          hasMore={this.state.hasMore}
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
            {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
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
  }
}
