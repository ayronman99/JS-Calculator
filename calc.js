const projectName = 'javascript-calculator';


const disOperators = /[x/+-]/,
      endOps = /[x+-/]$/,
      negativeSign = /\d[x/+-]{1}-$/

class Calculator extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        currentValue: '0',
        prevValue: '0',
        evaluated: false,
        answer: ''
      }
      this.display = this.display.bind(this);
      this.calculate = this.calculate.bind(this);
      this.allClear = this.allClear.bind(this);
      this.clear = this.clear.bind(this);
      this.decimalHandler = this.decimalHandler.bind(this);
      this.operatorHandler = this.operatorHandler.bind(this);
    }
  
  
   maxDigitWarning() {
    this.setState({
      currentValue: 'Cannot Exceed',
      prevValue: this.state.currentValue
    });
    setTimeout(() => this.setState({ currentValue: this.state.prevValue }), 1000);
  }
  
  calculate(){
   if(!this.state.currentValue.includes('Exceed')){
     let expressAns = this.state.answer;
     while (endOps.test(expressAns)) {
       expressAns = expressAns.slice(0, -1)
     }  
     expressAns = expressAns
      .replace(/x/g, '*')
      .replace(/-/g, '-')
      .replace('--', '+0+0+0+0+0+0+');
     
     let response = Math.round(1000000000000 * eval(expressAns)) / 1000000000000;
     
     this.setState({
       currentValue: response.toString(),
       answer:
          expressAns
            .replace(/\*/g, '⋅')
            .replace(/-/g, '-')
            .replace('+0+0+0+0+0+0+', '--')
            .replace(/(x|\/|\+)-/, '$1-')
            .replace(/^-/, '-') + '=' + response,
       prevValue: response,
       evaluated: true
     });
   }
 } 
  
  operatorHandler(e) {
    if (!this.state.currentValue.includes('Exceed')) {
      const value = e.target.value;
      const { answer, prevValue, evaluated } = this.state;
      this.setState({ currentValue: value, evaluated: false });
      if (evaluated) {
        this.setState({ answer: prevValue + value });
      } else if (!endOps.test(answer)) {
        this.setState({
          prevValue: answer,
          answer: answer + value
        });
      } else if (!negativeSign.test(answer)) {
        this.setState({
          answer:
            (negativeSign.test(answer + value) ? answer : prevValue) +
            value
        });
      } else if (value !== '-') {
        this.setState({
          answer: prevValue + value
        });
      }
    }
  }

  
  //this handles the input on the calculator
  display = (input) => {
     if(!this.state.currentValue.includes('Exceed')){
        const { currentValue, answer, evaluated } = this.state;
        const value = input.target.value;
       this.setState({evaluated: false})
      if(currentValue.length > 21){
        this.maxDigitWarning();
      }else if(evaluated){
        //checks the input expression and will put it at the express after hitting answer
       this.setState({currentValue: value, answer: value !== '0' ? value : '' })
        } else {
          this.setState({
           currentValue: currentValue === '0' || disOperators.test(currentValue)
                ? value : currentValue + value,
            answer: 
              currentValue === '0' && value === '0'
                ? answer === ''
                  ? value
                  : answer
                : /([^.0-9]0|^0)$/.test(answer)
                ? answer.slice(0, -1) + value
                : answer + value
         });
   }
  }    
};

  allClear = () => {
    this.setState({
      currentValue: '0',
      prevValue: '0',
      answer: '',
      evaluated: false
    });
 };
  
 clear = () => {
   const { answer, currentValue } = this.state;
   this.setState({
        currentValue: currentValue.split('').slice(0, currentValue.length-1).join(""),
        answer: answer.split('').slice(0, answer.length-1).join("")
    });
 };
  
 decimalHandler(){
    const { evaluated, currentValue, answer } = this.state;
   if(evaluated){
     this.setState({
       currentValue: '0.',
       answer: '0.',
       evaluated: false
     });
   } else if(
      !currentValue.includes('.') &&
      !currentValue.includes('Exceed')
   ){
      this.setState({
        evaluated: false
      });
     if(currentValue.length > 21){
        this.maxDigitWarning();
   } else if (
     endOps.test(answer)  ||
     (currentValue === '0' && answer === '')
   ){
     this.setState({
       currentValue: '0.',
       answer: answer + '0.'
     });
   } else {
      this.setState({
          currentValue: answer.match(/(-?\d+\.?\d*)$/)[0] + '.',
          answer: answer + '.'
        });
   }
 }
}   
  
  render(){
    
    
    return (
        <div className='container'>
        
       <div className='displayer'>
          <div className='total'>{this.state.answer.replace(/x/g, '⋅')}</div>
          <div className='output' id="display"> {this.state.currentValue} </div> 
          </div>
        
      <div className='grid'>
        <button id="clear" onClick={this.allClear} className="calcButton AC">AC</button>
        <button  onClick={this.clear} className="calcButton C">C</button>
       
        <button id="divide" onClick={this.operatorHandler} className="calcButton div" value="/">/</button>
        <button id="multiply" onClick={this.operatorHandler} className="calcButton mult" value="x">x</button>
        <button id="seven" onClick={this.display} className="calcButton seven dark-gray" value="7">7</button>
        <button id="eight" onClick={this.display} className="calcButton eight dark-gray" value="8">8</button>
       
        <button id="nine" onClick={this.display} className="calcButton nine dark-gray" value="9">9</button>
        <button id="subtract" onClick={this.operatorHandler} className="calcButton minus" value="-">-</button>
        <button id="four" onClick={this.display} className="calcButton four dark-gray" value="4">4</button>
        <button id="five" onClick={this.display} className="calcButton five dark-gray" value="5">5</button>
       
        <button id="six" onClick={this.display} className="calcButton six dark-gray" value="6">6</button>
        <button id="add" onClick={this.operatorHandler} className="calcButton add" value="+">+</button>
        <button id="one" onClick={this.display} className="calcButton one dark-gray" value="1">1</button>
        <button id="two" onClick={this.display} className="calcButton two dark-gray" value="2">2</button>
        
        <button id="three" onClick={this.display} className="calcButton three dark-gray" value="3">3</button>
        <button id="equals" onClick={this.calculate} className="calcButton equal" value="=">=</button>
        <button id="zero" onClick={this.display} className="calcButton zero dark-gray" value="0">0</button>
        <button id="decimal" onClick={this.decimalHandler} className="calcButton dot dark-gray" value=".">.</button>
      </div>
       
 </div>
    
    )
    
  }
  
}



ReactDOM.render(<Calculator />, document.getElementById('root'))