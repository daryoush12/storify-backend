import {uid} from "../src/util/uid";

describe("Generate new uid token", () => {
    it("Should return token of 24 character length", () => {
        const token = uid(24);
        console.log(token);
        expect(token.length).toBe(24);
    });
});
