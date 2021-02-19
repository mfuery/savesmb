import React, { Component } from "react"

export const loadSquareSdk = () => {
  return new Promise((resolve, reject) => {
    const sqPaymentScript = document.createElement("script")
    sqPaymentScript.src =
      process.env.SQUARE_API_ENDPOINT ||
      "https://js.squareup.com/v2/paymentform"
    sqPaymentScript.crossorigin = "anonymous"
    sqPaymentScript.onload = () => {
      resolve()
    }
    sqPaymentScript.onerror = () => {
      reject(`Failed to load ${sqPaymentScript.src}`)
    }
    document.getElementsByTagName("head")[0].appendChild(sqPaymentScript)
  })
}

export default class PaymentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardBrand: "",
      nonce: undefined,
      googlePay: false,
      applePay: false,
      masterpass: false,
      isSquareLoaded: false,
    }
    console.log("this.props", this.props)
    this.requestCardNonce = this.requestCardNonce.bind(this)
  }

  requestCardNonce() {
    this.paymentForm.requestCardNonce()
  }

  componentDidMount() {
    const config = {
      applicationId:
        process.env.SQUARE_APPLICATION_ID || "MISSING SQUARE_APPLICATION_ID",
      locationId:
        process.env.SQUARE_LOCATION_ID || "MISSING SQUARE_LOCATION_ID",
      inputClass: "sq-input",
      autoBuild: false,
      cardNumber: {
        elementId: "sq-card-number",
        placeholder: "• • • •  • • • •  • • • •  • • • •",
      },
      cvv: {
        elementId: "sq-cvv",
        placeholder: "CVV",
      },
      expirationDate: {
        elementId: "sq-expiration-date",
        placeholder: "MM/YY",
      },
      postalCode: {
        elementId: "sq-postal-code",
        placeholder: "Zip",
      },
      callbacks: {
        methodsSupported: (methods) => {
          console.log(methods)
          if (methods.googlePay) {
            this.setState({
              googlePay: methods.googlePay,
            })
          }
          if (methods.applePay) {
            this.setState({
              applePay: methods.applePay,
            })
          }
          if (methods.masterpass) {
            this.setState({
              masterpass: methods.masterpass,
            })
          }
          return
        },
        createPaymentRequest: () => {
          return {
            requestShippingAddress: false,
            requestBillingInfo: true,
            currencyCode: "USD",
            countryCode: "US",
            total: {
              label: "MERCHANT NAME",
              amount: "100",
              pending: false,
            },
            lineItems: [
              {
                label: "Subtotal",
                amount: "100",
                pending: false,
              },
            ],
          }
        },
        cardNonceResponseReceived: (errors, nonce, cardData) => {
          if (errors) {
            // Log errors from nonce generation to the JavaScript console
            console.log("Encountered errors:")
            errors.forEach(function (error) {
              console.log("  " + error.message)
            })
            return
          }
          this.setState({
            nonce: nonce,
          })
          console.log(nonce)
        },
        unsupportedBrowserDetected: () => {},
      },
    }

    // TODO this is a hack b/c gatsby square example didn't work for me (window.SqPaymentForm was undefined)
    const that = this
    if (!this.state.isSquareLoaded) {
      loadSquareSdk().then(() => {
        this.paymentForm = new window.SqPaymentForm(config)
        this.paymentForm.build()
        that.setState({ isSquareLoaded: true })
      })
    }
  }

  render() {
    return (
      <div id="form-container">
        <div className="field">
          <label className="label">Card Number</label>
          <div id="sq-card-number" className="control"></div>
        </div>
        <div className="field">
          <div className="third" id="sq-expiration-date"></div>
        </div>
        <div className="field">
          <div className="third" id="sq-cvv"></div>
        </div>
        <div className="field">
          <div className="third" id="sq-postal-code"></div>
        </div>
        <div className="field">
          <button
            id="sq-creditcard"
            className="button-credit-card"
            onClick={this.onGetCardNonce}
          >
            Pay $1.00
          </button>
        </div>
      </div>
    )
  }
}
