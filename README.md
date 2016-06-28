# Blockchain AutoPay/Dashboard

## Overview
Separate client/browser repository for Blockchain Autopay/Dashboard

## Design Goals
* Use Coinbase API to:
	* View account details
	* Send money through bitcoin address or email methods
	* Visualize spending history/trends

## Prerequisites:
1. Have an existing Coinbase account with at least a few transactions.
2. Run the Blockchain Autopay Web API on port 5000 (manages OAuth authentication with Coinbase).

## Setup:
1. Clone the project
2. `npm install` and `bower install`
3. `http-server` in the main directory


### Getting started:
1. In the login on the top right, select "Login with Coinbase," which redirects to Coinbase login.
2. Give Blockchain Autopay permission to access account information and make transactions up to 1 USD per day.
3. View transaction history and spending graph (currently loads 25 most recent transactions)


### Development Goals:
1. Reroute fully to Coinbase Sandbox API to allow many more use cases and testing scenarios (currently relies on real account information, which complicates testing).
2. More UI interactive potential (transaction detail views, transaction entry with bitcoin public key in addition to email/account id)
3. Transaction status via third blockchain API listing confirmations and/or listing transaction as pending until confirmation.




