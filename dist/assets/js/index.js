class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: 'Sunshine is delicious, rain is refreshing, wind braces us up, snow is exhilarating; there is really no such thing as bad weather, only different kinds of good weather.',
      author: 'John Ruskin',
      status: ''
    };
    this.fetchQuote = this.fetchQuote.bind(this);
  }

  componentWillMount() {
    if (localStorage.quote) {
      const quote = JSON.parse(localStorage.getItem('quote'));
      this.setState(() => ({
        quote: quote.quote,
        author: quote.author
      }));
    }
  }

  componentDidUpdate() {
    const quote = JSON.stringify(this.state);
    localStorage.setItem('quote', quote);

    if (this.state.isClicked) {
      this.button.disabled = true;
    } else {
      this.button.disabled = false;
    }
  }

  fetchQuote() {
    this.loader.style.display = 'inline-block';
    this.setState(prevState => ({
      status: '',
      isClicked: !prevState.isClicked
    }));

    const request = async () => {
      try {
        const response = await fetch('https://favqs.com/api/qotd');
        const data = await response.json();
        this.loader.style.display = 'none';
        this.setState(() => ({
          quote: data.quote.body,
          author: data.quote.author,
          isClicked: false,
          status: 'OK'
        }));
        console.log(data);
      } catch (e) {
        this.loader.style.display = 'none';
        this.setState(() => ({
          isClicked: false,
          status: 'FAILED'
        }));
      }
    };

    setTimeout(request, 1000);
  }

  render() {
    const {
      quote,
      author
    } = this.state;
    return React.createElement("div", {
      className: "container"
    }, React.createElement("h1", {
      className: "quote-title"
    }, "Random Quote Generator"), React.createElement("button", {
      onClick: this.fetchQuote,
      ref: node => this.button = node
    }, "Get Random Quote"), this.state.status === 'FAILED' && React.createElement("p", null, "Failed to generate. Try again"), React.createElement("div", {
      className: "loader",
      ref: node => this.loader = node
    }), React.createElement("div", {
      className: "quote-wrapper"
    }, React.createElement("h2", {
      className: "quote"
    }, React.createElement("img", {
      src: "dist/assets/img/quote.svg",
      alt: "quote",
      className: "quote-mark quote-left"
    }), quote, React.createElement("img", {
      src: "dist/assets/img/quote.svg",
      alt: "quote",
      className: "quote-mark quote-right"
    })), React.createElement("h2", {
      className: "author"
    }, "\u2014 ", author.length === 0 ? 'anonymous' : author)));
  }

}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));