# Using GraphQL with Express and without a database

## Query Examples

### All Cities

```
query AllCities {
  cities {
    id,
    name,
    flights {
      id,
      name
    }
  }
}

```

### Single City

```
query SingleCity {
  city(id:1) {
    id,
    name,
    flights {
      id,
      name
    }
  }
}

```

### All Flights

```
query AllFlights {
  flights {
    id,
    name,
    city {
      id,
      name
    }
  }
}
```

### Single Flight

```
query SingleFlight {
  flight(id:1) {
    id,
    name,
    city {
      id,
      name
    }
  }
}
```

## Mutation Examples

### Add Flight

```
mutation AddFlight {
  addflight(name:"flight8", cityId: 3) {
    id,
    name,
    city {
      id,
      name
    }
  }
}
```

### Add City

```
mutation AddCity {
  addcity(name:"Hong Kong") {
    id,
    name
  }
}
```
