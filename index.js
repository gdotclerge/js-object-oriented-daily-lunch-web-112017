let store = {deliveries: [], customers: [], meals: [], employers: []};
let employerId = 0;
let deliveryId = 0;
let mealId = 0;
let customerId = 0;


class Customer {
  constructor(name, employer) {
    this.id = ++customerId;
    this.name = name;
    this.employer = employer;
    store.customers.push(this);
  }

  totalSpent() {
    let monies = store.deliveries.filter(function(delivery) {
      return delivery.customerId === this.id;
    }.bind(this));
    return monies.reduce(function(a, b) {
        return a.meal().price + b.meal().price;
    });
  }

  deliveries() {
    return store.deliveries.filter(function(delivery) {
      return this.id === delivery.customerId;
    }.bind(this));
  }

  meals() {
    return this.deliveries().map(function(delivery){
      return delivery.meal()
    })
  }

}



class Meal {
  constructor(title, price) {
    this.id = ++mealId;
    this.title = title;
    this.price = price;
    store.meals.push(this);
  }

  static byPrice() {
    return store.meals.sort(function(meal1, meal2) {
      return meal2.price - meal1.price;
    });
  }

  deliveries() {
    return store.deliveries.filter(function(delivery) {
      return delivery.mealId === this.id;
    }.bind(this));
  }

  customers() {
    return this.deliveries().map(function(delivery){
      return delivery.customer()
    })
  }

}



class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveryId;

    if (customer) {
      this.customerId = customer.id;
    }

    if (meal) {
      this.mealId = meal.id;
    }

    store.deliveries.push(this);
  }

  customer(){
    return store.customers.find(function(customer) {
      return customer.id === this.customerId;
    }.bind(this));
  }

  meal(){
    return store.meals.find(function(meal) {
      return meal.id === this.mealId;
    }.bind(this));
  }

}



class Employer {
  constructor(name) {
    this.name = name;
    this.id = ++employerId;
    store.employers.push(this);
  }

  employees() {
    return store.customers.filter(function(customer) {
      return customer.employer === this;
    }.bind(this));
  }

  deliveries(){
    let deliv =  this.employees().map(function(employee){
      return employee.deliveries()
    })

    return flatten(deliv)
  }

  meals(){
    return this.deliveries().map(function(delivery){
      return delivery.meal()
    }).unique()
  }

  nonUniqueMeals(){
    return this.deliveries().map(function(delivery){
      return delivery.meal()
    })
  }

  mealTotals(){
    let totalMeals = {}

    for (let meal of this.nonUniqueMeals()){
      if (totalMeals[meal.id]){
        totalMeals[meal.id] += 1;
      } else {
        totalMeals[meal.id] = 1
      }
    }
    return totalMeals;
  }
}




function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}
