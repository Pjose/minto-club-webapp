/**
 * Returns true if any string value within the nested data structure is an empty
 * string (or a string with only whitespaces), and false otherwise
 */
export const hasEmptyString = (data) => {
    // 1. Check if the current value is a string
    if (typeof data === 'string') {
        // Return true if the string is empty or contains only whitespace
        return data.trim().length === 0;
    }

    // 2. Check if the current value is an array
    if (Array.isArray(data)) {
        // Iterate over the array elements
        for (const item of data) {
            // Recursively call the function for each element
            if (hasEmptyString(item)) {
                return true; // Found an empty string in a nested structure
            }
        }
    }

    // 3. Check if the current value is an object (and not null)
    if (typeof data === 'object' && data !== null) {
        // Iterate over the object's values
        for (const value of Object.values(data)) {
            // Recursively call the function for each value
            if (hasEmptyString(value)) {
                return true; // Found an empty string in a nested structure
            }
        }
    }

    // If none of the above conditions returned true, there are no empty strings
    return false;
};

/**
 * Recursively checks if all string values in an array or object are empty strings.
 * Considers null, undefined, false, 0, and empty arrays/objects as "empty" in this context.
 * 
 * @param {*} val The value to check.
 * @returns {boolean} True if all values are empty, false otherwise.
 */
export const areAllEmptyStrings = (val) => {
    // Check for primitive falsy values (null, undefined, false, 0, "")
    if (!val && val !== 0 && val !== false) {
        return true;
    }

    // If it is an array or object, recursively check its contents
    if (typeof val === "object" && val !== null) {
        const values = Array.isArray(val) ? val : Object.values(val);
        // Use Array.prototype.every() to check if all elements satisfy the condition
        // For an empty array, every() returns true (vacuously true).
        return values.every(areAllEmptyStrings);
    }
    
    // For other non-falsy primitive types (like numbers, booleans, or non-empty strings), 
    // it is not "empty" according to the requirement, so return false.
    return false;
};
