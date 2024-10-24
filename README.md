# Transy - Transactions Tracking Mobile App

This is a transactions tracking mobile application developed using React Native, Firebase and TypeScript.

## Features

- Expense and Income Tracking:
  - View total expenses, total income, and overall balance on the home page.
  - Add new transactions (income or expense) with title and amount.
- Authentication:
  - Email/Password authentication powered by Firebase.
  - Checking authentication status so that users can only access the screens which they are allowed to.
- Transactions Page:
  - View a complete list of all your incomes and expenses.
- Add Transaction Page:
  - Easily add a transaction with a title, amount, and type (income/expense).

## Run Project

First download the project and then install all of the dependencies

```
npm install
```

Then create a new Firebase project, select a new web app in it and then replace the below environment variables with your own.

```
EXPO_PUBLIC_API_KEY
EXPO_PUBLIC_AUTH_DOMAIN
EXPO_PUBLIC_PROJECT_ID
EXPO_PUBLIC_STORAGE_BUCKET
EXPO_PUBLIC_MESSAGING_SENDER_ID
EXPO_PUBLIC_APP_ID
```

Now you are ready to run the project. For that run the following command in the terminal

```
npm start
```
