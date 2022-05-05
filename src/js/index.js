class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: 'Sunshine is delicious, rain is refreshing, wind braces us up, snow is exhilarating; there is really no such thing as bad weather, only different kinds of good weather.',
      author: 'John Ruskin',
      status: ''
    }

    this.fetchQuote = this.fetchQuote.bind(this);
  }

  componentWillMount() {
    if(localStorage.quote) {
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

    if(this.state.isClicked) {
      this.button.disabled = true;
    } else {
      this.button.disabled = false;
    }
  }

  fetchQuote() {
    this.loader.style.display = 'inline-block';
    this.setState((prevState) => ({
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
      } catch(e) {
        this.loader.style.display = 'none';
        this.setState(() => ({
          isClicked: false,
          status: 'FAILED'
        }));
      }
    }

    setTimeout(request, 1000);

  }

  render() {
    const {quote, author} = this.state;
    return (
      <div className="container">
        <h1 className="quote-title">Random Quote Generator</h1>
        <button onClick={this.fetchQuote} ref={(node) => this.button = node}>Get Random Quote</button>
        {this.state.status === 'FAILED' && <p>Failed to generate. Try again</p>}
        <div className="loader" ref={(node) => this.loader = node}></div>
        <div className="quote-wrapper">
          <h2 className="quote">
            <img src="dist/assets/img/quote.svg" alt="quote" className="quote-mark quote-left" />
            {quote}
            <img src="dist/assets/img/quote.svg" alt="quote" className="quote-mark quote-right" />
          </h2>
          <h2 className="author">&mdash; {author.length === 0 ? 'anonymous' : author}</h2>
  
        </div>
        
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));