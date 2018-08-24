/**
 * A function for tagged template literals that encodes params for URLs.
 */
export default function encodeParams(template, ...expressions) {
    return template.reduce((a, part, i) => {
        return a + encodeURIComponent(expressions[i - 1]) + part;
    });
}
