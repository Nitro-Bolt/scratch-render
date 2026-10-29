/**
 * Multiply one component of a camera transform without allowing Infinity * 0 to become NaN.
 * @param {number} value coordinate to transform
 * @param {number} coefficient matrix coefficient
 * @returns {number} transformed component
 */
const multiplyTransformComponent = (value, coefficient) => (coefficient === 0 ? 0 : value * coefficient);

module.exports = multiplyTransformComponent;
