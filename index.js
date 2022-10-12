/**
 * Author: Aditya Raj
 * Description: Using GraphQL with Express and without a database
 */

//Setting up express
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();

//Exporting Types
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

//Preparing data
const cities = [
  { id: 1, name: "New York" },
  { id: 2, name: "London" },
  { id: 3, name: "Mumbai" },
  { id: 4, name: "Sydney" },
  { id: 5, name: "Tokyo" },
];

const flights = [
  { id: 1, name: "Flight1", cityId: 1 },
  { id: 2, name: "Flight2", cityId: 2 },
  { id: 3, name: "Flight3", cityId: 3 },
  { id: 4, name: "Flight4", cityId: 4 },
  { id: 5, name: "Flight5", cityId: 5 },
  { id: 6, name: "Flight6", cityId: 1 },
  { id: 7, name: "Flight7", cityId: 2 },
];

//Defining Types
const CityType = new GraphQLObjectType({
  name: "City",
  description: "This represents a city",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    flights: {
      type: new GraphQLList(FlightType),
      resolve: (city) => {
        //Finding flights for a city
        return flights.filter((flight) => flight.cityId === city.id);
      },
    },
  }),
});

const FlightType = new GraphQLObjectType({
  name: "Flight",
  description: "This represents a flight flying from a city",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    cityId: { type: GraphQLNonNull(GraphQLInt) },
    city: {
      type: new GraphQLList(CityType),
      resolve: (flight) => {
        //Find the city with the id of the cityId
        return cities.filter((city) => flight.cityId === city.id);
      },
    },
  }),
});

//Defining Root Mutation
const RootMutationType = new GraphQLObjectType({
  name: "RootMutationType",
  description: "Mutation",
  fields: () => ({
    addflight: {
      type: FlightType,
      description: "Add new flight",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        cityId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const flight = {
          id: flights.length + 1,
          name: args.name,
          cityId: args.cityId,
        };
        flights.push(flight);
        return flight;
      },
    },
    addcity: {
      type: CityType,
      description: "Add new city",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        //Pushing data into the array
        const city = { id: cities.length + 1, name: args.name };
        cities.push(city);
        return city;
      },
    },
  }),
});

//Defining Root Query
const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    flight: {
      type: FlightType,
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) =>
        flights.find((flight) => flight.id === args.id),
    },
    flights: {
      type: new GraphQLList(FlightType),
      resolve: () => flights,
    },
    cities: {
      type: new GraphQLList(CityType),
      resolve: () => cities,
    },
    city: {
      type: CityType,
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => cities.find((flight) => flight.id === args.id),
    },
  }),
});

//Defining Schema
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

//Using GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

//Starting server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
