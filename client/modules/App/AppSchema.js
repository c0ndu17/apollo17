import gql from 'graphql-tag';


// Initialize GraphQL queries or mutations with the `gql` tag
export const AppQuery = gql`query AppQuery { testString }`;
export const AppMutation = gql`mutation AppMutation { getUser(id: "Test 123") {
  _id
	displayName
	email
	firstName
	lastName
	birthday
} }`;


