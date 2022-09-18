'use strict';

/**
 * sauce service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sauce.sauce');
