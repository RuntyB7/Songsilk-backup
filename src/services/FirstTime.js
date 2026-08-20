export const FirstTime = {
    KEY: "songsilk_first_time",

    isFirstTime() {
        return localStorage.getItem(this.KEY) !== "false";
    },

    markAsPlayed() {
        localStorage.setItem(this.KEY, "false");
    }
};