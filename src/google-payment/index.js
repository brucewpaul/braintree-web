'use strict';
/** @module braintree-web/payment-request */

var basicComponentVerification = require('../lib/basic-component-verification');
var BraintreeError = require('../lib/braintree-error');
var browserDetection = require('@braintree/browser-detection');
var GooglePayment = require('./google-payment');
var Promise = require('../lib/promise');
var wrapPromise = require('@braintree/wrap-promise');
var VERSION = process.env.npm_package_version;

/**
 * @static
 * @function create
 * @param {object} options Creation options:
 * @param {Client} options.client A {@link Client} instance.
 * @param {callback} [callback] The second argument, `data`, is the {@link GooglePayment} instance. If no callback is provided, `create` returns a promise that resolves with the {@link GooglePayment} instance.
 * @returns {Promise|void} Returns a promise if no callback is provided.
 * @example
 * if (window.PaymentRequest && isGoogleChrome()) {
 *   braintree.googlePayment.create({
 *     client: clientInstance
 *   }, function (err, instance) {
 *      // set up Pay with Google button
 *   });
 * }
 */
function create(options) {
  return basicComponentVerification.verify({
    name: 'Pay with Google',
    client: options.client
  }).then(function () {
    var googlePayment;

    if (!options.client.getConfiguration().gatewayConfiguration.androidPay) {
      return Promise.reject(new BraintreeError({
        type: BraintreeError.types.MERCHANT,
        code: 'PAY_WITH_GOOGLE_NOT_ENABLED',
        message: 'Pay with Google is not enabled for this merchant.'
      }));
    }

    googlePayment = new GooglePayment(options);

    return googlePayment.initialize();
  });
}

/**
 * @static
 * @function isSupported
 * @description Returns true if Pay with Google is supported in this browser.
 * @example
 * if (braintree.googlePayment.isSupported()) {
 *    // Add Pay with Google button to page and
 *    // initialize Pay with Google component
 * } else {
 *    // Do not initialize Pay with Google component
 * }
 * @returns {Boolean} Returns true if Pay with Google supports this browser.
 */
function isSupported() {
  return Boolean(window.PaymentRequest && browserDetection.isChrome());
}

module.exports = {
  create: wrapPromise(create),
  isSupported: isSupported,
  /**
   * @description The current version of the SDK, i.e. `{@pkg version}`.
   * @type {string}
   */
  VERSION: VERSION
};
