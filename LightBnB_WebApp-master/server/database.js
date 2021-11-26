const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `
  SELECT *
  FROM users
  WHERE users.email = $1
  `
  const value = [email] //accepts an email address

  return pool
  .query(queryString, value)
  .then((res) => {
    return res.rows[0]; // promise resolves with user that has an email
  })
  .catch(() => {
    return null; // if the user does not exist return null
  })
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `
  SELECT *
  FROM users
  WHERE users.id = $1
  `

  const value = [id]

  return pool
  .query(queryString, value)
  .then((res) => {
    return res.rows[0];
  })
  .catch (() => {
    return null;
  })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const inputString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const value = [user.name, user.email, user.password];

  return pool
  .query(inputString, value)
  .then((res) => {
    const newUser = {
      id: res.rows.id,
      name: res.rows.name,
      email: res.rows.email,
      password: res.rows.password
    }
    return newUser;
  })
  .catch((err) => {
    console.error(err.message);
  })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
  .query(`
  SELECT *
  FROM properties
  JOIN reservations
  ON property_id = properties.id
  WHERE guest_id = $1
  LIMIT $2`, [guest_id, limit])

    .then((res) => {
      return res.rows
    })
    .catch(() => {
      return null;
    });
  }
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*,
  AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `
  if(options.owner_id) {
    queryParams.push(options.owner_id);
    queryString = queryString + ` WHERE owner_id = $${queryParams.length}`
  }

  if(options.city) {
    queryParams.push(`%${options.city}%`)
    queryString = queryString + ` WHERE city LIKE $${queryParams.length}`
  }

  if(options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100);
    queryString = queryString + `AND (properties.cost_per_night >= $${queryParams.length - 1} AND properties.cost_per_night <= $${queryParams.length})`
  }

  if(options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString = queryString + `AND property_reviews.rating >= $${queryParams.lengh}`;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
  .then((res) => res.rows)
  .catch((err) => console.log(err.message));
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
