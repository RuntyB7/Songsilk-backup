export const Stats = {
    KEY: 'songsilk_stats',
    load() {
        const data = JSON.parse(localStorage.getItem(this.KEY));
        if(!data) {
            return { victories: 0, deaths: 0 };
        }

        return {
            victories: data.victories ?? 0,
            deaths: data.deaths ?? 0,
        };
    },

    save(stats) {
        localStorage.setItem(this.KEY, JSON.stringify(stats));
    },

    addVictory() {
        const stats = this.load();
        stats.victories++;
        this.save(stats);
    },

    addDeath() {
        const stats = this.load();
        stats.deaths++;
        this.save(stats);
    }

}