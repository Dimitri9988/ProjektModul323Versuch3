const { generateMessage } = require("./index");
/*
test("erstellen einer Karte", () => {
    const result = update(INPUT_LOCATION)
    
});
*/
test("überprüft die generateMessage auf ihre funktionalität", () => {
    const result = generateMessage("eine msg", "INPUT_LOCATION")
    const expected = "eine msg";
    const expected2 = "INPUT_LOCATION"
    expected(result).toBe(expected, expected2);
});