'use strict';

/**
 * sauce controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::sauce.sauce');
