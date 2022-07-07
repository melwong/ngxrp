Nano Gigs
-----------------------------

A gig economy platform that empowers people to request and respond to help by doing little tasks called "nano gigs." Responders are rewarded with your custom tokens (on XRP Ledger) as a token of appreciation. This token can be withdrawn (cash out), if allowed.

It is highly customisable with many awesome features:

- Asking and answering help.
- Voting, comments, best help selection, follow-on and closed requests.
- Complete user management including token-based management.
- Create experts, editors, moderators and admins.
- Fast integrated search engine.
- Categories (up to 4 levels deep) and/or tagging.
- Easy styling with CSS themes.
- Supports translation into any language.
- Custom sidebar, widgets, pages and links.
- SEO features such as neat URLs, microformats and XML Sitemaps.
- User avatars (or Gravatar) and custom fields.
- Private messaging.
- Custom single sign-on support for other sites.
- PHP/MySQL scalable to millions of users and posts.
- Safe from XSS, CSRF and SQL injection attacks.
- Beat spam with captchas, rate-limiting, moderation and/or flagging.
- Block users, IP addresses, and censor words

## How to install

- Clone this repo.
- Create a MySQL database, and a MySQL user with full permissions for that database. If you're interested, the privileges actually needed are: CREATE, ALTER, DELETE, INSERT, SELECT, UPDATE, LOCK TABLES. Note down the MySQL details: username, password, database name and server host name. If MySQL is running on the same server as your website, the server host name is likely to be 127.0.0.1 or localhost.
- Open qa-config.php in your text editor, insert the MySQL details at the top, and save the file. Do not use a word processor such as Microsoft Word for this, but rather Notepad or another appropriate text editing program.
- Go to installers folder and run the sql_to_run.sql file in your MySQL IDE or Phpmyadmin.
- Go to browser and run the site. You're all set!

## How to use
Watch this video -> https://youtu.be/RRHOjwDUouc


## Configuration with XRP Ledger

The main XRP config file is at qa-theme/lion/js/web3-connector.js. Under this file, you'll notice the below.

* The code is currently configured to work with XRP testnet at wss://s.altnet.rippletest.net:51233
* The existing currency code is NAN but you can change this to a 3-letter symbol (not 4 letters).
* You need to enter your master wallet address at line 43. Master wallet is the site's main wallet, the one issuing the sending out tokens.
* You should enter your wallet seed at line 84.

## New wallet is created during user registration
During registration, a user is given a wallet address and seed. These are emailed to them. Subsequently, a trust line is set between the master wallet (site's wallet) and the user's new wallet. This is required as to allow the master wallet to send the tokens to the user when they wish to withdraw.

## Token withdrawal
Since each user is given free tokens during sign up, these free tokens cannot be cashed out. This means a user can only withdraw any amount above the amount of this complimentary token. For example, if you set the system to issue 1,000 free tokens and Tom currently has 1,500 tokens (after answering some requests for help), he can only withdraw 500 tokens, not 1,500.

During withdrawal, the master wallet will issue new tokens and deliver to the user's wallet. A transaction receipt will be created and verifiable at https://testnet.xrpl.org/ 


----------

This code is based on [Question2Answer][Q2A] and it is also GPL licensed. Instead of reinventing the wheel from scratch, we reused existing robust and production-ready [Question2Answer][Q2A] code and build on top of it to ensure minimum bugs and vulnerabilities.


[Q2A]: http://www.question2answer.org/