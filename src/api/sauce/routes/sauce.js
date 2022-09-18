'use strict';

/**
 * sauce router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sauce.sauce');
