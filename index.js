function normalizeText(text) {
    const stopwords = new Set(["a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "in", "on", "at", "of", "to", "for"]);
    return text
        .toLowerCase() 
        .replace(/[^a-z0-9\s]/g, "") 
        .split(/\s+/) 
        .filter(word => !stopwords.has(word));
}
function calculateSimilarity(words1, words2) {
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    return (intersection.size / Math.min(set1.size, set2.size)) * 100; 
}
function processAssignments(assignments) {
    const processed = {};
    assignments.forEach(({ id, text }) => {
        processed[id] = normalizeText(text);
    });
    return processed;
}
function generateSimilarityReport(processedAssignments) {
    const ids = Object.keys(processedAssignments);
    const report = [];

    for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
            const id1 = ids[i];
            const id2 = ids[j];
            const similarity = calculateSimilarity(processedAssignments[id1], processedAssignments[id2]);
            report.push({ pair: [id1, id2], similarity });
        }
    }

    return report;
}
function flagAssignments(report, threshold = 80) {
    return report.filter(({ similarity }) => similarity > threshold);
}
const assignments = [
    { id: "A1", text: "This is the first assignment text." },
    { id: "A2", text: "This is the second assignment. It has some similar text." },
    { id: "A3", text: "The third assignment contains completely unique content." },
    { id: "A4", text: "This is the first assignment text but rewritten slightly." }
];
const processedAssignments = processAssignments(assignments);
const similarityReport = generateSimilarityReport(processedAssignments);
const flaggedAssignments = flagAssignments(similarityReport, 80);
console.log("Similarity Report:", similarityReport);
console.log("Flagged Assignments:", flaggedAssignments);
