import React, { Component } from "react";

export default class NewsItem extends Component {
  render() {
    let { tittle, description, imageUrl, newsUrl, author, date, source } = this.props;
    return (
      <div className="my-3">
        <div className="card">
          <img src={imageUrl} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{tittle}<span className="badge bg-secondary">{source}</span></h5>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <small className="text-body-secondary">By {!author?"Unknown":author} on {new Date (date).toGMTString()}</small>
            </p>
            <a
              rel="noreferrer"
              href={newsUrl}
              target="_blank"
              className="btn btn-sm btn-dark"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    );
  }
}
